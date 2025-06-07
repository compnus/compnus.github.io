import "npm:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
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
    let title: string | null = null;
    let message: string | null = null;

    try {
        const body = await req.json();
        uid = body.uid || null;
        to = body.to || null;
        title = body.title || null;
        message = body.message || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    const { data: nData, error: nError } = await supabase.from("udata").select("can_message").eq("user_id", uid).single();
    if (!nData || nError) {
        return new Response(JSON.stringify({ response: "We had problems processing the message.", type: 0, message: "You can try sending the message again. If the issue presists, please contact support." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    if (nData.can_message === false) {
        return new Response(JSON.stringify({ response: "You are not allowed to send messages.", type: 0, message: "You have been banned from sending messages. If you think we've made a mistake, feel free to appeal by contacting support." }), {
            status: 500,
            headers: { ...headers }
        });
    }

    var length = message.length;
    var breaks = message.split("\n").length - 1;
    var lefts = message.split("<").length - 1;
    var rights = message.split(">").length - 1;
    var amps = message.split("&").length - 1;
    var lbr = message.split("{{").length - 1;
    var rbr = message.split("}}").length - 1;
    var hrs = message.split("{l}").length - 1;
    var hs = message.split("{h}").length - 1;
    var nhs = message.split("{/h}").length - 1;
    var quts = message.split('"').length - 1;
    var links = message.split("{link}").length - 1;
    var imgs = message.split("{img}").length - 1;
    var nbsps = message.split("{!}").length - 1;
    var imgsts = (message.split("{img1}").length - 1) + (message.split("{img2}").length - 1) + (message.split("{img3}").length - 1) + (message.split("{img4}").length - 1) + (message.split("{img5}").length - 1) + (message.split("{img6}").length - 1) + (message.split("{img7}").length - 1) + (message.split("{img8}").length - 1);
    length = length + ((breaks + amps) * 4) + ((lefts + rights + nbsps) * 3) + ((lbr + rbr) * 6) + (hs + nhs) + quts * 5 + (imgs * 2) + (imgsts * 15) + hrs * 8 + links * 30;
    var price = 1 + links + (Math.floor((length - 1) / 50) >= 0 ? Math.floor((length - 1) / 50) : 0);

    const { data: balancenoca, error: userExistsError } = await supabase
        .from("udata")
        .select("balance_noca")
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

    if (price > balancenoca.balance_noca) {
        return new Response(JSON.stringify({ response: "Not enough Nocas!", type: 0, message: "You do not have enough Nocas to pay for the network fee and send this message." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    message = message.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split("\n").join("<br>").split("{l}<br>").join("{l}")
        .split("{{").join("&lbrace;").split("}}").join("&rbrace;").split("{b}").join("<b>").split("{/b}").join("</b>").split("{i}").join("<i>").split("{/i}").join("</i>").split("{u}").join("<u>").split("{/u}").join("</u>")
        .split("{s}").join("<s>").split("{/s}").join("</s>").split("{h}").join("<h0>").split("{/h}").join("</h0>").split("{l}").join("</p><hr><p>").split("{link}").join("<a class='linkstv' target='_blank' href='").split("{text}").join("'>")
        .split("{/link}").join("</a>").split("{/img}").join("'>").split("{img}").join("<img src='").split("{img1}").join("<img class='i1' src='").split("{img2}").join("<img class='i2' src='").split("{img3}").join("<img class='i3' src='")
        .split("{img4}").join("<img class='i4' src='").split("{img5}").join("<img class='i5' src='").split("{img6}").join("<img class='i6' src='").split("{img7}").join("<img class='i7' src='").split("{img8}").join("<img class='i8' src='")
        .split("{!}").join("&nbsp;");

    if (title.length > 100) {
        return new Response(JSON.stringify({ response: "The title is too long!", type: 0, message: "Please make sure that the amount of characters in your title doesn't exceed 100 characters." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    title = title.split("<").join("").split(">").join("").split("&").join("&amp;");

    if (!uid) {
        return new Response(JSON.stringify({ response: "UID is required" }), {
            status: 400,
            headers: {
                ...headers
            }
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

        const { data: bData, error: bError } = await supabase.from("users").select("blocked_users").eq("username", to).single();
        if (!bData || bError) {
            return new Response(JSON.stringify({ response: "We had problems processing the message.", type: 0, message: "You can try sending the message again. If the issue presists, please contact support." }), {
                status: 501,
                headers: { ...headers }
            });
        }
        if (bData.blocked_users.indexOf(from) > -1) {
            return new Response(JSON.stringify({ response: "You are blocked!", type: 0, message: "This user has blocked you. Your message will not be delivered. You were not charged." }), {
                status: 501,
                headers: { ...headers }
            });
        }

        let upmessage: string = `%$t%${title}%$,%%$f%${from}%$,%%$m%<p>${message}</p>%$$%`;

        const { data: senuser, error: userExistsError } = await supabase
            .from("users")
            .select("messages")
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
            const { error: cannotSend } = await supabase
                .from("users")
                .update({ messages: upmessage + senuser.messages })
                .eq("username", to);
            if (cannotSend) {
                return new Response(JSON.stringify({ response: `Could not send message to ${to} due to error: ${cannotSend}` }), {
                    status: 401,
                    headers: {
                        ...headers
                    }
                });
            }
            const { error: logError } = await supabase
                .from("logs")
                .insert([{ created_by: from, type: "normalMessage", attributes: "to->" + to, message: "title->" + title + "\ncontent->" + message }]);
            if (logError) {
                return new Response(JSON.stringify({ response: `Internal server error.` }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
        }

        const { error: cannotDeduct } = await supabase
            .from("udata")
            .update({ balance_noca: balancenoca.balance_noca - price })
            .eq("user_id", uid);

        if (cannotDeduct) {
            return new Response(JSON.stringify({ response: `Database Update Error`, type:0, message: "The message might have been sent, but the database wasn't able to process it.\nIt is unknown whether the message was actually be delivered.\nYou have not been charged any Nocas." }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }

        return new Response(JSON.stringify({ response: "Message sent successfully!", type:1 }), {
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
