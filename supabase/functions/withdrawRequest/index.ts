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
    let network: string | null = null;
    let amount: number | null = null;
    let address: string | null = null;

    try {
        const body = await req.json();
        uid = body.uid || null;
        amount = parseInt(body.amount) || null;
        network = body.network || null;
        address = body.address || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    if (!uid || !amount || !network || !address) {
        return new Response(JSON.stringify({ response: "UID is required" }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    let fee: number = 0;
    if ((network === "spd" && ((amount < 10) || (amount > 10000))) || (network === "lgn" && ((amount < 2000) || (amount > 10000))) || (network === "btc" && ((amount < 20000) || (amount > 1000000))) || (network === "bnb" && ((amount < 100) || (amount > 100000000)))) {
        return new Response(JSON.stringify({ response: "Requested withdrawal amount is invalid." }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }
    if (network === "spd") fee = String(amount).length;
    else if (network === "lgn") fee = 100;
    else if (network === "btc") fee = 3000;

    const { data: balance, error: balanceError } = await supabase.from("udata")
        .select("balance_sats").eq("user_id", uid).single();

    if (balanceError || !balance) return new Response(JSON.stringify({ response: "Something went wrong." }), {
        status: 400,
        headers: {
            ...headers
        }
    });

    if (balance.balance_sats < (amount + fee)) return new Response(JSON.stringify({ response: "Insufficient funds." }), {
        status: 400,
        headers: {
            ...headers
        }
    });
    

    try {
        let from: string = "";
        const { data: recuser, error: userExistsErrorn } = await supabase
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
        } else {
            from = recuser.username;
        }

        const { error: balanceupError } = await supabase.from("udata")
            .update({ "balance_sats": balance.balance_sats - amount - fee }).eq("user_id", uid).single();
        if (balanceupError) return new Response(JSON.stringify({ response: "Something went wrong." }), {
            status: 400,
            headers: {
                ...headers
            }
        });

        const { error: logError } = await supabase
            .from("logs")
            .insert([{ created_by: from, type: "WITHDRAWAL_REQUEST", attributes: "network->" + network + "\nfee->" + fee, message: "amount->"+amount+"\naddress->"+address }]);
        if (logError) {
            return new Response(JSON.stringify({ response: `Internal server error.` }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }

        return new Response(JSON.stringify({ response: "Withdrawal request was submitted!<br>Please wait patiently before we process it.", sc:true }), {
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
