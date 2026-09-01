var uid = "";
var serverdata;
var LEVELS;

async function main() {
    const { user, data } = await getUser();
    //if (!user) window.location.href = "/u/login.html";
    uid = data.id;
    await loadData();
}

async function loadData() {
    const { data: serverdatac, error: userExistsErrorn } = await sb
        .from("udata")
        .select("balance_noca, level, exp")
        .eq("user_id", uid)
        .single();
    if (!serverdatac || userExistsErrorn) console.log("Server error.");
    else LEVELS = await fetch("../../supabase/functions/_shared/levels.json").then(response => response.json());
    serverdata = serverdatac;
    document.getElementById('balance_noca').innerHTML = serverdata.balance_noca;
    var maxxp;
    try { maxxp = LEVELS.perks[serverdata.level + 1][0] }
    catch (e) { maxxp = -1 }
    document.getElementById('exp_current').innerHTML = maxxp === -1 ? "Max Level" : Math.min(serverdata.exp,maxxxp);
    document.getElementById('exp_needed').innerHTML = maxxp===-1?"-":formatNumber(maxxxp).join("");
    document.getElementById('levelnumber').innerHTML = serverdata.level;
    document.getElementById('levelicon').classList.add('llevel' + serverdata.level);
    if (maxxp === -1) {
        var lss = document.querySelectorAll(".sp4x");
        for (let l of lss) l.style.display = 'none';
        document.getElementById('progressbar').style.display = 'none';
        document.getElementById('level_up').classList.add('disabled');
        document.getElementById('level_up').innerHTML = 'MAX LEVEL';
    } else {
        var completion = serverdata.exp / maxxp;
        completion = Math.min(1, completion);
        if (completion >= 0.015) document.getElementById('progress').style.width = (completion * 50) + "vh";
    }
}

function levelPage(turn) {
    var pages = document.querySelectorAll('.levelpage');
    for (let p of pages) p.style.display = 'none';
    var sels = document.querySelectorAll('.lpselector');
    for (let p of sels) p.classList.remove('here');
    document.getElementById('levelpage' + turn).style.display = 'flex';
    document.getElementById('selector' + turn).classList.add('here');
}