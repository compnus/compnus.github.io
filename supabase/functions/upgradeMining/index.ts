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
    let item: string | null = null;

    try {
        const body = await req.json();
        item = body.item || null;
    } catch (error) {
        console.error("Failed to parse JSON body", error);
        return new Response(JSON.stringify({ response: "Failed to parse request body" + error }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }
    if (!item) {
        return new Response(JSON.stringify({ response: "Please provide what to upgrade.", code: 10 }), {
            status: 400,
            headers: {
                ...headers
            }
        });
    }
    const { data: uname, error: unoerr } = await sb.from("users").select("username").eq("id", uid).single();
    const { data: nData, error: nError } = await sb.from("udata").select("balance_nus, balance_noca, balance_sats, mining_upg, hashrate, last_claimed, level, exp").eq("user_id", uid).single();
    if (!nData || !uname || nError || unoerr) {
        return new Response(JSON.stringify({ response: "Unknown error.", code: 10 }), {
            status: 501,
            headers: { ...headers }
        });
    }

    var detail = {cost: [], val: 0, reqlv: 0};
    var shammy: boolean = false;
    var levelraw: number = -2;
    switch (item) {
        case "cooling":
            levelraw = nData.mining_upg % 10;
            break;
        case "memory":
            levelraw = Math.floor((nData.mining_upg % 100) / 10);
            break;
        case "hashrate":
            levelraw = Math.floor((nData.mining_upg % 1000) / 100);
            break;
        /*
        case "npu1":
            levelraw = Math.floor((nData.mining_upg % 10000) / 1000);
            break;
        case "npu2":
            levelraw = Math.floor((nData.mining_upg % 100000) / 10000);
            break;
        */
        case "hashp":
            levelraw = -1;
            break;
        case "echip":
            levelraw = Math.floor((nData.mining_upg % 1000000) / 100000);
            break;
        default: shammy = true;
    }

    levelraw++;
    if (levelraw >= UPGRADES[item].length) levelraw = -1;
    detail.cost = UPGRADES[item][levelraw][2];
    detail.val = UPGRADES[item][levelraw][3];
    detail.cost[1] = UPGRADES["currency.nfo"][detail.cost[1]][1];
    detail.reqlv = UPGRADES[item][levelraw][5];

    if (shammy || levelraw === -1) {
        return new Response(JSON.stringify({ response: "Item is already at max level.", code: 10 }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    }

    if ((detail.cost[1] === "nus" && nData.balance_nus < detail.cost[0]) ||
        (detail.cost[1] === "noca" && nData.balance_noca < detail.cost[0]) ||
        (detail.cost[1] === "sat" && nData.balance_sats < detail.cost[0])) return new Response(JSON.stringify({ response: "Insufficient balance.", code: 10 }), {
            status: 500,
            headers: {
                ...headers
            }
        });
    if (nData.level < detail.reqlv) return new Response(JSON.stringify({ response: "You need to reach level " + detail.reqlv + " to upgrade this.", code: 10 }), {
        status: 500,
        headers: {
            ...headers
        }
    });

    try {
        var updateds = {};
        if (item === "cooling") updateds["mining_upg"] = nData.mining_upg + 1;
        else if (item === "memory") updateds["mining_upg"] = nData.mining_upg + 10;
        else if (item === "hashrate") { updateds["mining_upg"] = nData.mining_upg + 100; updateds["hashrate"] = nData.hashrate + detail.val; }
        else if (item === "npu1") updateds["mining_upg"] = nData.mining_upg + 1000;
        else if (item === "npu2") updateds["mining_upg"] = nData.mining_upg + 10000;
        else if (item === "hashp") updateds["hashrate"] = nData.hashrate + detail.val;
        else if (item === "echip") updateds["mining_upg"] = nData.mining_upg + 100000;

        // claim mining
        const miningStatus: [number, any, number] = await mining(sb, uid, LEVELS, UPGRADES, { ...nData, ...uname }, true);
        if (typeof miningStatus[1] === "string") return new Response(JSON.stringify({ response: miningStatus[1], code: miningStatus[0] }), {
            status: miningStatus[2],
            headers: {
                ...headers
            }
        });
        nData.balance_nus = nData.balance_nus + miningStatus[1].reward;

        // push updates
        if (detail.cost[1] === "nus") updateds["balance_nus"] = parseFloat((nData.balance_nus - detail.cost[0]).toFixed(8));
        else if (detail.cost[1] === "noca") updateds["balance_noca"] = nData.balance_noca - detail.cost[0];
        else if (detail.cost[1] === "sat") updateds["balance_sats"] = parseFloat((nData.balance_sats - detail.cost[0]).toFixed(4));

        const { error: updatedE } = await sb.from('udata').update(updateds).eq('user_id', uid);
        if (updatedE) return new Response(JSON.stringify({ response: 'We had issues saving your updated mining data. The upgrade was reverted. Please try again later.', code: 10 }), {
            status: 500,
            headers: {
                ...headers
            }
        });

        var resources = {};
        resources[detail.cost[1]] = detail.cost[0];
        await sb.from("transaction").insert({ from: uname.username, to: "CompNUS", resource: resources, message: "Mining Upgrade (id:"+item+")", expiration: 1 });

        return new Response(JSON.stringify({ response: "", code: 0 }), {
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
