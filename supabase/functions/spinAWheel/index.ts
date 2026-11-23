import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.48";
import { corsHeaders } from "../_shared/cors.ts";
import LEVELS from "../_shared/levels.json" with { type: "json" };
import UPGRADES from "../_shared/upgrades.json" with { type: "json" };
import SPINR from "../_shared/spinawin.json" with { type: "json" };
import { rndm,mining } from "../_shared/fns.ts";

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

    return new Response("{0:'raaaah'}", {status:500, headers: { ...headers }});

    let uid: string = user.user.id;
    var maxXP: number;

    const { data: mdata, error: merror } = await sb.from('udata').select('balance_nus, balance_noca, balance_sats, dividends, level, exp, spin_tokens, hashrate, coins').eq('user_id', uid).single();
    const { data: udata, error: uerror } = await sb.from('users').select('username').eq('id', uid).single();
    if (merror || uerror || !mdata || !udata) {
        return new Response(JSON.stringify({ response: 'Error fetching user data' }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }

    maxXP = 0;
    if (mdata.level < 10) maxXP = Number(LEVELS.perks[mdata.level + 1][0]) - mdata.exp;

    try {
        if (mdata.spin_tokens < 1) return new Response(JSON.stringify({ response: "You have no spin tokens!" }), {
            status: 403,
            headers: {
                ...headers
            }
        });

        const reward: [string, [number, Record<string, string | number>][], number] = (SPINR.win as unknown as [string, [number, Record<string, string | number>][], number][])[rndm(0, 11, 1)];     
        var complement = rndm(0, 100, 0.01);
        var rewardindex = 0;
        for (var i of reward[1]) {
            if (complement <= i[0]) break;
            complement -= i[0];
            rewardindex++;
        }
        var rewards: Record<string, number> = {};
        for (const [key, value] of Object.entries(reward[1][rewardindex][1])) {
            if (typeof value === "string") {
                var r: number[] = value.split("-").map(Number);
                rewards[key] = rndm(r[0], r[1], r[2]);
            } else rewards[key] = value;
        }

// need to handle xp, need to handle mining, also remove the return from line 47

        var updateds = {
            exp: mdata.exp,
            balance_nus: mdata.balance_nus,
            balance_noca: mdata.balance_noca,
            balance_sats: mdata.balance_sats,
            coins: mdata.coins,
            dividends: mdata.dividends,
            spin_tokens: mdata.spin_tokens,
            hashrate: mdata.hashrate
        }
        var resources: Record<string, number> = {balance_nus: 0, balance_noca: 0, balance_sats: 0, coins: 0};
        const { error: updateError } = await sb.from('udata').update(updateds).eq('user_id', uid);
        if (updateError) {
            return new Response(JSON.stringify({ response: 'We had issues trying to update your data.' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }
        for (const [key, value] of Object.entries(reward)) {
            if (value === 0) delete resources[key];
        }

        if (Object.keys(resources).length) {
            const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: resources, message: "Spin Reward", expiration: 1 });
        }
        const { error: insertError2 } = await sb.from('transaction').insert({ from: udata.username, to: "CompNUS", resource: {"noca":10}, message: "Level Up Fee", expiration: 1 });
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
