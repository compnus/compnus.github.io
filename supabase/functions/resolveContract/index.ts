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
    let cid: number | null = null;

    try {
        const body = await req.json();
        cid = body.cid || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }

    const { data: mdata, error: merror } = await sb.from('udata').select('level').eq('user_id', uid).single();
    const { data: udata, error: uerror } = await sb.from('users').select('username').eq('id', uid).single();
    const { data: cdata, error: cerror } = await sb.from('contract').select('id,owner,activated,hashrate,duration,expiration').eq('id', cid).single();
    if (merror || uerror || !mdata || !udata || !cdata || cerror) {
        return new Response(JSON.stringify({ response: 'Error fetching user data' }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }
    if (cdata.owner !== uid) {
        return new Response(JSON.stringify({ response: 'This contract is not available.' }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }

    try {
        var now = new Date().getTime();
        if (cdata.activated === null) {
            if(new Date(cdata.expiration).getTime() <= now) {
                return new Response(JSON.stringify({ response: 'This contract has expired.' }), {
                    status: 400,
                    headers: {
                        ...headers
                    }
                });
            }
            const { data: activec, error: activeerror } = await sb.from('contract').select('id').eq('owner', uid).not('activated', 'is', null);
            if (activeerror) return new Response(JSON.stringify({ response: 'Error checking active contracts' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
            if (activec.length >= LEVELS.perks[mdata.level][3]) return new Response(JSON.stringify({ response: 'You have reached the maximum number of active contracts for your level.' }), {
                status: 400,
                headers: {
                    ...headers
                }
            });
            const { error: updateError } = await sb.from('contract').update({ activated: new Date().toISOString() }).eq('id', cid);
            if (updateError) return new Response(JSON.stringify({ response: 'We had issues trying to activate your contract. Please try again later.' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
            return new Response(JSON.stringify({ response: '', sc: true }), {
                status: 200,
                headers: {
                    ...headers
                }
            });
        } else {
            var timediff = (new Date().getTime() - new Date(cdata.activated).getTime()) / 1000;
            if (timediff < cdata.duration * 60) return new Response(JSON.stringify({ response: 'The contract has not finished mining yet!' }), {
                status: 500,
                headers: {
                    ...headers
                }
            });
            const { data: dt, error: dte } = await sb.from("variable").select("value").eq("key", "nusperblock").single();
            const { data: dr, error: dre } = await sb.from("variable").select("value").eq("key", "hashperblock").single();
            const { data: ndata, error: nerror } = await sb.from('udata').select('balance_nus').eq('user_id', uid).single();
            if (dte || dre || nerror || !dt || !dr || !ndata) {
                return new Response(JSON.stringify({ response: 'We had issues trying to collect mining rewards. Please try again later.' }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
            var profit: number = parseFloat(((cdata.hashrate * 60 * cdata.duration * dt.value) / dr.value).toFixed(8));
            const { error: updateError } = await sb.from('udata').update({balance_nus: ndata.balance_nus + profit}).eq('user_id', uid);
            if (updateError) {
                return new Response(JSON.stringify({ response: 'We had issues updating your mining data. Please try again later.' }), {
                    status: 500,
                    headers: {
                        ...headers
                    }
                });
            }
            const { error: deleteError } = await sb.from('contract').delete().eq('id', cid);
            const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: udata.username, resource: { "nus": profit }, message: "Mining Contract reward", expiration: 1 });
            return new Response(JSON.stringify({ response: `${profit}`, sc:true }), {
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
