var SIDES = 0;
var uid = "";
var animations = true;
var serverdata = null;
var mobileopen = false;
var interval = null;
var cache = {};
var compacting = 0;
var LEVELS = null;
var UPGRADES = null;

async function main() {
    const { user, data } = await getUser();
    //if (!user) window.location.href = "/u/login.html";
    uid = data.id;

    compacting = localStorage.getItem("m_compacting") === "1" ? 1 : 0;

    LEVELS = await fetch("../../supabase/functions/_shared/levels.json").then(response => response.json());
    if (!LEVELS) console.log("panic");
    await initialize_serverdata();

    interval = setInterval(calculateProfit, 1000);
}

async function initialize_serverdata() {
    const balance = await getBalance(uid);
    document.getElementById("walletnus").innerHTML = balance[0];
    document.getElementById("walletnoca").innerHTML = balance[1];
    document.getElementById("walletsats").innerHTML = balance[2];

    const { data: serverdatac, error: userExistsErrorn } = await sb
        .from("udata")
        .select("hashrate, last_claimed, mining_upg, level")
        .eq("user_id", uid)
        .single();
    if (!serverdatac || userExistsErrorn) console.log("Server error.");
    else {
        UPGRADES = await fetch("../../supabase/functions/_shared/upgrades.json").then(response => response.json());
        document.getElementById("upgradebt").classList.remove("disabled");
    }
    serverdata = serverdatac;

    document.getElementById("mstat_hashrate").innerHTML = formatNumber(serverdata.hashrate).join(" ") + "H/s";
    document.getElementById("hashrateplain").innerHTML = serverdata.hashrate + "H/s";

    var _npb = await getVariable("nusperblock");
    var _hpb = await getVariable("hashperblock");
    cache.npb = _npb;
    cache.hpb = _hpb;
    document.getElementById("blockrewarddspl").innerHTML = _npb;
    document.getElementById("blockhashrdspl").innerHTML = _hpb + "H (" + formatNumber(_hpb).join(" ") + "H)";
    document.getElementById("calcresultdspl").innerHTML = document.getElementById("mstat_daily").innerHTML = ((serverdata.hashrate * 86400 * cache.npb) / cache.hpb).toFixed(4);
    document.getElementById("mstat_cool").innerHTML = UPGRADES.cooling[serverdata.mining_upg % 10][3] + " hours";
}

function collapseSide(which) {
    if (which == "left") {
        if (SIDES % 2 == 1) SIDES -= 1;
        else SIDES += 1;
    } else {
        if (SIDES >= 2) SIDES -= 2;
        else SIDES += 2;
    }
    document.getElementById("collapser" + which).classList.toggle("collapsed");
    var leftbar = document.getElementById("leftsd");
    var rightbar = document.getElementById("rightsd");
    var grid = document.querySelector("main");
    switch (SIDES) {
        case 0: //both visible
            grid.style.gridTemplateColumns = "25vw 48vw 25vw";
            leftbar.style.right = "0";
            break;
        case 1: //left hidden
            grid.style.gridTemplateColumns = "4vh calc(73vw - 4vh) 25vw";
            leftbar.style.right = "calc(25vw - 4vh)";
            break;
        case 2: //right hidden
            grid.style.gridTemplateColumns = "25vw calc(73vw - 4vh) 4vh";
            leftbar.style.right = "0";
            break;
        case 3: //both hidden
            grid.style.gridTemplateColumns = "4vh calc(98vw - 8vh) 4vh";
            leftbar.style.right = "calc(25vw - 4vh)";
    }
}

function collapseSideMobile() {
    var syncHistory = true;
    if (arguments.length > 0) syncHistory = arguments[0];

    if (mobileopen) {
        document.getElementById("rightsd").style.width = "0";
        document.getElementById("rightsd").style.boxShadow = "black 0 0 15px 0";
        document.getElementById("collapsemobile").style.right = "0";
        document.getElementById("collapsemobile").style.borderRadius = "3vw 0 0 3vw";
        mobileopen = false;
        if (syncHistory && history.state && history.state.mobileSidebar) {
            history.back();
        }
    } else {
        document.getElementById("rightsd").style.width = "85vw";
        document.getElementById("rightsd").style.boxShadow = "rgba(0 0 0 / 0.7) 0 0 15px 15vw";
        document.getElementById("collapsemobile").style.right = "87.5vw";
        document.getElementById("collapsemobile").style.borderRadius = "3vw";
        if (syncHistory) history.pushState({ mobileSidebar: true }, '');
        mobileopen = true;
    }
}

window.addEventListener('popstate', function (e) {
    if (window.innerWidth <= 800 && mobileopen) {
        collapseSideMobile(false);
    }
});

function loadApproximations() {
    if (!serverdata) popup("An error occurred!", "We were unable to load your data.<br>Make sure you are logged in and that your internet connection is sufficient.");
    popup("Approximate Rewards", `
        Reward per Day: ${((serverdata.hashrate * 86400 * cache.npb) / cache.hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Hour: ${((serverdata.hashrate * 3600 * cache.npb) / cache.hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Minute: ${((serverdata.hashrate * 60 * cache.npb) / cache.hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Second: ${((serverdata.hashrate * cache.npb) / cache.hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span></p>
        <div class="myhr"></div><p style="margin-bottom:0">
        Reward per Week: ${((serverdata.hashrate * 86400 * 7 * cache.npb) / cache.hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Month: ${((serverdata.hashrate * 86400 * 30 * cache.npb) / cache.hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Year: ${((serverdata.hashrate * 86400 * 365 * cache.npb) / cache.hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
    `);
}

function hashrateCalc() {
    popup("Hashrate Calculator",
        `</p>
        <div class="input">
            <label for="hinput">Hashrate:</label>
            <input id="hinput" oninput="this.value=Math.floor(this.value); if (this.value < 0) this.value = 0; handleHashCalc(this.value, ${cache.npb}, ${cache.hpb});" placeholder="H/s" type="number">
        </div>
        <p class="sidemini"><span id="calculatedhash">0 </span>H/s</p>
        <br>
        <p style="margin-bottom: 0">
        Reward per Day: <span id="hcrp_day">0.00000000</span> <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Hour: <span id="hcrp_hour">0.00000000</span> <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Minute: <span id="hcrp_min">0.00000000</span> <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Second: <span id="hcrp_sec">0.00000000</span> <span style="font-family:'currencycompnus',Ubuntu !important">$</span></p>
        <div class="myhr"></div><p style="margin-bottom:0">
        Reward per Week: <span id="hcrp_week">0.0000</span> <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Month: <span id="hcrp_mon">0.0000</span> <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Year: <span id="hcrp_year">0.0000</span> <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
        `
    );
}

function handleHashCalc(hash, npb, hpb) {
    document.getElementById("calculatedhash").innerHTML = formatNumber(+(hash)).join(" ");
    document.getElementById("hcrp_day").innerHTML = ((hash * 86400 * npb) / hpb).toFixed(8);
    document.getElementById("hcrp_hour").innerHTML = ((hash * 3600 * npb) / hpb).toFixed(8);
    document.getElementById("hcrp_min").innerHTML = ((hash * 60 * npb) / hpb).toFixed(8);
    document.getElementById("hcrp_sec").innerHTML = ((hash * npb) / hpb).toFixed(8);
    document.getElementById("hcrp_week").innerHTML = ((hash * 86400 * 7 * npb) / hpb).toFixed(4);
    document.getElementById("hcrp_mon").innerHTML = ((hash * 86400 * 30 * npb) / hpb).toFixed(4);
    document.getElementById("hcrp_year").innerHTML = ((hash * 86400 * 365 * npb) / hpb).toFixed(4);
}

function toggleAnimations() {
    let pulse = document.getElementById("miningicon");
    let rot1 = document.getElementById("miningicona1");
    let rot2 = document.getElementById("miningicona2");
    let rot3 = document.getElementById("miningicona3");
    let rotb = document.getElementById("miningiconb");
    let rotc = document.getElementById("miningiconc");
    if (animations) {
        pulse.style.animationPlayState = "paused";
        rot1.style.animationPlayState = "paused";
        rot2.style.animationPlayState = "paused";
        rot3.style.animationPlayState = "paused";
        rotb.style.animationPlayState = "paused";
        rotc.style.animationPlayState = "paused";
    } else {
        pulse.style.animationPlayState = "running";
        rot1.style.animationPlayState = "running";
        rot2.style.animationPlayState = "running";
        rot3.style.animationPlayState = "running";
        rotb.style.animationPlayState = "running";
        rotc.style.animationPlayState = "running";
    }
    animations = !animations;
}

function calculateProfit() {
    document.querySelector("#accumulateddisplayp > .numberAnimation > .numberSlideWrapper").style.width = "8.00000001ch";
    setTimeout(() => {
        document.querySelector("#accumulateddisplayp > .numberAnimation > .numberSlideWrapper").style.width = "8ch";
    }, 100);
    var button = document.getElementById("mining_action");
    if (serverdata.last_claimed === null) {
        button.classList.remove("disabled");
        button.innerHTML = "START MINING";
        return;
    }
    var now = new Date().getTime();
    var lastclaim = new Date(serverdata.last_claimed).getTime();
    var diff = (now - lastclaim) / 1000;

    var mintime = UPGRADES.cooling[serverdata.mining_upg % 10][3] * 60 * 60;
    var maxtime = UPGRADES.memory[Math.floor((serverdata.mining_upg % 100) / 10)][3] * 60 * 60 + LEVELS.perks[serverdata.level][2] * 60 * 60;

    document.getElementById("mstat_max").innerHTML = formatTime(maxtime - diff,false).join(" ");
    button.innerHTML = diff < mintime ? formatTime(mintime - diff, true) : "COLLECT";
    if (diff >= mintime) button.classList.remove("disabled");

    var profit = ((serverdata.hashrate * Math.min(diff, maxtime) * cache.npb) / cache.hpb).toFixed(8);
    counterw.setNumber(Math.floor(profit));
    counterp.setNumber(Math.floor((profit - Math.floor(profit)) * 100000000));
}

async function miningStart() {
    clearInterval(interval);
    var bt = document.getElementById("mining_action");
    bt.innerHTML = "Please wait...";
    bt.classList.add("disabled");
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/mining', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: ""
    })
        .then(response => response.json())
        .then(async data => {  //0,5 = success; 10 = error; 1,2 = warning
            if (data.code === 10) {
                bt.classList.remove("disabled");
                bt.innerHTML = "Please try again.";
                popup("Error!", data.response);
            } else if (data.code === 0) {
                popup("Mining started!", "You can claim once the collect button appears (check the timer).");
                serverdata.last_claimed = data.response;
            } else if (data.code === 1) {
                popup("Slow down there!", data.response);
            } else if ((data.code === 2) || (data.code === 5)) {
                response = JSON.parse(data.response);
                serverdata.last_claimed = response.newtime;
                popup("Mining rewards claimed!", `You have received ${response.reward} $NUS!<br>You may claim again once the timer expires.` + (data.code === 2 ? "<br><br>Due to an internal error, your claim will not show up in your transaction history." : ""));
                const balance = await getBalance(uid);
                document.getElementById("walletnus").innerHTML = balance[0];
                document.getElementById("walletnoca").innerHTML = balance[1];
                document.getElementById("walletsats").innerHTML = balance[2];
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
            bt.innerHTML = "Please try again.";
            bt.classList.remove("disabled");
        });
    interval = setInterval(calculateProfit, 1000);
}

function compactingfn() {
    document.getElementById("upgrades_main").classList.toggle("compacted");
    compacting = 1 - compacting;
    localStorage.setItem("m_compacting", `${compacting}`);
}

function openUpgrades() {
    const thispop = popupid;
    popup("Mining Upgrades", `
    <div id="upgrades_main" class="${(compacting===1?'compacted':'')}">
    <img id="compacting" src="https://img.icons8.com/?size=100&id=90337&format=png&color=FFFFFF" onclick="compactingfn()" title="Change tile size">
    <div class="upgrade_item">
        <div><h1>Cooling</h1><h2 onclick="popup('Cooling', 'The faster your mining machine can cool down, the more often you can claim your mining rewards! Upgrade cooling to decrease claim cooldown.',true,true)">?</h2></div>
        <img id="coolingi" src="/site/image/assets/mining/cooling0.png">
        <h1 id="coolingn">No Cooling</h1>
        <h2>Claim Cooldown: <span id="coolingv">24</span> hours</h2>
        <p id="coolingd">Loading...</p>
        <button id="coolingb" class="disabled" onclick="upgrade('cooling', ${thispop})">Upgrade</button>
    </div>
    <div class="upgrade_item">
        <div><h1>Memory</h1><h2 onclick="popup('Memory', 'Better memory allows your mining machine to hold more tokens! Upgrade memory to increase mining uptime.',true,true)">?</h2></div>
        <img id="memoryi" src="/site/image/assets/mining/memory0.png">
        <h1 id="memoryn">Uni Chip</h1>
        <h2>Mining Uptime: <span id="memoryv">36</span> hours</h2>
        <p id="memoryd">Loading...</p>
        <button id="memoryb" class="disabled" onclick="upgrade('memory', ${thispop})">Upgrade</button>
    </div>
    <div class="upgrade_item">
        <div><h1>NPU Supply</h1><h2 onclick="popup('NPU Supply', 'Number Processing Unit supply increases the odds of generating numbers that are more likely to mine the block! Upgrade NPU supply to increase your chance of winning a block.',true,true)">?</h2></div>
        <img id="npu1i" src="/site/image/assets/mining/npu10.png">
        <h1 id="npu1n">No Supply</h1>
        <h2>Block Win Chance: <span id="npu1v">0</span>%</h2>
        <p id="npu1d">Loading...</p>
        <button id="npu1b" class="disabled" onclick="upgrade('npu1', ${thispop})">Coming Soon</button>
    </div>
    <div class="upgrade_item">
        <div><h1>NPU Power</h1><h2 onclick="popup('NPU Power', 'Number Processing Unit power increases the accuracy of the generated numbers, making winning blocks more rewarding! Upgrade NPU power to increase the amount of tokens you win from a block.',true,true)">?</h2></div>
        <img id="npu2i" src="/site/image/assets/mining/npu20.png">
        <h1 id="npu2n">Base Power</h1>
        <h2>Block Win Bonus: <span id="npu2v">5</span>%</h2>
        <p id="npu2d">Loading...</p>
        <button id="npu2b" class="disabled" onclick="upgrade('npu2', ${thispop})">Coming Soon</button>
    </div>
    <div class="upgrade_item">
        <div><h1>Hashrate</h1><h2 onclick="popup('Hashrate', 'You can purchase more hashrate for Nocas here. In order to increase your hashrate further, explore further. Further beyond. Maybe you will find something?',true,true)">?</h2></div>
        <img id="hashratei" src="/site/image/assets/mining/hash0.png">
        <h1 id="hashraten">Base Hashrate</h1>
        <p>You can only receive hashrate this way 10 times in total (including the initial 100H/s awarded for creating your account).</p>
        <button id="hashrateb" class="disabled" onclick="upgrade('hashrate', ${thispop})">Purchase</button>
    </div>
    <div class="upgrade_item">
        <div><h1>Hashrate</h1><h2 onclick="popup('Hashrate', 'You can purchase more hashrate for Satoshis here.',true,true)">?</h2></div>
        <img id="hashpi" src="/site/image/assets/mining/hashp.png" style="filter:drop-shadow(0 0 5px rgba(255,255,255,0.5))">
        <h1 id="hashpn">Premium Hashrate</h1>
        <p id="hashpd">Invest your earned Satoshis into hashrate and boost your mining power! There is no purchase limit for now.</p>
        <button id="hashpb" onclick="upgrade('hashp', ${thispop})">Purchase</button>
    </div>

    </div>
    <p style="margin:0">
    `, true, true);
    const el = {
        cooling: {
            img: document.getElementById("coolingi"),
            name: document.getElementById("coolingn"),
            value: document.getElementById("coolingv"),
            desc: document.getElementById("coolingd"),
            button: document.getElementById("coolingb")
        },
        memory: {
            img: document.getElementById("memoryi"),
            name: document.getElementById("memoryn"),
            value: document.getElementById("memoryv"),
            desc: document.getElementById("memoryd"),
            button: document.getElementById("memoryb")
        },
        hashrate: {
            img: document.getElementById("hashratei"),
            name: document.getElementById("hashraten"),
            desc: document.getElementById("hashrated"),
            button: document.getElementById("hashrateb")
        },
        npu1: {
            img: document.getElementById("npu1i"),
            name: document.getElementById("npu1n"),
            value: document.getElementById("npu1v"),
            desc: document.getElementById("npu1d"),
            button: document.getElementById("npu1b")
        },
        npu2: {
            img: document.getElementById("npu2i"),
            name: document.getElementById("npu2n"),
            value: document.getElementById("npu2v"),
            desc: document.getElementById("npu2d"),
            button: document.getElementById("npu2b")
        },
        hashp: {
            img: document.getElementById("hashpi"),
            name: document.getElementById("hashpn"),
            desc: document.getElementById("hashpd"),
            button: document.getElementById("hashpb")
        }
    }
    const lv = {
        cooling: serverdata.mining_upg % 10,
        memory: Math.floor((serverdata.mining_upg % 100) / 10),
        hashrate: Math.floor((serverdata.mining_upg % 1000) / 100),
        npu1: Math.floor((serverdata.mining_upg % 10000) / 1000),
        npu2: Math.floor((serverdata.mining_upg % 100000) / 10000)
    }
    const rig = {
        cooling: UPGRADES.cooling[lv.cooling],
        memory: UPGRADES.memory[lv.memory],
        hashrate: UPGRADES.hashrate[lv.hashrate],
        npu1: UPGRADES.npu1[lv.npu1],
        npu2: UPGRADES.npu2[lv.npu2]
    }
    if (lv.cooling === 9) el.cooling.button.innerHTML = "MAX"
    else el.cooling.button.classList.remove("disabled");
    if (lv.memory === 9) el.memory.button.innerHTML = "MAX"
    else el.memory.button.classList.remove("disabled");
    if (lv.hashrate === 9) el.hashrate.button.innerHTML = "MAX"
    else el.hashrate.button.classList.remove("disabled");
    /*if (lv.npu1 === 9) el.npu1.button.innerHTML = "MAX"
    else el.npu1.button.classList.remove("disabled");*/
    /*if (lv.npu2 === 2) el.npu2.button.innerHTML = "MAX"
    else el.npu2.button.classList.remove("disabled");*/
    el.cooling.img.src = "/site/image/assets/mining/"+rig.cooling[4]+".png";
    el.cooling.name.innerHTML = rig.cooling[0];
    el.cooling.value.innerHTML = rig.cooling[3];
    el.cooling.desc.innerHTML = rig.cooling[1];
    el.memory.img.src = "/site/image/assets/mining/" + rig.memory[4] +".png";
    el.memory.name.innerHTML = rig.memory[0];
    el.memory.value.innerHTML = rig.memory[3];
    el.memory.desc.innerHTML = rig.memory[1];
    el.hashrate.img.src = "/site/image/assets/mining/" + rig.hashrate[4] +".png";
    el.hashrate.name.innerHTML = rig.hashrate[0];
    el.npu1.img.src = "/site/image/assets/mining/" + rig.npu1[4] +".png";
    el.npu1.name.innerHTML = rig.npu1[0];
    el.npu1.value.innerHTML = rig.npu1[3];
    el.npu1.desc.innerHTML = rig.npu1[1];
    el.npu2.img.src = "/site/image/assets/mining/" + rig.npu2[4] +".png";
    el.npu2.name.innerHTML = rig.npu2[0];
    el.npu2.value.innerHTML = rig.npu2[3];
    el.npu2.desc.innerHTML = rig.npu2[1];
}

function upgrade(what, closeid) {
    const sendfundsrqpopupid = popupid;
    popup("Confirm Upgrade", ((what !== "hashrate") && (what !== "hashp") ?`
    <div id="upgrades_side">
    <div class="upgrade_tile">
        <img id="upg_lefti" src="/site/image/logo/main.svg">
        <h1 id="upg_leftn">Loading...</h1>
        <h2 id="upg_leftv">Loading...</h2>
        <p id="upg_leftd">Loading...</p>
    </div>
    <div class="upgrade_tile" style="background: none !important">
        <img src="https://img.icons8.com/?size=300&id=86088&format=png&color=FFFFFF" id="aaaarrow">
        <h1>&nbsp;</h1>
        <h2 id="upg_diff" style="color:#00cc00">?</h2>
    </div>
    <div class="upgrade_tile">
        <img id="upg_righti" src="/site/image/logo/main.svg">
        <h1 id="upg_rightn">Loading...</h1>
        <h2 id="upg_rightv">Loading...</h2>
        <p id="upg_rightd">Loading...</p>
    </div>
    </div>
    `:`
    <div id="upgrades_side">
    <div class="upgrade_tile" id="upgrade_side_only">
        <img id="upg_i" src="/site/image/logo/main.svg">
        <h1 id="upg_n">Loading...</h1>
        <h2 id="upg_v" style="color:#00cc00">Loading...</h2>
    </div>
    </div>
    `) + `
    <h1 id="upgrade_cost">Cost: <span id="upgrade_csp">Loading...</span></h1>
    <p id="upgrade_disc" class="maxpwidth">Keep in mind that proceeding with the upgrade will automatically collect your current mining rewards.</p>

    <p id="upgrade_status" class="maxpwidth" style="font-weight: bold"></p>

    <div class="flex cc" id="controls">
    <button class="fullwidth" onclick="document.getElementById('popup${sendfundsrqpopupid}').style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup${sendfundsrqpopupid}')), 201);" style="border-color: red">Cancel</button>
    <p style="margin:0">&emsp;</p>
    <button class="fullwidth" onclick="confirmUpgrade('${what}', '${closeid}', '${sendfundsrqpopupid}')">Confirm</button>
    </div>

    <p style="margin:0">
    `);

    const el = {
        cost: document.getElementById("upgrade_csp")
    };
    var lv;
    var valn;
    var valu;
    switch (what) {
        case "cooling":
            lv = serverdata.mining_upg % 10;
            if (lv >= 9) { document.getElementById('popup' + sendfundsrqpopupid).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + sendfundsrqpopupid)), 201); }
            valn = "Claim Cooldown"; valu = " hours";
            break;
        case "memory":
            lv = Math.floor((serverdata.mining_upg % 100) / 10);
            if (lv >= 9) { document.getElementById('popup' + sendfundsrqpopupid).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + sendfundsrqpopupid)), 201); }
            valn = "Mining Uptime"; valu = " hours";
            break;
        case "hashrate":
            lv = Math.floor((serverdata.mining_upg % 1000) / 100);
            if (lv >= 9) { document.getElementById('popup' + sendfundsrqpopupid).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + sendfundsrqpopupid)), 201); }
            break;
        case "npu1":
            lv = Math.floor((serverdata.mining_upg % 10000) / 1000);
            if (lv >= 9) { document.getElementById('popup' + sendfundsrqpopupid).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + sendfundsrqpopupid)), 201); }
            valn = "Block Win Chance"; valu = "%";
            break;
        case "npu2":
            lv = Math.floor((serverdata.mining_upg % 100000) / 10000);
            if (lv >= 2) { document.getElementById('popup' + sendfundsrqpopupid).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + sendfundsrqpopupid)), 201); }
            valn = "Block Win Bonus"; valu = "%";
            break;
        default:
            lv = -1;
    }
    if ((what !== "hashrate") && (what !== "hashp")) {
        el.left = {
            img: document.getElementById("upg_lefti"),
            name: document.getElementById("upg_leftn"),
            value: document.getElementById("upg_leftv"),
            desc: document.getElementById("upg_leftd"),
        };
        el.right = {
            img: document.getElementById("upg_righti"),
            name: document.getElementById("upg_rightn"),
            value: document.getElementById("upg_rightv"),
            desc: document.getElementById("upg_rightd"),
        };
        el.diff = document.getElementById("upg_diff");
        el.left.img.src = "/site/image/assets/mining/" +UPGRADES[what][lv][4] + ".png";
        el.left.name.innerHTML = UPGRADES[what][lv][0];
        el.left.value.innerHTML = valn+": "+UPGRADES[what][lv][3]+valu;
        el.left.desc.innerHTML = UPGRADES[what][lv][1];
        el.right.img.src = "/site/image/assets/mining/" + UPGRADES[what][lv + 1][4] + ".png";
        el.right.name.innerHTML = UPGRADES[what][lv+1][0];
        el.right.value.innerHTML = UPGRADES[what][lv + 1][3] + valu;
        el.right.desc.innerHTML = UPGRADES[what][lv + 1][1];
        const edf = UPGRADES[what][lv + 1][3] - UPGRADES[what][lv][3];
        el.diff.innerHTML = (edf) > 0 ? "+" + edf : edf;
    } else {
        el.img = document.getElementById("upg_i");
        el.name = document.getElementById("upg_n");
        el.value = document.getElementById("upg_v");
        if (what === "hashrate") {
            el.img.src = "/site/image/assets/mining/" + UPGRADES[what][lv + 1][4] + ".png";
            el.name.innerHTML = UPGRADES[what][lv + 1][0];
            el.value.innerHTML = "+" + UPGRADES[what][lv + 1][3] + " H/s";
        } else {
            el.img.src = "/site/image/assets/mining/hashp.png";
            el.name.innerHTML = "Premium Hashrate";
            el.value.innerHTML = "+" + UPGRADES[what][0][3] + " H/s";
        }
    }
    var costu;
    switch (UPGRADES[what][lv+1][2][1]) {
        case 0:
            costu = "$";
            break;
        case 1:
            costu = "¤";
            break;
        case 2:
            costu = "₿";
            break;
        default:
            costu = "?";
    }
    el.cost.innerHTML = UPGRADES[what][lv+1][2][0] + " " + costu;
}

async function confirmUpgrade(what, closemain, closeside) {
    const status = document.getElementById("upgrade_status");
    const cntrl = document.getElementById("controls");
    controls.classList.add("disabled");
    status.innerHTML = "Please wait...";
    const balance = await getBalance(uid);
    document.getElementById("walletnus").innerHTML = balance[0];
    document.getElementById("walletnoca").innerHTML = balance[1];
    document.getElementById("walletsats").innerHTML = balance[2];
    var lv;
    switch (what) {
        case "cooling":
            lv = serverdata.mining_upg % 10;
            if (lv >= 9) { document.getElementById('popup' + closeside).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + closeside)), 201); }
            break;
        case "memory":
            lv = Math.floor((serverdata.mining_upg % 100) / 10);
            if (lv >= 9) { document.getElementById('popup' + closeside).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + closeside)), 201); }
            break;
        case "hashrate":
            lv = Math.floor((serverdata.mining_upg % 1000) / 100);
            if (lv >= 9) { document.getElementById('popup' + closeside).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + closeside)), 201); }
            break;
        case "npu1":
            lv = Math.floor((serverdata.mining_upg % 10000) / 1000);
            if (lv >= 9) { document.getElementById('popup' + closeside).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + closeside)), 201); }
            break;
        case "npu2":
            lv = Math.floor((serverdata.mining_upg % 100000) / 10000);
            if (lv >= 2) { document.getElementById('popup' + closeside).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + closeside)), 201); }
            break;
        default:
            lv = -1;
    }
    if (balance[UPGRADES[what][lv + 1][2][1]] < UPGRADES[what][lv + 1][2][0]) { status.innerHTML = "Insufficient balance."; controls.classList.remove("disabled"); return }
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/upgradeMining', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({item: what})
    })
        .then(response => response.json())
        .then(async data => {  //0 = success; 10 = error
            if (data.code === 10) {
                status.innerHTML = data.response;
                cntrl.classList.remove("disabled");
            } else if (data.code === 0) {
                popup("Upgraded successfully!", "Upgraded stats should show up shortly. If they take too long, please refresh the page.");
                document.getElementById('popup' + closemain).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + closemain)), 201);
                document.getElementById('popup' + closeside).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + closeside)), 201);
                await initialize_serverdata();
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}

addEventListener("keydown", (e) => {
    if ((e.key === "a" || e.key === "ArrowLeft") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        collapseSide("left");
    }
    if ((e.key === "d" || e.key === "ArrowRight") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        collapseSide("right");
    }
    if ((e.key === "s" || e.key === "ArrowDown") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleAnimations();
    }
});

console.log("nus loaded");