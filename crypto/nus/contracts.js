var uid = "";
var serverdata;
var contracts = {active: [], inactive: []};
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
        .select("balance_nus, level")
        .eq("user_id", uid)
        .single();
    if (!serverdatac || userExistsErrorn) { console.log("Server error."); return; }
    LEVELS = await fetch("../../supabase/functions/_shared/levels.json").then(response => response.json());
    serverdata = serverdatac;
    document.getElementById('balance_nus').innerHTML = serverdata.balance_nus;
    const { data: contractsd, error: contractsError } = await sb
        .from("contract")
        .select("activated,hashrate,duration,expiration")
        .eq("user_id", uid);
    if (!contractsd || contractsError) { console.log("Server error."); return; }
    for (i of contractsd) {
        if (i.activate !== null) contracts.active.push(i);
        else contracts.inactive.push(i);
    }
    if (contracts.active.length == 0) document.getElementById('levelpage0').innerHTML = "<h2>You have no active mining contracts.</h2>";
    if (contracts.inactive.length == 0) document.getElementById('levelpage1').innerHTML = "<h2>You have no inactive mining contracts.</h2>";
    document.getElementById('ac_current').innerHTML = contracts.active.length;
    document.getElementById('ac_max').innerHTML = LEVELS.perks[serverdata.level][3];
}

function levelPage(turn) {
    var pages = document.querySelectorAll('.levelpage');
    for (let p of pages) p.style.display = 'none';
    var sels = document.querySelectorAll('.lpselector');
    for (let p of sels) p.classList.remove('here');
    document.getElementById('levelpage' + turn).style.display = 'flex';
    document.getElementById('selector' + turn).classList.add('here');
}