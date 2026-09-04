var uid = "";
var serverdata;
var contracts = { active: [], inactive: [] };
var cache = {npb: 0, hpb: 0};
var updating = [];
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
        .select("activated,hashrate,duration,expiration,name")
        .eq("owner", uid);
    if (!contractsd || contractsError) { console.log("Server error."); return; }
    for (i of contractsd) {
        if (i.activated !== null) contracts.active.push(i);
        else contracts.inactive.push(i);
    }
    cache.npb = await getVariable("nusperblock");
    cache.hpb = await getVariable("hashperblock");
    if (cache.npb === 0 || cache.hpb === 0) { console.log("Server error."); return; }
    if (contracts.active.length === 0) document.getElementById('levelpage0').innerHTML = "<h2 style='text-align: center;'>You have no active mining contracts.</h2>";
    else fillContracts(0);
    if (contracts.inactive.length === 0) document.getElementById('levelpage1').innerHTML = "<h2 style='text-align: center;'>You have no inactive mining contracts.</h2>";
    else {
        fillContracts(1);
    }
    document.getElementById('ac_current').innerHTML = contracts.active.length;
    document.getElementById('ac_max').innerHTML = LEVELS.perks[serverdata.level][3];
}

function showEstimated(hashrate, duration) {
    popup('Estimated Rewards',
        `Current Block Reward: ${cache.npb}<br>
        Hashes Needed per Block: ${cache.hpb}<br>
        Hashrate: ${formatNumber(hashrate).join(' ')}H/s<br>
        Rewards per Minute: ${((hashrate * 60 * cache.npb) / cache.hpb).toFixed(8)} <span class='rewards'>$</span><br>
        Approximated Total Rewards: <b>${((hashrate * 60 * duration * cache.npb) / cache.hpb).toFixed(8)}</b> <span class='rewards'>$</span>`
    ); 
}

function fillContracts(page) {
    var id = 0;
    if (page === 0) updating = [];
    document.getElementById('levelpage' + page).innerHTML = "<div class='contractc' id='contractc" + page + "'></div>";
    const container = document.getElementById('contractc' + page);
    for (i of (page === 0 ? contracts.active : contracts.inactive)) {
        const contract = document.createElement('div');
        contract.classList.add('contractd');
        contract.innerHTML = `
                <div>
                    <h1>${i.name ? i.name : 'Mining Contract'}</h1>
                    <h3>Hashrate: ${formatNumber(i.hashrate).join(' ') }H/s &emsp; Duration: <u onclick="popup('Duration', 'Exact Duration: ${i.duration} minute(s)<br><i>&approx; ${Math.floor(i.duration / 60)} hour(s) | ${Math.floor(i.duration / 1440)} day(s)</i>')" style="cursor:pointer">${formatTime(i.duration * 60, false).join(' ')}</u></h3>
                    <p>${page === 1 ? 'Expire' + (i.expiration <= new Date().toISOString().slice(0, 10) ? 'd' : 's') + ' on: ' + new Date(i.expiration).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Activated on: ' + new Date(i.activated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} &emsp; <i style="font-weight: normal" class='link' onclick='showEstimated(${i.hashrate}, ${i.duration})'>Calculate Rewards</i></p>
                    ${page === 0 ? '<p>Accumulated Rewards: <span class="rewards">$</span> <span id="rewards' + id + '">0.00000000</span></p>' : ''}
                </div>
                <button id='button${page}_${id}' class="${page === 0 ? 'disabled' : ''}" onclick="resolveContract(${page}, ${id})">${page === 0 ? 'Loading...' : 'Activate'}</button>
            `;
        container.appendChild(contract);
        if (page === 0) {
            updating.push([document.getElementById('rewards' + id), document.getElementById('button' + page + '_' + id)]);
            id++;
        }
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