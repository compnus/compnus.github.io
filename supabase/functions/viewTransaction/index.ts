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

    let action: number | null = null;
    let data: string | null = null;
    try {
        const body = await req.json();
        action = body.action || null;
        data = body.data || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    if (action === null || (action !== 0 && action !== 1 && action !== 2)) return new Response(JSON.stringify({ response: "Invalid request. because action"+action }), {
        status: 400,
        headers: {
            ...headers
        }
    });

    if (action === 0) {
        if (data === null || !data.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) return new Response(JSON.stringify({ response: "Invalid request. because format"+data }), {
            status: 400,
            headers: {
                ...headers
            }
        });

        const { data: trs, error } = await sb.from('transaction').select('*').eq('id', data).single();
        if (!trs || error) return new Response(JSON.stringify({ response: "Transaction not found." }), {
            status: 404,
            headers: {
                ...headers
            }
        });

        if (trs.from.indexOf('admin:') !== -1) trs.from = "CompNUS";
        return new Response(JSON.stringify({ response: '0', data: trs }), {
            status: 200,
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

    const { data: un, error: unerror } = await sb.from('users').select('username').eq('id', user.user.id).single();
    if (unerror || !un) return new Response(JSON.stringify({ response: `Operation failed.<br>Make sure you are logged in before trying again.` }), {
        status: 404,
        headers: {
            ...headers
        }
    });

    try {

        const { data: trs, error } = await sb.from('transaction').select('*').eq(action === 2 ? 'from' : 'to', un.username);
        if (error) return new Response(JSON.stringify({ response: `Operation failed.<br>If the issue persists, please contact support.` }), {
            status: 400,
            headers: {
                ...headers
            }
        });

        if (!trs || trs.length === 0) return new Response(JSON.stringify({ response: `No transactions found.` }), {
            status: 200,
            headers: {
                ...headers
            }
        });

        return new Response(JSON.stringify({ response: '0', data: trs }), {
            status: 200,
            headers: {
                ...headers
            }
        });

    } catch (error) {
        console.error("Error processing request", error);
        return new Response(JSON.stringify({ response: "Internal Server Error."+error }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }
});
