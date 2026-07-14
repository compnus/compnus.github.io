var SIDES = 0;
var uid = "";

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

    var finalhashrate = formatNumber(serverdata.hashrate);
    document.getElementById("hashratedspl").innerHTML = finalhashrate[0] + " " + finalhashrate[1] + "H/s";
    document.getElementById("hashrateplain").innerHTML = serverdata.hashrate + "H/s";

    var _npb = await getVariable("nusperblock");
    var _hpb = await getVariable("hashperblock");
    document.getElementById("blockrewarddspl").innerHTML = _npb;
    document.getElementById("blockhashrdspl").innerHTML = _hpb + "H ("+formatNumber(_hpb).join(" ")+"H)";
    document.getElementById("calcresultdspl").innerHTML = ((serverdata.hashrate * 86400 * _npb)/_hpb).toFixed(4);
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
        Reward per Day: ${((serverdata.hashrate * 86400 * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
        Reward per Hour: ${((serverdata.hashrate * 3600 * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
        Reward per Minute: ${((serverdata.hashrate * 60 * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
        Reward per Second: ${((serverdata.hashrate * _npb) / _hpb).toFixed(8)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
        <div class="myhr"></div>
        Reward per Week: ${((serverdata.hashrate * 86400 * 7 * _npb) / _hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
        Reward per Month: ${((serverdata.hashrate * 86400 * 30 * _npb) / _hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
        Reward per Year: ${((serverdata.hashrate * 86400 * 365 * _npb) / _hpb).toFixed(4)} <span style="font-family:'currencycompnus',Ubuntu !important">$</span>
    `);
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
});

console.log("nus loaded");