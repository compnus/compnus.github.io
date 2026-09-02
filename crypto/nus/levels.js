var uid = "";
var serverdata;
var LEVELS;
var __shadowl = 0;

async function main() {
    const { user, data } = await getUser();
    //if (!user) window.location.href = "/u/login.html";
    uid = data.id;
    await loadData();
    if (LEVELS) loadLevels();
    else document.getElementById('levelpage1').innerHTML = "<h2>We had problems accessing information about levels. Please try refreshing the page. If the issue persists, please contact the support.</h2>"
    if (document.getElementById('levelpage1').style.display === 'flex') {
        const cell = document.querySelector(`.tl${serverdata.level}`);
        cell.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }
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
    document.getElementById('exp_current').innerHTML = maxxp === -1 ? "Max Level" : Math.min(serverdata.exp,maxxp);
    document.getElementById('exp_needed').innerHTML = maxxp===-1?"-":formatNumber(maxxp).join("");
    document.getElementById('levelnumber').innerHTML = serverdata.level;
    document.getElementById('levelicon').classList.add('llevel' + serverdata.level);
    document.getElementById('levelicon').src = "../../site/image/assets/level/lv"+serverdata.level+".png";
    if (maxxp === -1) {
        var lss = document.querySelectorAll(".sp4x");
        for (let l of lss) l.style.display = 'none';
        document.getElementById('progressbar').style.display = 'none';
        document.getElementById('levelinfo').style.display = 'none';
        document.getElementById('level_up').innerHTML = 'MAX LEVEL';
        document.getElementById('information').innerHTML = "Stay tuned for more levels!"
    } else {
        var completion = Math.min(1, serverdata.exp / maxxp);
        document.getElementById('exp_remain').innerHTML = maxxp - serverdata.exp;
        if (completion >= 0.015) document.getElementById('progress').style.width = completion * 100 + "%";
        if (serverdata.exp >= maxxp) {
            document.getElementById('levelinfo').innerHTML = "You can level up by pressing the button below!";
            document.getElementById('level_up').classList.remove('disabled');
        }
    }
}

function loadLevels() {
    var _perks = LEVELS.perks;
    var _total = _perks.length;
    for (let i = 0; i < _total; i++) document.getElementById("texp" + i).innerHTML = _perks[i][0];
    document.getElementById("texp0").innerHTML = "<span style='opacity: 0.6'>-</span>";
    for (let i = 0; i < _total; i++) document.getElementById("txpm" + i).innerHTML = "x " + (_perks[i][1] / 100).toFixed(2);
    document.getElementById("txpm10").innerHTML = "<span style='opacity: 0.6'>x 0</span>";
    for (let i = 0; i < _total; i++) document.getElementById("tmup" + i).innerHTML = _perks[i][2] === 0 ? "<span style='opacity: 0.6'>-</span>" : _perks[i][2] + " hours";
    for (let i = 0; i < _total; i++) document.getElementById("tcon" + i).innerHTML = _perks[i][3];
    for (let i = 0; i < _total; i++) {
        var rews = _perks[i][4];
        var elms = 0;
        for (let j in rews) {
            elms++;
            var x = document.createElement("div");
            x.classList.add("levelReward");
            var y; var z;
            switch (j) {
                case "nus": y = "$"; z = rews[j]; break;
                case "noca": y = "¤"; z = rews[j]; break;
                case "sat": y = "₿"; z = rews[j]; break;
                case "div": y = "+"; z = rews[j] + " Dividend Power"; break;
                default: y = ""; z = "Something went wrong.";
            }
            x.innerHTML = `<span style="font-family: 'currencycompnus', Ubuntu !important;">${y}</span> ${z}`
            document.getElementById("trew" + i).appendChild(x);
        }
        if (elms === 0) document.getElementById("trew" + i).innerHTML = "<span style='opacity: 0.6'>-</span>";
    }
    var currlv = document.querySelectorAll(".tl" + serverdata.level);
    for (let i of currlv) i.classList.add("current");
}

function levelPage(turn) {
    var pages = document.querySelectorAll('.levelpage');
    for (let p of pages) p.style.display = 'none';
    var sels = document.querySelectorAll('.lpselector');
    for (let p of sels) p.classList.remove('here');
    document.getElementById('levelpage' + turn).style.display = 'flex';
    document.getElementById('selector' + turn).classList.add('here');
    if (turn === 1 && serverdata?.level) {
        const cell = document.querySelector(`.tl${serverdata.level}`);
        cell.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }
}

async function levelUp() {
    if (__shadowl <= 7) startLoading();
    if (serverdata.balance_noca < 10) {
        stopLoading();
        popup("Not Enough Nocas!", "You need 10 Nocas to level up!<br>Get Nocas for free <a class='link' href='free.html'>here</a> or head over to your <a class='link' href='../../u/wallet.html'>wallet</a> and get Nocas by exchanging them for $NUS or Bitcoin Satoshi.", true, true);
        return;
    }
    if (serverdata.level >= 10) {
        if (__shadowl<7)stopLoading();
        switch (__shadowl) {
            case 0:
                popup("Why?", "You are on the max level already.");
                break;
            case 1:
                popup("...", "Alright we get it, you can use the browser console. Have fun.");
                break;
            case 2:
                popup("...", "Seriously what are you trying to achieve?");
                break;
            case 3:
                popup("", "I mean, have fun.");
                break;
            case 4:
                popup("", "Actually, good luck with this one.", false);
                break;
            case 5:
                popup("", "Did I even tell you to close these in the first place? No I didn't. Did I?", false);
                break;
            case 6:
                popup("", "I have a better idea.", false);
                break;
            case 7:
                break;
            case 8:
                popup("", loadingid?"It do be loading. Be patient. It might end. Someday.":"Okay yea you know how the console works. Great.", false);
                break;
            case 9:
                popup("", loadingid?":D":"Henceforth I'm too bored to continue writing these.", false);
                break;
            case 10:
                popup("", loadingid ? "Bro ditch the loading popup it's annoying." : "Still, was fun to add something pointless like this.", false);
                break;
            default:
                popup("", ":D", false);
                break;
        }
        __shadowl++;
        return;
    }
    if (serverdata.exp < LEVELS.perks[serverdata.level + 1][0]) {
        stopLoading();
        popup("Not enough XP!", "It would be ideal if you stayed on the 'common user' side of this website to prevent issues like this one. Not trying to be offensive, just afraid something will break catastrophically.", true, true);
        return;
    }
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/levelUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: ""
    })
        .then(response => response.json())
        .then(async data => {
            stopLoading();
            if (data.response) popup("An error occurred", data.response);
            else {
                popup("Congratulations!", "You have successfully leveled up! Rewards for reaching the level have been added to your balance. Enjoy your new perks!", true, true);
                document.getElementById("levelinfo").innerHTML = `You need <span id="exp_remain">${serverdata.level < 9 ? LEVELS.perks[serverdata.level + 2][0] : "0"}</span> more XP to level up.`;
                document.getElementById("progress").style.width = "1.5%";
                var currlv = document.querySelectorAll(".current");
                for (let i of currlv) i.classList.remove("current");
                await loadData();
                loadLevels();
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}