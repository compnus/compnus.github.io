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
    let from: string | null = null;
    let to: string | null = null;
    let currency: string | null = null;
    let amount: string | null = null;
    let fee: string | null = null;
    let message: string | null = null;

    try {
        const body = await req.json();
        uid = body.uid || null;
        to = body.to || null;
        currency = body.currency || null;
        amount = body.amount || null;
        fee = body.fee || null;
        message = body.message || null;
        message = message.substring(0, 100);
        message.split("<").join("").split(">").join("").split("\n").join("").split("  ").join(" ");
        message.split("&").join("&amp;");
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" }), {
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

    const { data: nData, error: nError } = await supabase.from("udata").select("can_message").eq("user_id", uid).single();
    if (!nData || nError) {
        return new Response(JSON.stringify({ response: "We had problems processing the message.", message: "You can try sending the message again. If the issue persists, please contact support." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    if (nData.can_message === false) {
        return new Response(JSON.stringify({ response: "You are not allowed to send messages.", message: "You have been banned from sending messages. If you think we've made a mistake, feel free to appeal by contacting support." }), {
            status: 500,
            headers: { ...headers }
        });
    }

    const { data: balancenoca, error: userExistsError } = await supabase
        .from("udata")
        .select("balance_"+currency)
        .eq("user_id", uid)
        .single();

    if (!balancenoca || userExistsError) {
        return new Response(JSON.stringify({ response: "Unknown error." }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    var calcFee: number = 0;
    var parsedAmount: number = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return new Response(JSON.stringify({ response: "Please enter a valid amount to send.", sc:true }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }
    if (currency == "nus") {
        if (parsedAmount / 20 <= 0.005) calcFee = 0.005;
        else if (parsedAmount / 20 >= 1) calcFee = 1;
        else calcFee = parseFloat((parsedAmount / 20).toFixed(3));
    } else if (currency == "noca") {
        parsedAmount = Math.floor(parsedAmount);
        if (parsedAmount / 100 >= 95) calcFee = 100;
        else calcFee = Math.floor(parsedAmount / 100) + 5;
    } else if (currency == "sat") {
        calcFee = 5;
    }

    var totalToSend: number = 0;
    var totalReceived: number = 0;

    if (fee == "extra") {
        totalReceived = parseFloat(parsedAmount.toFixed(8));
        totalToSend = parseFloat((parsedAmount + calcFee).toFixed(8));
    } else if (fee == "part") {
        totalReceived = parseFloat((parsedAmount - calcFee).toFixed(8));
        totalToSend = parseFloat(parsedAmount.toFixed(8));
    }

    if (totalReceived <= 0) {
        return new Response(JSON.stringify({ response: "Please enter a valid amount to send.", sc: true }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    if (currency == "noca") {
        totalToSend = Math.floor(totalToSend);
        totalReceived = Math.floor(totalReceived);
    } else if (currency == "sat") {
        totalToSend = parseFloat(totalToSend.toFixed(4));
        totalReceived = parseFloat(totalReceived.toFixed(4));
        currency = "sats";
    }

    if (totalToSend > balancenoca["balance_"+currency]) {
        return new Response(JSON.stringify({ response: "Your balance is insufficient.", sc:true }), {
            status: 501,
            headers: { ...headers }
        });
    }

    try {
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

        const { data: bData, error: bError } = await supabase.from("users").select("blocked_users, id").eq("username", to).single();
        if (!bData || bError) {
            return new Response(JSON.stringify({ response: "The recipient does not exist." }), {
                status: 501,
                headers: { ...headers }
            });
        }
        if (bData.blocked_users.indexOf(from) > -1 && message.length > 0) {
            return new Response(JSON.stringify({ response: "This user has blocked you.<br>You can still complete the transaction if you remove the message.", sc:true }), {
                status: 501,
                headers: { ...headers }
            });
        }

        var currencyThing: string = "";

        if (currency === "nus") currencyThing = "$";
        else if (currency === "noca") currencyThing = "¤";
        else if (currency === "sats") {
            currencyThing = "₿";
        }

        var finalMessage: string = message.length > 0 ? `<br><b>Message from sender:</b> ${message}` : ``;

        let upmessage: string = `%$t%You have received ${totalReceived} <span style="font-family: 'currencycompnus',Ubuntu !important">${currencyThing} from ${from}!%$,%%$f%CompNUS%$,%%$m%<p>The amount has been added to your balance.${finalMessage}</p>%$$%`;

        const { data: senuser, error: userExistsError } = await supabase
            .from("users")
            .select("messages, balance_"+currency)
            .eq("username", to)
            .single();

        if (userExistsError || !senuser) {
            return new Response(JSON.stringify({ response: `User ${to} does not exist.` }), {
                status: 404,
                headers: {
                    ...headers
                }
            });

        } else {
            var updateds: Object = {};
            var sends: Object = {};
            if (currency === "nus") {
                updateds = { balance_nus: balancenoca.balance_nus - totalToSend };
                sends = { balance_nus: senuser.balance_nus + totalReceived };
            } else if (currency === "noca") {
                updateds = { balance_noca: balancenoca.balance_noca - totalToSend };
                sends = { balance_noca: senuser.balance_noca + totalReceived };
            } else if (currency === "sats") {
                updateds = { balance_sats: balancenoca.balance_sats - totalToSend };
                sends = { balance_sats: senuser.balance_sats + totalReceived };
            }
            const { error: cannotDeduct } = await supabase
                .from("udata")
                .update(updateds)
                .eq("user_id", uid);
            const { error: cannotAdd } = await supabase
                .from("udata")
                .update(sends)
                .eq("user_id", bData.id);
            const { error: cannotSend } = await supabase
                .from("users")
                .update({ messages: upmessage + senuser.messages })
                .eq("username", to);
            if (cannotSend || cannotDeduct || cannotAdd) {
                return new Response(JSON.stringify({ response: `Transaction failed: ${cannotSend.message || cannotDeduct.message || cannotAdd.message}`, sc:true }), {
                    status: 401,
                    headers: {
                        ...headers
                    }
                });
            }
            const { error: logError } = await supabase
                .from("logs")
                .insert([{ created_by: from, type: "transaction", attributes: "to->" + to + "\ncurrency->" + currency + "\nsent->" + totalToSend + "\nreceived->" + totalReceived, message: "message->" + message }]);
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
