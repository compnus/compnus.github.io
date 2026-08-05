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

    const { data: mdata, error: merror } = await sb.from('udata').select('hashrate, last_claimed, mining_upg').eq('user_id', uid).single();
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
            var now = new Date().getTime();
            var lastclaim = new Date(mdata.last_claimed).getTime();
            var diff: number = (now - lastclaim) / 1000;
            var mintime: number;
            var maxtime: number;
            switch    (mdata.mining_upg    %    10)   {
                case 0: mintime = 24 * 60 * 60;  break;
                case 1: mintime = 22 * 60 * 60;  break;
                case 2: mintime = 20 * 60 * 60;  break;
                case 3: mintime = 18 * 60 * 60;  break;
                case 4: mintime = 16 * 60 * 60;  break;
                case 5: mintime = 14 * 60 * 60;  break;
                case 6: mintime = 12 * 60 * 60;  break;
                case 7: mintime = 10 * 60 * 60;  break;
                case 8: mintime = 8 * 60 * 60;   break;
                case 9: mintime = 6 * 60 * 60;   break;
            }
            switch (Math.floor((mdata.mining_upg % 100)
                                               / 10)) {
                case 0: maxtime = 48 * 60 * 60;  break;
                case 1: maxtime = 60 * 60 * 60;  break;
                case 2: maxtime = 72 * 60 * 60;  break;
                case 3: maxtime = 84 * 60 * 60;  break;
                case 4: maxtime = 96 * 60 * 60;  break;
                case 5: maxtime = 108 * 60 * 60; break;
                case 6: maxtime = 120 * 60 * 60; break;
                case 7: maxtime = 132 * 60 * 60; break;
                case 8: maxtime = 144 * 60 * 60; break;
                case 9: maxtime = 168 * 60 * 60; break;
            }
            if (diff < mintime) {
                return new Response(JSON.stringify({ response: "You cannot start mining yet! Please wait until the cooldown period has passed. (Check the timer!)", code: 1 }), {
                    status: 200,
                    headers: {
                        ...headers
                    }
                });
            } else {
                const { data: dt, error: dte } = await sb.from("variable").select("value").eq("key", "nusperblock").single();
                const { data: dr, error: dre } = await sb.from("variable").select("value").eq("key", "hashperblock").single();
                const { data: cdata, error: cerror } = await sb.from('udata').select('balance_nus').eq('user_id', uid).single();
                if (dte || dre || cerror || !dt || !dr || !cdata) {
                    return new Response(JSON.stringify({ response: 'We had issues trying to collect mining rewards. Please try again later.', code: 10 }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
                var profit: number = parseFloat(((mdata.hashrate * Math.min(diff, maxtime) * dt.value) / dr.value).toFixed(8));
                var post = { balance_nus: cdata.balance_nus + profit, last_claimed: new Date().toISOString() };
                const { error: updateError } = await sb.from('udata').update(post).eq('user_id', uid);
                if (updateError) {
                    return new Response(JSON.stringify({ response: 'We had issues updating your mining data. Please try again later.', code: 10 }), {
                        status: 500,
                        headers: {
                            ...headers
                        }
                    });
                }
                const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: { "nus": profit }, message: "Mining reward" });
                if (insertError) {
                    return new Response(JSON.stringify({ response: JSON.stringify({"newtime": post.last_claimed, "reward": profit}), code: 2 }), {
                        status: 200,
                        headers: {
                            ...headers
                        }
                    });
                }
                return new Response(JSON.stringify({ response: JSON.stringify({ "newtime": post.last_claimed, "reward": profit }), code: 5 }), {
                    status: 200,
                    headers: {
                        ...headers
                    }
                });
            }
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
