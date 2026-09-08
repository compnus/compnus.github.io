import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.48";
import { corsHeaders } from "../_shared/cors.ts";
import BONUS from "../_shared/smallBonus.json" with { type: "json" };


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
    let bid: string | null = null;

    try {
        const body = await req.json();
        bid = typeof body?.bid === 'string' ? body.bid : null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    if (!bid || !BONUS.bonus[bid]) {
        return new Response(JSON.stringify({ response: "This reward does not exist. Keep in mind that brute-forcing bonus rewards will lead to removal of your ability to earn dividends." }), {
            status: 404,
            headers: {
                ...headers
            }
        });
    }

    const { data: mdata, error: merror } = await sb.from('udata').select('balance_nus, balance_noca, balance_sats, claimed_rewards').eq('user_id', uid).single();
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
        if (mdata.claimed_rewards.indexOf(bid + ' ') !== -1) return new Response(JSON.stringify({ response: mdata.claimed_rewards, sc: true, claimed: false }), {
            status: 200,
            headers: {
                ...headers
            }
        });

        var reward = { nus: 0, noca: 0, sat: 0 };
        reward[BONUS["currency.nfo"][BONUS.bonus[bid][1][1]][1]] = BONUS.bonus[bid][1][0];
        const { error: updateError } = await sb.from('udata').update({
            balance_nus: mdata.balance_nus + reward.nus, balance_noca: mdata.balance_noca + reward.noca, balance_sats: mdata.balance_sats + reward.sat, claimed_rewards: mdata.claimed_rewards + bid + ' '
        }).eq('user_id', uid);
        if (updateError) {
            return new Response(JSON.stringify({ response: 'We had issues trying to update your balance. Please try again later.' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }
        var resources = {};
        if (reward.nus) resources['nus'] = reward.nus;
        if (reward.noca) resources['noca'] = reward.noca;
        if (reward.sat) resources['sat'] = reward.sat;
        if (Object.keys(resources).length) await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: resources, message: "Bonus Reward", expiration: 1 });
        return new Response(JSON.stringify({ response: '', sc: true, claimed: true }), {
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
