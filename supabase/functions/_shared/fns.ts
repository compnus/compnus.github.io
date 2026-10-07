export function rndm(min: number, max: number, step: number): number {
    if (min > max) {
        const t = min;
        min = max;
        max = t;
    }

    const getDecimals = (v: number) => {
        const s = String(v);
        if (s.toLowerCase().includes("e")) {
            const match = s.match(/(?:\.(\d+))?e([+-]?\d+)$/i);
            if (!match) return 0;
            const fracLen = match[1] ? match[1].length : 0;
            const exp = parseInt(match[2], 10);
            return Math.max(0, fracLen - exp);
        }
        return (s.split(".")[1] || "").length;
    };

    const decimals = Math.max(getDecimals(min), getDecimals(max), getDecimals(step));
    const factor = Math.pow(10, decimals);

    const minInt = Math.round(min * factor);
    const maxInt = Math.round(max * factor);
    const stepInt = Math.round(step * factor);

    const maxSteps = Math.floor((maxInt - minInt) / stepInt);
    if (maxSteps < 0) return parseFloat((min).toFixed(decimals));

    const stepIndex = Math.floor(Math.random() * (maxSteps + 1));
    const valueInt = minInt + stepIndex * stepInt;

    return parseFloat((valueInt / factor).toFixed(decimals));
}

export async function mining(sb: any, uid: string, LEVELS: any, UPGRADES: any, data: any, bypass: boolean = false): Promise<any> { // [status:number, response:string | response_parts:object, http:number]
    var maxXP = 0;
    if (data.level < 10) maxXP = LEVELS.perks[data.level + 1][0] - data.exp;
    var now = new Date().getTime();
    var lastclaim = new Date(data.last_claimed).getTime();
    var diff: number = (now - lastclaim) / 1000;
    var mintime: number = UPGRADES.cooling[data.mining_upg % 10][3] * 60 * 60;
    var maxtime: number = (UPGRADES.memory[Math.floor((data.mining_upg % 100) / 10)][3] + LEVELS.perks[data.level][2]) * 60 * 60;
    if (!bypass && diff < mintime) return [1, "You cannot start mining yet! Please wait until the cooldown period has passed. (Check the timer!)", 200];
    else {
        var xpgain: number = Math.min(maxXP, Math.floor((Math.min(diff / 600, (UPGRADES.memory[Math.floor((data.mining_upg % 100) / 10)][3] + LEVELS.perks[data.level][2]) * 6)) * ((LEVELS.perks[data.level][1] + UPGRADES.echip[Math.floor((data.mining_upg % 1000000) / 100000)][3]) / 100)));
        maxXP -= xpgain;
        const { data: dt, error: dte } = await sb.from("variable").select("value").eq("key", "nusperblock").single();
        const { data: dr, error: dre } = await sb.from("variable").select("value").eq("key", "hashperblock").single();
        const { data: cdata, error: cerror } = await sb.from('udata').select('balance_nus').eq('user_id', uid).single();
        if (dte || dre || cerror || !dt || !dr || !cdata) return [10, "We had issues trying to collect mining rewards. Please try again later.", 500];
        var profit: number = parseFloat(((data.hashrate * Math.min(diff, maxtime) * dt.value) / dr.value).toFixed(8));
        var post = { balance_nus: cdata.balance_nus + profit, last_claimed: new Date().toISOString(), exp: data.exp + xpgain };
        const { error: updateError } = await sb.from('udata').update(post).eq('user_id', uid);
        if (updateError) return [10, "We had issues updating your mining data. Please try again later.", 500];
        const { error: insertError } = await sb.from('transaction').insert({ from: "admin:CompNUS", to: data.username, resource: { "nus": profit }, message: "Mining reward", expiration: 1 });
        return [insertError ? 2 : 5, { newtime: post.last_claimed, reward: profit, level: maxXP === 0 && data.level !== 10, xp: xpgain }, 200];
    }
}