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
    let referral: string = "";

    try {
        const body = await req.json();
        uid = body.uid || null;
        referral = body.referral;
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
        const { data: userExists, error: userExistsError } = await supabase
            .from("users")
            .select("id, username")
            .eq("id", uid)
            .single();

        if (userExistsError || !userExists) {
            return new Response(JSON.stringify({ response: `User ${uid} does not exist in the 'users' table.` }), {
                status: 400,
                headers: {
                    ...headers
                }
            });
        }

        const { data: udataExists, error: udataExistsError } = await supabase
            .from("udata")
            .select("user_id")
            .eq("user_id", uid)
            .single();

        if (udataExists) {
            return new Response(JSON.stringify({ response: "Entry duplication error." }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }

        const { error: insertError } = await supabase
            .from("udata")
            .insert([{ user_id: uid }]);

        if (insertError) {
            return new Response(JSON.stringify({ response: "Error inserting into 'udata' table." }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }

        if (referral) {
            if ((referral === userExists.username) ||
                (referral === "mia") ||
                (referral === "staney") ||
                (referral === "compnus") ||
                (referral === "kingpvz")) 
                return new Response(JSON.stringify({ response: "User data processed successfully, wrong referral.", wrongref: true }), {
                    status: 200,
                    headers: {
                        ...headers
                    }
                });

            const { data: realUser, error: noUser } = await supabase.from("users").select("id").eq("username", referral).single();
            if (noUser || !realUser) return new Response(JSON.stringify({ response: "User data processed successfully, wrong referral.", wrongref: true }), {
                status: 200,
                headers: {
                    ...headers
                }
            });
            
            const { error: invitee } = await supabase.from("udata").update({ "referred": referral, "balance_nus": 0.01 }).eq("user_id", uid);
            const { data: referrer, error: referrerError } = await supabase.from("udata").select("balance_nus, invitees").eq("user_id", realUser.id).single();
            if (referrerError || !referrer) {
                return new Response(JSON.stringify({ response: "User data processed successfully, referral error.", wrongref: true }), {
                    status: 200,
                    headers: {
                        ...headers
                    }
                });
            }
            const { error: inviter } = await supabase.from("udata").update({ "balance_nus": (referrer.balance_nus + 0.001), "invitees": referrer.invitees + "(" + userExists.username + ")" }).eq("user_id", realUser.id);
            let upmessage: string = `%$t%You have successfully referred ${userExists.username}!%$,%%$f%CompNUS%$,%%$m%<p>You have received 0.001 $NUS. As long as the user is active, your dividend power is increased by 10.</p>%$$%`;
            const { error: cannotSend } = await supabase
                .from("users")
                .update({ messages: upmessage + realUser.messages })
                .eq("username", referral);
            if (invitee || inviter || cannotSend) {
                return new Response(JSON.stringify({ response: "User data processed successfully, referral error.", wrongref: true }), {
                    status: 200,
                    headers: {
                        ...headers
                    }
                });
            }
        }

        return new Response(JSON.stringify({ response: "User data processed successfully." }), {
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
