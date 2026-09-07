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
        bid = body.bid || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    const { data: mdata, error: merror } = await sb.from('udata').select('daily_last, daily_streak').eq('user_id', uid).single();
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
        //nothing done yet
            var maxXP = 0;
            if (cdata.level < 10) maxXP = LEVELS.perks[cdata.level + 1][0] - cdata.exp;
            if (rewards.hash > 0) { //collect mining
                const { data: nData, error: nerrr } = await sb.from('udata').select('last_claimed, mining_upg').eq('user_id', uid).single();
                if (!nData || nerrr) {
                    return new Response(JSON.stringify({ response: 'Error fetching user data', code: 10 }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
                var now = new Date().getTime();
                var lastclaim = new Date(nData.last_claimed).getTime();
                var diff: number = (now - lastclaim) / 1000;
                var maxtime: number = (UPGRADES.memory[Math.floor((nData.mining_upg % 100) / 10)][3] + LEVELS.perks[cdata.level][2]) * 60 * 60;
                var xpgain: number = Math.min(maxXP, Math.floor((Math.min(diff / 600, (UPGRADES.memory[Math.floor((nData.mining_upg % 100) / 10)][3] + LEVELS.perks[cdata.level][2]) * 6)) * ((LEVELS.perks[cdata.level][1] + UPGRADES.echip[Math.floor((nData.mining_upg % 1000000) / 100000)][3]) / 100)));
                const { data: dt, error: dte } = await sb.from("variable").select("value").eq("key", "nusperblock").single();
                const { data: dr, error: dre } = await sb.from("variable").select("value").eq("key", "hashperblock").single();
                if (dte || dre || !dt || !dr) {
                    return new Response(JSON.stringify({ response: 'We had issues trying to collect mining rewards. Please try again later.', code: 10 }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
                maxXP -= xpgain;
                var profit: number = parseFloat(((cdata.hashrate * Math.min(diff, maxtime) * dt.value) / dr.value).toFixed(8));
                var post = { balance_nus: cdata.balance_nus + profit, last_claimed: new Date().toISOString(), exp: cdata.exp + xpgain };
                const { error: updateError } = await sb.from('udata').update(post).eq('user_id', uid);
                if (updateError) {
                    return new Response(JSON.stringify({ response: 'We had issues updating your mining data. Please try again later.', code: 10 }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
                cdata.balance_nus = cdata.balance_nus + profit;
                cdata.exp = cdata.exp + xpgain;
                await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: { "nus": profit }, message: "Mining reward", expiration: 1 });
            }
            if (rc.xp > 0) {
                rewards.xp += Math.min(maxXP, rc.xp);
                maxXP -= Math.min(maxXP, rc.xp);
            }
            if (date in REWARDS_S) {
                var rs = REWARDS_S[date];
                if (rs.xp > 0) {
                    rewards.xp += Math.min(maxXP, rs.xp);
                    maxXP -= Math.min(maxXP, rs.xp);
                }
            }
            if (REWARDS_E.length) {
                var re = REWARDS_E[mdata.daily_streak % REWARDS_E.length];
                if (re.xp > 0) {
                    rewards.xp += Math.min(maxXP, re.xp);
                    maxXP -= Math.min(maxXP, re.xp);
                }
            }
            var rxp = XP_LOOP[(mdata.daily_streak - 1) % XP_LOOP.length];
            rewards.xp += Math.min(maxXP, rxp);
            maxXP -= Math.min(maxXP, rxp);
            const { error: updateError } = await sb.from('udata').update({
                daily_last: mdata.daily_last, daily_streak: mdata.daily_streak, balance_nus: cdata.balance_nus + rewards.nus, balance_noca: cdata.balance_noca + rewards.noca,
                balance_sats: cdata.balance_sats + rewards.sat, hashrate: cdata.hashrate + rewards.hash, dividends: cdata.dividends + rewards.div, exp: cdata.exp + rewards.xp
                // , event*: edata.event* + eventr.*
            }).eq('user_id', uid);
            if (updateError) {
                return new Response(JSON.stringify({ response: 'We had issues trying to collect your daily reward. Please try again later.', code: 10 }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
            for (let i of rewards.cont) {
                var expiry = null;
                if (i.exp) {
                    const date = new Date();
                    date.setDate(date.getDate() + i.exp);
                    expiry = date.toISOString().split('T')[0];
                }
                const { error: insertError } = await sb.from('contract').insert({ owner: uid, hashrate: i.hash, duration: i.dur, name: i.name, expiration: expiry });
            }
            var resources = {};
            if (rewards.nus) resources['nus'] = rewards.nus;
            if (rewards.noca) resources['noca'] = rewards.noca;
            if (rewards.sat) resources['sat'] = rewards.sat;
            var ierr = false;
            rewards.con = rewards.cont.length;
            delete rewards.cont;
            // if (Object.keys(eventr).length) rewards['event'] = eventr;
            if (Object.keys(resources).length) { const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: resources, message: "Daily reward", expiration: 1 }); if (insertError) ierr = true; }
            return new Response(JSON.stringify({ response: mdata.daily_streak, code: ierr?2:5, claimed: JSON.stringify(rewards), level: maxXP===0&&cdata.level!==10 }), {
                status: 200,
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
