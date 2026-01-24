import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.48";
import { corsHeaders } from "../_shared/cors.ts";
import { rndm } from "../_shared/fns.ts";

Deno.serve(async (req) => {
    const sb = createClient(
        Deno.env.get('SUPABASE_URL'),
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const headers = { ...corsHeaders };

    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                ...headers
            }
        });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ response: 'Authorization header missing' }), {
            status: 401,
            headers: {
                ...headers
            }
        });
    }

    const token = authHeader.split(' ')[1];
    const { data: user, error } = await sb.auth.getUser(token);
    if (error || !user) {
        return new Response(JSON.stringify({ response: 'Invalid JWT' }), {
            status: 401,
            headers: {
                ...headers
            }
        });
    }

    let uid: string | null = null;
    let code: string | null = null;

    try {
        const body = await req.json();
        uid = body.uid || null;
        code = body.code || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    if (!uid) {
        return new Response(JSON.stringify({ response: "UID is required" }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

   
    const { data: recuser, error: userExistsErrorn } = await sb
        .from("users")
        .select("username")
        .eq("id", uid)
        .single();

    if (userExistsErrorn || !recuser) {
        return new Response(JSON.stringify({ response: `User ${uid} does not exist in the 'users' table.` }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    const { data: pcode, error: perr } = await sb.from("promocodes").select("*").eq("code", code).single();
    if (perr || !pcode) {
        return new Response(JSON.stringify({ response: `Invalid promo code.` }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    try {
        var usedby = pcode.used_by.split(" ").filter(Boolean);
        let isExpired = false;
        const expRaw = (pcode.expiration instanceof Date) ? pcode.expiration.toISOString().slice(0, 10) : String(pcode.expiration);
        const parts = expRaw.split("-");
        if (parts.length === 3) {
            const [y, m, d] = parts.map(Number);
            if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
                const expMs = Date.UTC(y, m - 1, d + 1);
                isExpired = Date.now() >= expMs;
            }
        }
        if (usedby.includes(recuser.username) || usedby.length >= pcode.limit_uses || pcode.isExpired) {
            return new Response(JSON.stringify({ response: `This promo code already expired.` }), {
                status: 400,
                headers: {
                    ...headers
                }
            });
        }
        const { data: balance, error: balerr } = await sb.from("udata").select("*").eq("user_id", uid).single();
        if (balerr || !balance) {
            return new Response(JSON.stringify({ response: `We had issues accessing the database. Please check your internet connection and try again.` }), {
                status: 400,
                headers: {
                    ...headers
                }
            });
        }
    } catch (error) {
        console.error("Error processing request", error);
        return new Response(JSON.stringify({ response: "Internal Server Error.3" }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    } try {
        var rewards: Object = JSON.parse(pcode.rewards);
        if (rewards["noca"]) {
            if (!(rewards["noca"] instanceof Number)) {
                var tmp = rewards["noca"].split("-");
                tmp = tmp.map((x: string) => parseFloat(x));
                rewards["noca"] = Math.floor(rndm(tmp[0], tmp[1], tmp[2]))
            }
        }
        if (rewards["nus"]) {
            if (!(rewards["nus"] instanceof Number)) {
                var tmp = rewards["nus"].split("-");
                tmp = tmp.map((x: string) => parseFloat(x));
                rewards["nus"] = rndm(tmp[0], tmp[1], tmp[2])
            }
        }
        if (rewards["sats"]) {
            if (!(rewards["sats"] instanceof Number)) {
                var tmp = rewards["sats"].split("-");
                tmp = tmp.map((x: string) => parseFloat(x));
                rewards["sats"] = rndm(tmp[0], tmp[1], tmp[2])
            }
        }
    } catch (error) {
        console.error("Error processing request", error);
        return new Response(JSON.stringify({ response: "Internal Server Error.4" }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    } try {
        var updateds: Object = {};
        var messageparts: string[] = [];
        updateds["balance_noca"] = balance["balance_noca"] + (rewards["noca"] || 0);
        if (rewards["noca"] > 0) messageparts.push(rewards["noca"] === 1 ? "1 Noca" : `${rewards["noca"]} Nocas`);
        updateds["balance_nus"] = balance["balance_nus"] + (rewards["nus"] || 0);
        if (rewards["nus"] > 0) messageparts.push(`${rewards["nus"]} $NUS`);
        updateds["balance_sats"] = balance["balance_sats"] + (rewards["sats"] || 0);
        if (rewards["sats"] > 0) messageparts.push(`${rewards["sats"]} Satoshis`);
        updateds["inventory"] = balance["inventory"]; //do this one later
        usedby.push(recuser.username);
    } catch (error) {
        console.error("Error processing request", error);
        return new Response(JSON.stringify({ response: "Internal Server Error.5" }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    } try {
        const { error: cannotAdd } = await sb.from("promocodes").update({ used_by: usedby.join(" ") }).eq("code", code);
        const { error: cannotUpdate } = await sb.from("udata").update(updateds).eq("user_id", uid);
        if (cannotUpdate || cannotAdd) {
            return new Response(JSON.stringify({ response: `Error: ${cannotUpdate.message || cannotAdd.message}`, sc:true }), {
                status: 401,
                headers: {
                    ...headers
                }
            });
        }

        return new Response(JSON.stringify({ response: pcode.message + "\n" + "You have received: "+messageparts.join(", ")+"!", sc:true }), {
            status: 200,
            headers: {
                ...headers
            }
        });
    } catch (error) {
        console.error("Error processing request", error);
        return new Response(JSON.stringify({ response: "Internal Server Error.999" }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }
});
