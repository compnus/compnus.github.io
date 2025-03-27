import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts';

Deno.serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
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
        return new Response('Authorization header missing', {
            status: 401,
            headers: {
                ...headers
            } });
    }

    const token = authHeader.split(' ')[1];
    const { data: user, error } = await supabase.auth.api.getUser(token);
    if (error || !user) {
        return new Response('Invalid JWT', {
            status: 401,
            headers: {
                ...headers
            } });
    }

    let uid: string | null = null;

    try {
        const body = await req.json();
        uid = body.uid || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response("Failed to parse request body", {
            status: 400,
            headers: {
                ...headers
            } });
    }

    if (!uid) {
        return new Response("UID is required", {
            status: 400,
            headers: {
                ...headers
            } });
    }

    try {
        const { data: userExists, error: userExistsError } = await supabase
            .from("users")
            .select("id")
            .eq("id", uid)
            .single();

        if (userExistsError || !userExists) {
            return new Response("User does not exist in the 'users' table.", {
                status: 400,
                headers: {
                    ...headers
                } });
        }

        const { data: udataExists, error: udataExistsError } = await supabase
            .from("udata")
            .select("user_id")
            .eq("user_id", uid)
            .single();

        if (udataExistsError) {
            return new Response("Error checking 'udata' table.", {
                status: 500,
                headers: {
                    ...headers
                } });
        }

        if (!udataExists) {
            const { error: insertError } = await supabase
                .from("udata")
                .insert([{ user_id: uid }]);

            if (insertError) {
                return new Response("Error inserting into 'udata' table.", {
                    status: 500,
                    headers: {
                        ...headers
                    } });
            }
        }

        return new Response("User data processed successfully.", {
            status: 200,
            headers: {
                ...headers
            }
        });
    } catch (error) {
        console.error("Error processing request", error);
        return new Response("Internal Server Error.", {
            status: 500,
            headers: {
                ...headers
            } });
    }
});
