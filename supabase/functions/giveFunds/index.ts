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

    let uid: string | null = user.user.id;
    let muid: string | null = null;
    let to: string | null = null;
    let currency: string | null = null;
    let amount: string | null = null;
    let message: string | null = null;

    try {
        const body = await req.json();
        muid = body.uid || null;
        to = body.to || null;
        currency = body.currency || null;
        amount = body.amount || null;
        message = body.message || null;
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

    if (muid !== uid) {
        const { error } = await sb
            .from("logs")
            .insert([{ created_by: uid, type: "WARNING", attributes: "?admin_impersonation_funds", message: "user " + uid + " tried to impersonate " + muid }]);
        return new Response(JSON.stringify({ response: "You have been reported for attempting to impersonate an admin." }), {
            status: 403,
            headers: { ...headers }
        });
    }

    const { data: nData, error: nError } = await sb.from("udata").select("admin").eq("user_id", uid).single();
    if (!nData || nError) {
        return new Response(JSON.stringify({ response: "We had problems processing the transaction." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    if (nData.admin === false) {
        return new Response(JSON.stringify({ response: "You are not an admin." }), {
            status: 403,
            headers: { ...headers }
        });
    }

    var parsedAmount: number = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return new Response(JSON.stringify({ response: "Please enter a valid amount to send.", sc:true }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    try {
        var currencyThing: string = "";

        if (currency === "nus") currencyThing = "$";
        else if (currency === "noca") currencyThing = "¤";

        var finalMessage: string = (message && (message.length > 0)) ? `${message}<br>` : ``;

        let upmessage: string = `%$t%You have received ${parsedAmount} <span style="font-family: 'currencycompnus',Ubuntu !important; font-weight: normal !important;">${currencyThing}</span>%$,%%$f%CompNUS%$,%%$m%<p>${finalMessage}The amount has been added to your balance.</p>%$$%`;

        const { data: senuser, error: userExistsError } = await sb
            .from("users")
            .select("messages")
            .eq("username", to)
            .single();

        const { data: bData, error: bError } = await sb.from("users").select("id").eq("username", to).single();
        if (!bData || bError) {
            return new Response(JSON.stringify({ response: `User ${to} does not exist.` }), {
                status: 404,
                headers: {
                    ...headers
                }
            });
        }

        const { data: senuserc, error: userExistsErrorc } = await sb
            .from("udata")
            .select("balance_" + currency)
            .eq("user_id", bData.id)
            .single();

        if (userExistsError || !senuser || userExistsErrorc || !senuserc) {
            return new Response(JSON.stringify({ response: `User ${to} does not exist.` }), {
                status: 404,
                headers: {
                    ...headers
                }
            });

        } else {
            var sends: Object = {};
            if (currency === "nus") {
                sends = { balance_nus: senuserc.balance_nus + parsedAmount };
            } else if (currency === "noca") {
                sends = { balance_noca: senuserc.balance_noca + parsedAmount };
            }
            const { error: cannotAdd } = await sb
                .from("udata")
                .update(sends)
                .eq("user_id", bData.id);
            const { error: cannotSend } = await sb
                .from("users")
                .update({ messages: upmessage + senuser.messages })
                .eq("username", to);
            if (cannotSend || cannotAdd) {
                return new Response(JSON.stringify({ response: `Transaction failed: ${cannotSend.message || cannotAdd.message}`, sc:true }), {
                    status: 401,
                    headers: {
                        ...headers
                    }
                });
            }
            const { error: logError } = await sb
                .from("logs")
                .insert([{ created_by: uid, type: "adminTransaction", attributes: "to->" + to + "\ncurrency->" + currency + "\ngiven->" + parsedAmount, message: "message->" + message }]);
            if (logError) {
                return new Response(JSON.stringify({ response: `Internal server error.` }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
        }

        return new Response(JSON.stringify({ response: "Transaction successful!", sc:true }), {
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
