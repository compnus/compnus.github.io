import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.48";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
    const supabase = createClient(
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
    const { data: user, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return new Response(JSON.stringify({ response: 'Invalid JWT' }), {
            status: 401,
            headers: {
                ...headers
            }
        });
    }

    let uid: string | null = null;
    let btc: boolean | null = null;
    let amount: string | null = null;

    try {
        const body = await req.json();
        uid = body.uid || null;
        btc = body.btc || null;
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

    if (!uid) {
        return new Response(JSON.stringify({ response: "UID is required" }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    const { data: nData, error: nError } = await supabase.from("udata").select("balance_nus, balance_noca, balance_sats").eq("user_id", uid).single();
    if (!nData || nError) {
        return new Response(JSON.stringify({ response: "We had problems processing the exchange." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    if (parseInt(amount) < (btc?100:10)) {
        return new Response(JSON.stringify({ response: "Please enter a valid amount to send.", sc:true }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    var toPay: number = parseFloat((parseInt(amount) / parseInt((await supabase.from("variable").select("value").eq("key", (btc ? "nocaforsat" : "nocafornus")).single()).value)).toFixed(4));
    if (toPay > (btc ? nData.balance_sats : nData.balance_nus)) {
        return new Response(JSON.stringify({ response: "Insufficient funds.", sc: true }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    try {
        var sendData, sendError;
        if (btc) {
            ({ data: sendData, error: sendError } = await supabase.from("udata").update({ balance_noca: nData.balance_noca + parseInt(amount), balance_sats: nData.balance_sats - toPay }).eq("user_id", uid));
        } else {
            ({ data: sendData, error: sendError } = await supabase.from("udata").update({ balance_noca: nData.balance_noca + parseInt(amount), balance_nus: nData.balance_nus - toPay }).eq("user_id", uid));
        }

        if (!sendData || sendError) {
            return new Response(JSON.stringify({ response: "There was a problem updating your balance.", obj: (await supabase.from("variable").select("value").eq("key", (btc ? "nocaforsat" : "nocafornus")).single()) }), {
                status: 400,
                headers: {
                    ...headers
                }
            });
        }

        return new Response(JSON.stringify({ response: "Exchange was successful!", sc:true }), {
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
