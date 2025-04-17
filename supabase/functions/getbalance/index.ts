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

    try {
        const body = await req.json();
        uid = body.uid || null;
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
        const { data: balancenus, error: userExistsErrorn } = await supabase
            .from("udata")
            .select("balance_nus")
            .eq("user_id", uid)
            .single();

        const { data: balancenoca, error: userExistsError } = await supabase
            .from("udata")
            .select("balance_noca")
            .eq("user_id", uid)
            .single();

        if (userExistsError || !balancenus || userExistsErrorn || !balancenoca) {
            return new Response(JSON.stringify({ response: `User ${uid} does not exist in the 'udata' table.` }), {
                status: 400,
                headers: {
                    ...headers
                }
            });
        }

        return new Response(JSON.stringify({ response: "User data processed successfully.", balance: [balancenus.balance_nus, balancenoca.balance_noca] }), {
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
