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
    let type: string | null = null;
    let name: string | null = null;
    let link: string | null = null;
    let links: string | null = null;
    let dsc: string | null = null;
    let from: string | null = null;

    try {
        const body = await req.json();
        name = body.name || null;
        link = body.link || null;
        links = body.links || null;
        dsc = body.dsc || null;
        type = body.type || null;
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
        return new Response(JSON.stringify({ response: "UID is required." }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

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

        const { error: logError } = await sb
            .from("logs")
            .insert([{ created_by: from, type: "submission_add", attributes: "name->" + name + "; link->" + link + "; type->"+type, message: (type == "scam" ? dsc : links) }]);
        if (logError) {
            return new Response(JSON.stringify({ response: `Internal server error.` }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }

        return new Response(JSON.stringify({ response: (type=="scam"?"Scam reported successfully!<br>Thank you!":"App submitted successfully!<br>Thank you!"), sc: true }), {
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
