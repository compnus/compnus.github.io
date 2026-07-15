var SIDES = 0;
var uid = "";
var animations = true;

async function main() {
    const { user, data } = await getUser();
    //if (!user) window.location.href = "/u/login.html";
    uid = data.id;

    const balance = await getBalance(uid);
    document.getElementById("walletnus").innerHTML = balance[0];
    document.getElementById("walletnoca").innerHTML = balance[1];
    document.getElementById("walletsats").innerHTML = balance[2];

    const { data: serverdata, error: userExistsErrorn } = await sb
        .from("udata")
        .select("hashrate")
        .eq("user_id", uid)
        .single();
    if (!serverdata || userExistsErrorn) console.log("Server error.");

    document.getElementById("hashratedspl").innerHTML = formatNumber(serverdata.hashrate).join(" ") + "H/s";
    document.getElementById("hashrateplain").innerHTML = serverdata.hashrate + "H/s";

    var _npb = await getVariable("nusperblock");
    var _hpb = await getVariable("hashperblock");
    document.getElementById("blockrewarddspl").innerHTML = _npb;
    document.getElementById("blockhashrdspl").innerHTML = _hpb + "H ("+formatNumber(_hpb).join(" ")+"H)";
    document.getElementById("calcresultdspl").innerHTML = ((serverdata.hashrate * 86400 * _npb) / _hpb).toFixed(4);
    conterw.setNumber(0), conterp.setNumber(0);
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