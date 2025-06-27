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
    let to: string | null = null;
    let title: string | null = null;
    let message: string | null = null;
    let packedResponse: string = "";

    try {
        const body = await req.json();
        uid = body.uid || null;
        to = body.to || null;
        title = body.title || null;
        message = body.msg || null;
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

    const { data: nData, error: nError } = await supabase.from("udata").select("admin").eq("user_id", uid).single();
    if (!nData || nError) {
        return new Response(JSON.stringify({ response: "We had problems processing the message.", type: 0, message: "You can try sending the message again. If the issue persists, please contact support." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    if (nData.admin === false) {
        return new Response(JSON.stringify({ response: "You are not an administrator.", type: 0, message: "Abuse of administrator functions can lead to a permanent ban." }), {
            status: 500,
            headers: { ...headers }
        });
    }

    try {
        let upmessage: string = `%$t%${title}%$,%%$f%CompNUS%$,%%$m%<p>${message}</p>%$$%`;

        if (to && to.length > 1) {
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
                    .insert([{ created_by: uid, type: "adminMessage", attributes: "to->" + to, message: "title->" + title + "\ncontent->" + message }]);
                if (logError) {
                    return new Response(JSON.stringify({ response: `Internal server error.` }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
            }
        } else {
            const { data: senuser, error: userExistsError } = await supabase
                .from("users")
                .select("username, messages")

            if (userExistsError || !senuser) {
                return new Response(JSON.stringify({ response: `Problems happened. Idk what problems just... problems.` }), {
                    status: 404,
                    headers: {
                        ...headers
                    }
                });
            } else {
               
                for (const user of senuser) {
                    const { error: cannotSend } = await supabase
                        .from("users")
                        .update({ messages: upmessage + user.messages })
                        .eq("username", user.username);

                    if (cannotSend) {
                        packedResponse += "Could not send message to " + user.username + " due to error: " + cannotSend + "\n";
                    }
                }
               
                const { error: logError } = await supabase
                    .from("logs")
                    .insert([{ created_by: uid, type: "adminMessage", attributes: "to->@", message: "title->" + title + "\ncontent->" + message }]);
                if (logError) {
                    return new Response(JSON.stringify({ response: `Internal server error.` }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
            }
        }

        

        return new Response(JSON.stringify({ response: "Message sent successfully!\n"+packedResponse, type:1 }), {
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
