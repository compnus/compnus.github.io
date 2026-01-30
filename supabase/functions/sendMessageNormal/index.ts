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

    let uid: string = user.user.id;
    let muid: string | null = null;
    let from: string | null = null;
    let to: string | null = null;
    let title: string | null = null;
    let message: string | null = null;

    try {
        const body = await req.json();
        muid = body.uid || null;
        to = body.to || null;
        title = body.title || null;
        message = body.message.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split("\n").join("<br>") || null;
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
    if (muid !== null && uid !== muid) {
        const { error } = await sb
            .from("logs")
            .insert([{ created_by: "SYSTEM", type: "WARNING", attributes: "?user_impersonation_message", message: "user " + uid + " tried to impersonate " + muid }]);
        return new Response(JSON.stringify({ response: "You have been reported for attempting to impersonate another user." }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    const { data: nData, error: nError } = await sb.from("udata").select("can_message").eq("user_id", uid).single();
    if (!nData || nError) {
        return new Response(JSON.stringify({ response: "We had problems processing the message.", type: 0, message: "You can try sending the message again. If the issue persists, please contact support." }), {
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

    if (message.length > 200) {
        return new Response(JSON.stringify({ response: "The message is too long!", type: 0, message: "Please make sure that the amount of characters in your message doesn't exceed 200 characters." }), {
            status: 501,
            headers: {...headers}
        });
    }

    if (title.length > 100) {
        return new Response(JSON.stringify({ response: "The title is too long!", type: 0, message: "Please make sure that the amount of characters in your title doesn't exceed 100 characters." }), {
            status: 501,
            headers: { ...headers }
        });
    }

    title = title.split("<").join("").split(">").join("").split("&").join("&amp;");

    try {
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
        } else {
            from = recuser.username;
        }

        const { data: bData, error: bError } = await sb.from("users").select("blocked_users").eq("username", to).single();
        if (!bData || bError) {
            return new Response(JSON.stringify({ response: "We had problems processing the message.", type: 0, message: "You can try sending the message again. If the issue persists, please contact support." }), {
                status: 501,
                headers: { ...headers }
            });
        }
        if (bData.blocked_users.indexOf(from) > -1) {
            return new Response(JSON.stringify({ response: "You are blocked!", type: 0, message: "This user has blocked you. Your message will not be delivered." }), {
                status: 501,
                headers: { ...headers }
            });
        }

        let upmessage: string = `%$t%${title}%$,%%$f%${from}%$,%%$m%<p>${message}</p>%$$%`;

        const { data: senuser, error: userExistsError } = await sb
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
            const { error: cannotSend } = await sb
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
            const { error: logError } = await sb
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
