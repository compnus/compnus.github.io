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
        .then(async data => {
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
                console.log(response);
                popup("Mining rewards claimed!", `You have received ${response.reward} $NUS!<br>You may claim again once the timer expires.` + (data.code === 2 ? "<br><br>Due to an internal error, your claim will not show up in your transaction history." : ""));
                const balance = await getBalance(uid);
                document.getElementById("walletnus").innerHTML = balance[0];
                document.getElementById("walletnoca").innerHTML = balance[1];
                document.getElementById("walletsats").innerHTML = balance[2];
                serverdata.last_claimed = response.last_claimed;
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
            bt.innerHTML = "Please try again.";
            bt.classList.remove("disabled");
        });
    interval = setInterval(calculateProfit, 1000);
}

async function openUpgrades() {

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