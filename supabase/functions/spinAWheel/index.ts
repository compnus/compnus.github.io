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

        const reward: [string, [number, Record<string, string | number | Record<string, string | number>>][], number] = (SPINR.win as unknown as [string, [number, Record<string, string | number>][], number][])[rndm(0, 11, 1)];     
        var complement = rndm(0, 100, 0.01);
        var rewardindex = 0;
        for (var i of reward[1]) {
            if (complement <= i[0]) break;
            complement -= i[0];
            rewardindex++;
        }
        var rewards: Record<string, number> = {};
        var contracts: Record<string, string | number>[] = [];
        for (const [key, value] of Object.entries(reward[1][rewardindex][1])) {
            if (typeof value === "object" && value !== null) {
                contracts.push(value);
            } else if (typeof value === "string") {
                var r: number[] = value.split("-").map(Number);
                rewards[key] = rndm(r[0], r[1], r[2]);
            } else rewards[key] = value;
        }

        rewards.xp = Math.min(maxXP, rewards.xp ?? 0);
        maxXP -= Math.min(maxXP, rewards.xp);

        if (rewards.hash > 0) { //claim mining
            const { data: nData, error: nerrr } = await sb.from('udata').select('last_claimed, mining_upg').eq('user_id', uid).single();
            if (!nData || nerrr) {
                return new Response(JSON.stringify({ response: 'Error fetching user data' }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
            const miningStatus: [number, any, number] = await mining(sb, uid, LEVELS, UPGRADES, { ...nData, ...udata, ...mdata }, true, maxXP);
            if (typeof miningStatus[1] === "string") return new Response(JSON.stringify({ response: miningStatus[1], code: miningStatus[0] }), {
                status: miningStatus[2],
                headers: {
                    ...headers
                }
            });
            mdata.balance_nus += miningStatus[1].reward;
            mdata.exp += miningStatus[1].xp;
            maxXP -= miningStatus[1].xp;
        }
        var updateds = {
            exp: mdata.exp + rewards.xp,
            balance_nus: mdata.balance_nus + (rewards.nus ?? 0),
            balance_noca: mdata.balance_noca + (rewards.noca ?? 0),
            balance_sats: mdata.balance_sats + (rewards.sat ?? 0),
            coins: mdata.coins + (rewards.coin ?? 0),
            dividends: mdata.dividends + (rewards.div ?? 0),
            spin_tokens: mdata.spin_tokens + (rewards.spin ?? 0) - 1,
            hashrate: mdata.hashrate + (rewards.hash ?? 0)
        }
        if (contracts.length > 0) {
            rewards["cont"] = contracts.length;
            let topush = [];
            for (const contract of contracts) {
                topush.push({
                    owner: uid,
                    hashrate: contract.hash,
                    duration: contract.dur,
                    name: contract.name
                });
            }
            const { error: cone } = await sb.from("contract").insert(topush);
            if (cone) return new Response(JSON.stringify({ response: 'Contract insertion error.' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }

        const { error: updateError } = await sb.from('udata').update(updateds).eq('user_id', uid);
        if (updateError) {
            return new Response(JSON.stringify({ response: 'We had issues trying to update your data.' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
        }
        var resources: Record<string, number> = {nus: rewards.nus ?? 0, noca: rewards.noca ?? 0, sat: rewards.sat ?? 0, coin: rewards.coin ?? 0};
        for (const [key, value] of Object.entries(resources)) {
            if (value === 0) delete resources[key];
        }

        if (Object.keys(resources).length) {
            const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: resources, message: "Spin Reward", expiration: 1 });
        }
        return new Response(JSON.stringify({ response: "", rewards: rewards, rot: -reward[2]*30 + rndm(-13,13,1) + 360, level: maxXP <= 0 }), {
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
