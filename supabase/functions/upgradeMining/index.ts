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
    const { data: nData, error: nError } = await sb.from("udata").select("balance_nus, balance_noca, balance_sats, mining_upg, hashrate, last_claimed, level").eq("user_id", uid).single();
    if (!nData || !uname || nError || unoerr) {
        return new Response(JSON.stringify({ response: "Unknown error.", code: 10 }), {
            status: 501,
            headers: { ...headers }
        });
    }

    var detail = {cost: [], val: 0};
    var shammy: boolean = false;
    var LEVELS = await fetch("../../supabase/functions/_shared/levels.json").then(response => response.json());

    switch (item) {
        case "cooling":
            switch (nData.mining_upg % 10) {
                case 0: detail.cost = [100, "noca"]; break;
                case 1: detail.cost = [225, "noca"]; break;
                case 2: detail.cost = [375, "noca"]; break;
                case 3: detail.cost = [550, "noca"]; break;
                case 4: detail.cost = [750, "noca"]; break;
                case 5: detail.cost = [1000, "noca"]; break;
                case 6: detail.cost = [1400, "noca"]; break;
                case 7: detail.cost = [2000, "noca"]; break;
                case 8: detail.cost = [3000, "noca"]; break;
                default: shammy = true;
            }
            break;
        case "memory":
            switch (Math.floor((nData.mining_upg % 100) / 10)) {
                case 0: detail.cost = [250, "noca"]; break;
                case 1: detail.cost = [480, "noca"]; break;
                case 2: detail.cost = [760, "noca"]; break;
                case 3: detail.cost = [1350, "noca"]; break;
                case 4: detail.cost = [2100, "noca"]; break;
                case 5: detail.cost = [4350, "noca"]; break;
                case 6: detail.cost = [7500, "noca"]; break;
                case 7: detail.cost = [12000, "noca"]; break;
                case 8: detail.cost = [20000, "noca"]; break;
                default: shammy = true;
            }
            break;
        case "hashrate":
            switch (Math.floor((nData.mining_upg % 1000) / 100)) {
                case 0: detail = { "cost": [50, "noca"], "val": 80 }; break;
                case 1: detail = { "cost": [110, "noca"], "val": 90 }; break;
                case 2: detail = { "cost": [165, "noca"], "val": 100 }; break;
                case 3: detail = { "cost": [225, "noca"], "val": 110 }; break;
                case 4: detail = { "cost": [300, "noca"], "val": 120 }; break;
                case 5: detail = { "cost": [500, "noca"], "val": 150 }; break;
                case 6: detail = { "cost": [735, "noca"], "val": 175 }; break;
                case 7: detail = { "cost": [1100, "noca"], "val": 200 }; break;
                case 8: detail = { "cost": [2000, "noca"], "val": 375 }; break;
                default: shammy = true;
            }
            break;
        case "npu1":
            /*switch (Math.floor((nData.mining_upg % 10000) / 1000)) {
                case 0: detail.cost = [250, "noca"]; break;
                case 1: detail.cost = [350, "noca"]; break;
                case 2: detail.cost = [480, "noca"]; break;
                case 3: detail.cost = [800, "noca"]; break;
                case 4: detail.cost = [1200, "noca"]; break;
                case 5: detail.cost = [1750, "noca"]; break;
                case 6: detail.cost = [2450, "noca"]; break;
                case 7: detail.cost = [3300, "noca"]; break;
                case 8: detail.cost = [5000, "noca"]; break;
                default: shammy = true;
            }*/ shammy = true;
            break;
        case "npu2":
            /*switch (Math.floor((nData.mining_upg % 100000) / 10000)) {
                case 0: detail.cost = [0.1, "nus"]; break;
                case 1: detail.cost = [0.15, "nus"]; break;
                case 2: detail.cost = [0.2, "nus"]; break;
                case 3: detail.cost = [0.3, "nus"]; break;
                case 4: detail.cost = [0.375, "nus"]; break;
                case 5: detail.cost = [0.45, "nus"]; break;
                case 6: detail.cost = [0.55, "nus"]; break;
                case 7: detail.cost = [0.7, "nus"]; break;
                case 8: detail.cost = [1, "nus"]; break;
                default: shammy = true;
            }*/ shammy = true;
            break;
        case "hashp":
            detail = { "cost": [5, "sat"], "val": 100 };
            break;
        default:
            shammy = true;
    }

    if (shammy) {
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

    try {
        var updateds = {};
        if (item === "cooling") updateds["mining_upg"] = nData.mining_upg + 1;
        else if (item === "memory") updateds["mining_upg"] = nData.mining_upg + 10;
        else if (item === "hashrate") { updateds["mining_upg"] = nData.mining_upg + 100; updateds["hashrate"] = nData.hashrate + detail.val; }
        else if (item === "npu1") updateds["mining_upg"] = nData.mining_upg + 1000;
        else if (item === "npu2") updateds["mining_upg"] = nData.mining_upg + 10000;
        else if (item === "hashp") updateds["hashrate"] = nData.hashrate + detail.val;

        // claim mining
        var now = new Date().getTime();
        var lastclaim = new Date(nData.last_claimed).getTime();
        var diff: number = (now - lastclaim) / 1000;
        var maxtime: number;
        switch (Math.floor((nData.mining_upg % 100) / 10)) {
            case 0: maxtime = 36 * 60 * 60; break;
            case 1: maxtime = 42 * 60 * 60; break;
            case 2: maxtime = 48 * 60 * 60; break;
            case 3: maxtime = 56 * 60 * 60; break;
            case 4: maxtime = 64 * 60 * 60; break;
            case 5: maxtime = 72 * 60 * 60; break;
            case 6: maxtime = 84 * 60 * 60; break;
            case 7: maxtime = 96 * 60 * 60; break;
            case 8: maxtime = 108 * 60 * 60; break;
            case 9: maxtime = 120 * 60 * 60; break;
        }
        maxtime += 60 * 60 * LEVELS.perks[nData.level][2];
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
        await sb.from('transaction').insert({ from: "admin:CompNUS", to: uname.username, resource: { "nus": profit }, message: "Mining reward" });

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
        await sb.from("transaction").insert({ from: uname.username, to: "CompNUS", resource: resources, message: "Mining Upgrade (id:"+item+")" });

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
