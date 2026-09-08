import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.48";
import { corsHeaders } from "../_shared/cors.ts";

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
    let amount: string | null = null;

    try {
        const body = await req.json();
        uid = body.uid || null;
        amount = body.amount || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    if (!uid || uid != user.user.id) {
        return new Response(JSON.stringify({ response: "UID is required" }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }
    const { data: uname, error: unoerr } = await sb.from("users").select("username").eq("id", uid).single();
    const { data: nData, error: nError } = await sb.from("udata").select("balance_sats, coins").eq("user_id", uid).single();
    if (!nData || nError || unoerr) return new Response(JSON.stringify({ response: "We had problems processing the exchange." }), {
            status: 501,
            headers: { ...headers }
        });
    var from: string = uname.username;

    if (parseInt(amount) < 10) {
        return new Response(JSON.stringify({ response: "Please enter a valid amount to purchase.", sc:true }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    var vals = await sb.from("variable").select("value").eq("key","coinvalue_buy");
    var pricebtc;
    await fetch('https://api.coinlore.net/api/ticker/?id=90').then(response => response.json()).then(json => json.forEach(x => { pricebtc = x.price_usd }));
    var value = parseFloat((parseFloat(vals) / (pricebtc / 100000000)).toFixed(4));
    var toPay: number = parseFloat((parseInt(amount) * value).toFixed(4));
    if (toPay > nData.balance_sats) {
        return new Response(JSON.stringify({ response: "Insufficient funds.", sc: true }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    try {
        const { error: sendError } = await sb.from("udata").update({ coins: nData.coins + parseInt(amount), balance_sats: Math.round((nData.balance_sats - toPay)*10000)/10000 }).eq("user_id", uid);

        if (sendError) {
            return new Response(JSON.stringify({ response: "There was a problem updating your balance." }), {
                status: 400,
                headers: {
                    ...headers
                }
            });
        }

        let resources = {};
        resources["sat"] = toPay;
        await sb.from("transaction").insert({ from: from, to: "CompNUS", resource: resources, message: "Exchange for Marks", expiration: 1 });
        await sb.from("transaction").insert({ from: "admin:CompNUS", to: from, resource: {"coin": parseInt(amount)}, message: "Purchase for Bitcoin", expiration: 1});

        return new Response(JSON.stringify({ response: "Purchase was successful!", sc:true }), {
            status: 200,
            headers: {
                ...headers
            }
        });
    } catch (error) {
        console.error("Error processing request", error);
        return new Response(JSON.stringify({ response: "Internal Server Error." }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }
});
