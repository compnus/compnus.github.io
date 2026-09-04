var uid = "";
var serverdata;
var contracts = { active: [], inactive: [] };
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
    if (contracts.active.length === 0) document.getElementById('levelpage0').innerHTML = "<h2 style='text-align: center;'>You have no active mining contracts.</h2>";
    else fillContracts(0);
    if (contracts.inactive.length === 0) document.getElementById('levelpage1').innerHTML = "<h2 style='text-align: center;'>You have no inactive mining contracts.</h2>";
    else {
        fillContracts(1);
    }
    document.getElementById('ac_current').innerHTML = contracts.active.length;
    document.getElementById('ac_max').innerHTML = LEVELS.perks[serverdata.level][3];
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
                    <h3>Hashrate: ${formatNumber(i.hashrate).join(' ')}H/s &emsp; Duration: ${formatTime(i.duration * 60, false).join(' ')}</h3>
                    <p>${page === 1 ? 'Expires on: ' + new Date(i.expiration).toLocaleDateString() : 'Activated on: ' + new Date(i.activated).toLocaleDateString()}</p>
                    ${page === 0 ? '<p>Pending Rewards: <span class="rewards"><span id="rewards' + id + '">0.00000000</span></p>' : ''}
                </div>
                <button id='button${page}_${id}' class="${page === 0 ? 'disabled' : ''}" onclick="resolveContract(${page}, ${id})">${page === 0 ? 'Loading...' : 'Activate'}</button>
            `;
        container.appendChild(contract);
        if (page === 0) {
            updating.push([document.getElementById('rewards' + id), ]);
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