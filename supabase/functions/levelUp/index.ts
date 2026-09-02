import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.48";
import { corsHeaders } from "../_shared/cors.ts";
import LEVELS from "../_shared/levels.json" with { type: "json" };

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

    const { data: mdata, error: merror } = await sb.from('udata').select('balance_nus, balance_noca, balance_sats, dividends, level, exp').eq('user_id', uid).single();
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
        if (mdata.balance_noca < 10) return new Response(JSON.stringify({ response: "You need 10 Nocas to level up!" }), {
            status: 403,
            headers: {
                ...headers
            }
        });
        var newLevel: number = mdata.level === 10 ? -1 : mdata.level + 1;
        if (newLevel < 0) return new Response(JSON.stringify({ response: "You are already at max level!" }), {
            status: 403,
            headers: {
                ...headers
            }
        });
        if (mdata.exp < LEVELS.perks[newLevel][0]) return new Response(JSON.stringify({ response: "Not enough XP!" }), {
            status: 403,
            headers: {
                ...headers
            }
        });

        var updateds = {
            level: newLevel,
            exp: 0,
            balance_nus: mdata.balance_nus,
            balance_noca: mdata.balance_noca-10,
            balance_sats: mdata.balance_sats,
            dividends: mdata.dividends
        }
        if (Object.keys(LEVELS.perks[newLevel][4]).indexOf('nus') !== -1) updateds.balance_nus += LEVELS.perks[newLevel][4].nus;
        if (Object.keys(LEVELS.perks[newLevel][4]).indexOf('noca') !== -1) updateds.balance_noca += LEVELS.perks[newLevel][4].noca;
        if (Object.keys(LEVELS.perks[newLevel][4]).indexOf('sat') !== -1) updateds.balance_sats += LEVELS.perks[newLevel][4].sat;
        if (Object.keys(LEVELS.perks[newLevel][4]).indexOf('div') !== -1) updateds.dividends += LEVELS.perks[newLevel][4].div;
        const { error: updateError } = await sb.from('udata').update(updateds).eq('user_id', uid);
        if (updateError) {
            return new Response(JSON.stringify({ response: 'We had issues trying to update your data.' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }

        var resources = LEVELS.perks[newLevel][4];
        delete resources.div;
        if (Object.keys(resources).length) {
            const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: resources, message: "Level Up Reward" });
        }
        return new Response(JSON.stringify({ response: "" }), {
            status: 200,
            headers: {
                ...headers
            }
        });
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
