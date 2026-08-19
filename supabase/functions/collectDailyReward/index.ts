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
    let difference: number = -1;
    const timenow: any = new Date();
    if (mdata.daily_last !== null) {
        const parts = mdata.daily_last.split('-').map(Number);
        if (parts.length === 3) {
            const [y, m, d] = parts;
            const serverUtc = Date.UTC(y, m - 1, d);
            const localMidnightUtc = Date.UTC(timenow.getFullYear(), timenow.getMonth(), timenow.getDate());
            difference = Math.floor((localMidnightUtc - serverUtc) / 86400000);
        }
    }

    try {
        mdata.daily_last = timenow.toISOString().split('T')[0];
        if (difference <= -1 || difference > 2) {
            mdata.daily_streak = 0;
            difference = 1;
        }
        if (difference === 0) {
            return new Response(JSON.stringify({ response: 'You may only collect your daily bonus once a day!', code: 1 }), {
                status: 200,
                headers: {
                    ...headers
                }
            });
        }
        if (difference === 1 || difference === 2) {
            const REWARDS_C = [
                { hash: 5 }, { noca: 5 }, { nus: 0.0001 }, { hash: 3 }, { noca: 5 }, { nus: 0.0001 }, { hash: 5, nus: 0.0003 }, //1-7
            ];
            const REWARDS_S = {

            };
            mdata.daily_streak++;
            const date = mdata.daily_last.substring(5);
            const { data: cdata, error: cerror } = await sb.from('udata').select('balance_nus, balance_noca, balance_sats, hashrate, dividends').eq('user_id', uid).single();
            if (cerror || !cdata) {
                return new Response(JSON.stringify({ response: 'Error fetching user data' }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
            var rewards = {
                nus: 0,
                noca: 0,
                sat: 0,
                hash: 0,
                div: 0
            }
            var rc = REWARDS_C[(mdata.daily_streak-1) % 70];
            rewards.nus += rc.nus || 0;
            rewards.noca += rc.noca || 0;
            rewards.sat += rc.sat || 0;
            rewards.hash += rc.hash || 0;
            rewards.div += rc.div || 0;
            if (date in REWARDS_S) {
                var rs = REWARDS_S[date];
                rewards.nus += rs.nus || 0;
                rewards.noca += rs.noca || 0;
                rewards.sat += rs.sat || 0;
                rewards.hash += rs.hash || 0;
                rewards.div += rs.div || 0;
            }
            if (rewards.hash > 0) { //collect mining
                const { data: nData, error: nerrr } = await sb.from('udata').select('last_claimed, mining_upg, balance_nus').eq('user_id', uid).single();
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
                var maxtime: number;
                switch (Math.floor((nData.mining_upg % 100) / 10)) {
                    case 0: maxtime = 48 * 60 * 60; break;
                    case 1: maxtime = 60 * 60 * 60; break;
                    case 2: maxtime = 72 * 60 * 60; break;
                    case 3: maxtime = 84 * 60 * 60; break;
                    case 4: maxtime = 96 * 60 * 60; break;
                    case 5: maxtime = 108 * 60 * 60; break;
                    case 6: maxtime = 120 * 60 * 60; break;
                    case 7: maxtime = 132 * 60 * 60; break;
                    case 8: maxtime = 144 * 60 * 60; break;
                    case 9: maxtime = 168 * 60 * 60; break;
                }
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
                var profit: number = parseFloat(((nData.hashrate * Math.min(diff, maxtime) * dt.value) / dr.value).toFixed(8));
                var post = { balance_nus: nData.balance_nus + profit, last_claimed: new Date().toISOString() };
                const { error: updateError } = await sb.from('udata').update(post).eq('user_id', uid);
                if (updateError) {
                    return new Response(JSON.stringify({ response: 'We had issues updating your mining data. Please try again later.', code: 10 }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
                nData.balance_nus = nData.balance_nus + profit;
                await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: { "nus": profit }, message: "Mining reward" });
            }
            const { error: updateError } = await sb.from('udata').update({
                daily_last: mdata.daily_last, daily_streak: mdata.daily_streak, balance_nus: cdata.balance_nus + rewards.nus, balance_noca: cdata.balance_noca + rewards.noca,
                balance_sats: cdata.balance_sats + rewards.sat, hashrate: cdata.hashrate + rewards.hash, dividends: cdata.dividends + rewards.div
            }).eq('user_id', uid);
            if (updateError) {
                return new Response(JSON.stringify({ response: 'We had issues trying to collect your daily reward. Please try again later.', code: 10 }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
            var resources = {};
            if (rewards.nus) resources['nus'] = rewards.nus;
            if (rewards.noca) resources['noca'] = rewards.noca;
            if (rewards.sat) resources['sat'] = rewards.sat;
            var ierr = false;
            if (Object.keys(resources).length) { const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: resources, message: "Daily reward" }); if (insertError) ierr = true; }
            return new Response(JSON.stringify({ response: mdata.daily_streak, code: ierr?2:5, claimed: JSON.stringify(rewards) }), {
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
