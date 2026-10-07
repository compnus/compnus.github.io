import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.48";
import { corsHeaders } from "../_shared/cors.ts";
import LEVELS from "../_shared/levels.json" with { type: "json" };
import UPGRADES from "../_shared/upgrades.json" with { type: "json" };
import { mining } from "../_shared/fns.ts";

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

    const { data: mdata, error: merror } = await sb.from('udata').select('hashrate, last_claimed, mining_upg, level, exp').eq('user_id', uid).single();
    const { data: udata, error: uerror } = await sb.from('users').select('username').eq('id', uid).single();
    if (merror || uerror || !mdata || !udata) {
        return new Response(JSON.stringify({ response: 'Error fetching user data' }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }

    try {
        if (mdata.last_claimed === null) {
            mdata.last_claimed = new Date().toISOString();
            const { error: updateError } = await sb.from('udata').update({ last_claimed: mdata.last_claimed }).eq('user_id', uid);
            if (updateError) {
                return new Response(JSON.stringify({ response: 'We had issues trying to start mining. Please try again later.', code: 10 }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            } else {
                return new Response(JSON.stringify({ response: mdata.last_claimed, code: 0 }), {
                    status: 200,
                    headers: {
                        ...headers
                    }
                });
            }
        } else {
            // remember that you must add npu logic to upgradeMining and collectDailyReward
            const miningStatus: [number, any, number] = await mining(sb, uid, LEVELS, UPGRADES, { ...udata, ...mdata });
            if (typeof miningStatus[1] === "string") return new Response(JSON.stringify({ response: miningStatus[1], code: miningStatus[0] }), {
                status: miningStatus[2],
                headers: {
                    ...headers
                }
            });
            else return new Response(JSON.stringify({ newtime: miningStatus[1].newtime, reward: miningStatus[1].reward, level: miningStatus[1].level, xp: miningStatus[1].xp, code: miningStatus[0] }), {
                status: miningStatus[2],
                headers: {
                    ...headers
                }
            });   
        }
    } catch (error) {
        console.error("Error processing request", error);
        return new Response(JSON.stringify({ response: "Internal Server Error."+error.message }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }
});
