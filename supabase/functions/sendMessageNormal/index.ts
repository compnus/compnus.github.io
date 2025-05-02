import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
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

        let upmessage: string = `
    %$t%${title}%$,$
    %$f%${from}%$,%
    %$m%${message.split("\n").join("<br>")}
    %$$%
        `;

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
                .update("messages", upmessage + senuser.messages)
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

        return new Response(JSON.stringify({ response: "Message sent successfully!" }), {
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
