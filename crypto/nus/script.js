var SIDES = 0;
var uid = "";
var animations = true;
var serverdata = null;
var mobileopen = false;
var interval = null;
var cache = {};

async function main() {
    const { user, data } = await getUser();
    //if (!user) window.location.href = "/u/login.html";
    uid = data.id;

    const balance = await getBalance(uid);
    document.getElementById("walletnus").innerHTML = balance[0];
    document.getElementById("walletnoca").innerHTML = balance[1];
    document.getElementById("walletsats").innerHTML = balance[2];

    const { data: serverdatac, error: userExistsErrorn } = await sb
        .from("udata")
        .select("hashrate, last_claimed, mining_upg")
        .eq("user_id", uid)
        .single();
    if (!serverdatac || userExistsErrorn) console.log("Server error.");
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
    switch (serverdata.mining_upg % 10) {
        case 0:
            document.getElementById("mstat_cool").innerHTML = "24 hours";
            break;
        case 1:
            document.getElementById("mstat_cool").innerHTML = "22 hours";
            break;
        case 2:
            document.getElementById("mstat_cool").innerHTML = "20 hours";
            break;
        case 3:
            document.getElementById("mstat_cool").innerHTML = "18 hours";
            break;
        case 4:
            document.getElementById("mstat_cool").innerHTML = "16 hours";
            break;
        case 5:
            document.getElementById("mstat_cool").innerHTML = "14 hours";
            break;
        case 6:
            document.getElementById("mstat_cool").innerHTML = "12 hours";
            break;
        case 7:
            document.getElementById("mstat_cool").innerHTML = "10 hours";
            break;
        case 8:
            document.getElementById("mstat_cool").innerHTML = "8 hours";
            break;
        case 9:
            document.getElementById("mstat_cool").innerHTML = "6 hours";
            break;
    }

    interval = setInterval(calculateProfit, 1000);
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
        document.getElementById("collapsemobile").style.right = "0";
        mobileopen = false;
        if (syncHistory && history.state && history.state.mobileSidebar) {
            history.back();
        }
    } else {
        document.getElementById("rightsd").style.width = "85vw";
        document.getElementById("collapsemobile").style.right = "85vw";
        if (syncHistory) history.pushState({ mobileSidebar: true }, '');
        mobileopen = true;
    }
}

window.addEventListener('popstate', function (e) {
    if (window.innerWidth <= 800 && mobileopen) {
        collapseSideMobile(false);
    }
});

async function loadApproximations() {
    const { data: serverdata, error: userExistsErrorn } = await sb
        .from("udata")
        .select("hashrate")
        .eq("user_id", uid)
        .single();
    if (!serverdata || userExistsErrorn) popup("An error occurred!", "We were unable to load your data.<br>Make sure you are logged in and that your internet connection is sufficient.");
    var _npb = await getVariable("nusperblock");
    var _hpb = await getVariable("hashperblock");
    popup("Approximate Rewards", `
        Reward per Day: ${((serverdata.hashrate * 86400 * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Hour: ${((serverdata.hashrate * 3600 * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Minute: ${((serverdata.hashrate * 60 * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Second: ${((serverdata.hashrate * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span></p>
        <div class="myhr"></div><p style="margin-bottom:0">
        Reward per Week: ${((serverdata.hashrate * 86400 * 7 * _npb) / _hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Month: ${((serverdata.hashrate * 86400 * 30 * _npb) / _hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span><br>
        Reward per Year: ${((serverdata.hashrate * 86400 * 365 * _npb) / _hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
    `);
}

async function hashrateCalc() {
    var _npb = await getVariable("nusperblock");
    var _hpb = await getVariable("hashperblock");
    popup("Hashrate Calculator",
        `</p>
        <div class="input">
            <label for="hinput">Hashrate:</label>
            <input id="hinput" oninput="this.value=Math.floor(this.value); if (this.value < 0) this.value = 0; handleHashCalc(this.value, ${_npb}, ${_hpb});" placeholder="H/s" type="number">
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

    var mintime;
    var maxtime;
    switch (serverdata.mining_upg % 10) {
        case 0:
            mintime = 24*60*60;
            break;
        case 1:
            mintime = 22*60*60;
            break;
        case 2:
            mintime = 20*60*60;
            break;
        case 3:
            mintime = 18*60*60;
            break;
        case 4:
            mintime = 16*60*60;
            break;
        case 5:
            mintime = 14*60*60;
            break;
        case 6:
            mintime = 12*60*60;
            break;
        case 7:
            mintime = 10*60*60;
            break;
        case 8:
            mintime = 8*60*60;
            break;
        case 9:
            mintime = 6*60*60;
            break;
    }
    switch (Math.floor((serverdata.mining_upg % 100) / 10)) {
        case 0: maxtime = 48*60*60; break;
        case 1: maxtime = 60 *60*60; break;
        case 2: maxtime = 72 * 60*60; break;
        case 3: maxtime = 84 * 60 *60; break;
        case 4: maxtime = 96 * 60 * 60; break;
        case 5: maxtime = 108 * 60 * 60; break;
        case 6: maxtime = 120 * 60 *60; break;
        case 7: maxtime = 132 * 60*60; break;
        case 8: maxtime = 144 *60*60; break;
        case 9: maxtime = 168*60*60; break;
    }

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

const levelstat = {
    cooling: [
        {"name":"No Cooling", "description": "No cooling is provided. Relies on natural heat dissipation. Extremely inefficient.", "cost": [], "val": 24, "img": "cooling0.png"},
        {"name":"Single Fan", "description": "Good luck cooling a mining setup with a single fan! Better than nothing, though.", "cost": [100,1], "val": 22, "img": "cooling1.png"},
        {"name":"Embedded Fan", "description": "Better than a lone fan, but still lone. And very much a fan.", "cost": [225,1], "val": 20, "img": "cooling2.png"},
        {"name":"Dual Fan", "description": "Oh look! It now has a friend! And friendship is power!", "cost": [375,1], "val": 18, "img": "cooling3.png"},
        {"name":"Small Fan Array", "description": "In unity there is power! What two couldn't do, four will do with ease!", "cost": [600,1], "val": 14, "img": "cooling5.png"},
        {"name":"Huge Fan Array", "description": "There it is. The absolute masterpiece when it comes to air cooling. I wonder what comes next?", "cost": [950,1], "val": 12, "img": "cooling6.png"},
        {"name":"Water Line", "description": "When air is insufficient, water cooling takes over! But is there more?", "cost": [1500,1], "val": 10, "img": "cooling7.png"},
        {"name":"Dual Water Line", "description": "Double the power with ease! Fresh water will take care of the rest!", "cost": [3250,1], "val": 8, "img": "cooling8.png"},
        {"name":"Liquid Nitrogen", "description": "Finally, the absolute <i>chill</i>.", "cost": [7000,1], "val": 6, "img": "cooling9.png"}
    ],
    memory: [
        {"name": "Uni Chip", "description": "It's a miracle it can even hold two days of data to be honest.", "cost": [], "val": 48, "img": "memory0.png"},
        {"name": "Rewired Uni Chip", "description": "Slightly better, but still running on hopes and dreams.", "cost": [250,1], "val": 60, "img": "memory1.png"},
        {"name": "Tri Chip", "description": "With more wires to store data, and also efficient to use less electricity!", "cost": [480,1], "val": 72, "img": "memory2.png"},
        {"name": "Hexa Chip", "description": "More connectors means higher efficiency!", "cost": [760,1], "val": 84, "img": "memory3.png"},
        {"name": "Chipless DD Core", "description": "Now we are talking! Even more connectors and a core for performance!", "cost": [1350,1], "val": 96, "img": "memory4.png"},
        {"name": "NUS DD Core", "description": "With this premium chip, the efficiency is skyrocketing! But you can push it further!", "cost": [2100,1], "val": 108, "img": "memory5.png"},
        {"name": "VQD Core", "description": "Outside-going chips waste power. With this integrated chip core, you reach the pinnacle of efficiency!", "cost": [4350,1], "val": 120, "img": "memory6.png"},
        {"name": "Rewired VQD Core", "description": "Rewired with better performance algorithms!", "cost": [7500,1], "val": 132, "img": "memory7.png"},
        {"name": "Multi-Core", "description": "Why bother with a single core when you can have all of them?", "cost": [12000,1], "val": 144, "img": "memory8.png"},
        {"name": "Glided Multi-Core", "description": "Now that all cores are connected, you have reached the <b>absolute</b>!", "cost": [20000,1], "val": 168, "img": "memory9.png"}
    ],
    hashrate: [
        { "name": "Base Hashrate", "cost": [], "val": 100, "img": "hash0.png" },
        { "name": "Extra Hashrate I", "cost": [50, 1], "val": 80, "img": "hash0.png" },
        { "name": "Extra Hashrate II", "cost": [110, 1], "val": 90, "img": "hash0.png" },
        { "name": "Extra Hashrate III", "cost": [165, 1], "val": 100, "img": "hash1.png" },
        { "name": "Extra Hashrate IV", "cost": [225, 1], "val": 110, "img": "hash1.png" },
        { "name": "Extra Hashrate V", "cost": [300, 1], "val": 120, "img": "hash1.png" },
        { "name": "Hashrate+ I", "cost": [500, 1], "val": 150, "img": "hash2.png" },
        { "name": "Hashrate+ II", "cost": [735, 1], "val": 175, "img": "hash2.png" },
        { "name": "Hashrate+ III", "cost": [1100, 1], "val": 200, "img": "hash2.png" },
        { "name": "HashrateX", "cost": [2000, 1], "val": 375, "img": "hash3.png" }
    ],
    npu1: [
        {"name": "No Supply", "description": "No supply means no power and no power means no optimal numbers. So no block winning for you!", "cost": [], "val": 0, "img": "npu10.png"},
        {"name": "XS Supply", "description": "Miniature supply that does the job! Not well, but does it. It uhhh does the job.", "cost": [250,1], "val": 1, "img": "npu11.png"},
        {"name": "S Supply", "description": "Slightly bigger supply that allows for twice the power! Still very weak, though.", "cost": [350,1], "val": 2, "img": "npu12.png"},
        {"name": "M Supply", "description": "We are reaching the basis of power, finally! More than thrice the power than the little one!", "cost": [480,1], "val": 3.1, "img": "npu13.png"},
        {"name": "L Supply", "description": "Now this one is doing the job! And you could also say it's doing it well!", "cost": [800,1], "val": 4.2, "img": "npu14.png"},
        {"name": "XL Supply", "description": "Did you say well? Well, this one does it really well! Well! Uhhhh i forgot where my well is.", "cost": [1200,1], "val": 5.32, "img": "npu15.png"},
        {"name": "XXL Supply", "description": "When 'really well' is insufficient, very well is the way to go! Extra very well, actually!", "cost": [1750,1], "val": 6.45, "img": "npu16.png"},
        {"name": "Dual Supply", "description": "With a backup, you can guarantee it will not stop running! Lucky numbers, here we go!", "cost": [2450,1], "val": 7.6, "img": "npu17.png"},
        {"name": "Mega Supply", "description": "Integrated backup means less travel time and therefore more efficient number generation!", "cost": [3300,1], "val": 8.75, "img": "npu18.png"},
        {"name": "Reactor", "description": "Why ask for power when you can make your own? <u>No one beats this one!</u>", "cost": [5000,1], "val": 10, "img": "npu19.png"}
    ],
    npu2: [
        {"name": "Base Power", "description": "Look, it's 10% extra. That's better than nothing, isn't it?", "cost": [], "val": 10, "img": "npu20.png"},
        {"name": "Extra Power", "description": "Comes at a price, but will pay for itself in the long run!", "cost": [0.4, 0], "val": 17, "img": "npu21.png"},
        {"name": "Hyper Power", "description": "Why waste your luck when the reward is little? With <u><b><i>this one</i></b></u>, you can rest assure none of your luck will be wasted!", "cost": [1, 0], "val": 25, "img": "npu22.png"}
    ]
}

function openUpgrades() {
    popup("Mining Upgrades", `
    <div id="upgrades_main">

    <div class="upgrade_item">
        <div><h1>Cooling</h1><h2 onclick="popup('Cooling', 'The faster your mining machine can cool down, the more often you can claim your mining rewards! Upgrade cooling to decrease claim cooldown.',true,true)">?</h2></div>
        <img id="coolingi" src="/site/image/assets/mining/cooling0.png">
        <h1 id="coolingn">No Cooling</h1>
        <h2>Claim Cooldown: <span id="coolingv">24</span> hours</h2>
        <p id="coolingd">Loading...</p>
        <button id="coolingb" class="disabled" onclick="upgrade('cooling')">Upgrade</button>
    </div>
    <div class="upgrade_item">
        <div><h1>Memory</h1><h2 onclick="popup('Memory', 'Better memory allows your mining machine to hold more tokens! Upgrade memory to increase mining uptime.',true,true)">?</h2></div>
        <img id="memoryi" src="/site/image/assets/mining/memory0.png">
        <h1 id="memoryn">Uni Chip</h1>
        <h2>Mining Uptime: <span id="memoryv">48</span> hours</h2>
        <p id="memoryd">Loading...</p>
        <button id="memoryb" class="disabled" onclick="upgrade('memory')">Upgrade</button>
    </div>
    <div class="upgrade_item">
        <div><h1>Hashrate</h1><h2 onclick="popup('Hashrate', 'You can purchase more hashrate for Nocas here. In order to increase your hashrate further, explore further. Further beyond. Maybe you will find something?',true,true)">?</h2></div>
        <img id="hashratei" src="/site/image/assets/mining/hash0.png">
        <h1 id="hashraten">Base Hashrate</h1>
        <p>You can only receive hashrate this way 10 times in total. The initial 100H/s rewarded for creating your account counts to this limit.</p>
        <button id="hashrateb" class="disabled" onclick="upgrade('hashrate')">Upgrade</button>
    </div>
    <div class="upgrade_item">
        <div><h1>NPU Supply</h1><h2 onclick="popup('NPU Supply', 'Number Processing Unit supply increases the odds of generating numbers that are more likely to mine the block! Upgrade NPU supply to increase your chance of winning a block.',true,true)">?</h2></div>
        <img id="npu1i" src="/site/image/assets/mining/npu10.png">
        <h1 id="npu1n">No Supply</h1>
        <h2>Block Win Chance: <span id="npu1v">0</span>%</h2>
        <p id="npu1d">Loading...</p>
        <button id="npu1b" class="disabled" onclick="upgrade('npu1')">Coming Soon</button>
    </div>
    <div class="upgrade_item">
        <div><h1>NPU Power</h1><h2 onclick="popup('NPU Power', 'Number Processing Unit power increases the accuracy of the generated numbers, making winning blocks more rewarding! Upgrade NPU power to increase the amount of tokens you win from a block.',true,true)">?</h2></div>
        <img id="npu2i" src="/site/image/assets/mining/npu20.png">
        <h1 id="npu2n">Base Power</h1>
        <h2>Block Win Bonus: <span id="npu2v">10</span>%</h2>
        <p id="npu2d">Loading...</p>
        <button id="npu2b" class="disabled" onclick="upgrade('npu2')">Coming Soon</button>
    </div>
    <div class="upgrade_item">
        <div><h1>Hashrate</h1><h2 onclick="popup('Hashrate', 'You can purchase more hashrate for Satoshis here.',true,true)">?</h2></div>
        <img id="hashpi" src="/site/image/assets/mining/hashp.png">
        <h1 id="hashpn">Premium Hashrate</h1>
        <p id="hashpd">Invest your earned Satoshis into hashrate and boost your mining power! There is no purchase limit for now.</p>
        <button id="hashpb" onclick="upgrade('hashp')">Purchase</button>
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
        cooling: levelstat.cooling[lv.cooling],
        memory: levelstat.memory[lv.memory],
        hashrate: levelstat.hashrate[lv.hashrate],
        npu1: levelstat.npu1[lv.npu1],
        npu2: levelstat.npu2[lv.npu2]
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
    el.cooling.img = "/site/image/assets/mining/"+rig.cooling.img;
    el.cooling.name.innerHTML = rig.cooling.name;
    el.cooling.value.innerHTML = rig.cooling.val;
    el.cooling.desc.innerHTML = rig.cooling.desc;
    el.memory.img = "/site/image/assets/mining/"+rig.memory.img;
    el.memory.name.innerHTML = rig.memory.name;
    el.memory.value.innerHTML = rig.memory.val;
    el.memory.desc.innerHTML = rig.memory.desc;
    el.hashrate.img = "/site/image/assets/mining/"+rig.hashrate.img;
    el.hashrate.name.innerHTML = rig.hashrate.name;
    el.npu1.img = "/site/image/assets/mining/"+rig.npu1.img;
    el.npu1.name.innerHTML = rig.npu1.name;
    el.npu1.value.innerHTML = rig.npu1.val;
    el.npu1.desc.innerHTML = rig.npu1.desc;
    el.npu2.img = "/site/image/assets/mining/"+rig.npu2.img;
    el.npu2.name.innerHTML = rig.npu2.name;
    el.npu2.value.innerHTML = rig.npu2.val;
    el.npu2.desc.innerHTML = rig.npu2.desc;
}

async function upgrade(what) {

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