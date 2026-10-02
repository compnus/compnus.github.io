var collStatus = false;
var BONUS;
var smallBonusReq, smallBonusTime;
var spintokens;

async function freeMain() {
    const { data: sdata, error: userExistsErrorn } = await sb
        .from("udata")
        .select("daily_last, daily_streak, spin_tokens")
        .eq("user_id", uid)
        .single();
    if (!sdata || userExistsErrorn) console.log("Server error.");
    const daily_last = daysBetween(sdata.daily_last);
    document.getElementById("dailygift").classList.remove('disabled');
    if (sdata.daily_last !== null && daily_last !== null && daily_last <= 1) {
        document.getElementById("dailycheckinstreak").innerHTML = sdata.daily_streak;
    }
    if (daily_last !== null && daily_last === 0) {
        document.getElementById("dailygift").classList.add('collectedx');
        document.getElementById("information_kiosk_daily").innerHTML = "Come back tomorrow for another reward!";
    }
    spintokens = sdata.spin_tokens;
    document.getElementById("spintokens").innerHTML = spintokens;
    BONUS = await fetch('../../supabase/functions/_shared/smallBonus.json').then(response=>response.json());
}

function daysBetween(serverDateString) {
    if (!serverDateString) return null;
    const parts = serverDateString.split('-').map(Number);
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    const serverUtc = Date.UTC(y, m - 1, d);
    const now = new Date();
    const localMidnightUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.floor((localMidnightUtc - serverUtc) / 86400000);
}

async function collectDaily() {
    if (collStatus) return;
    collStatus = true;
    var dToll = setTimeout(startLoading, 1500);
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/collectDailyReward', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: ""
    })
        .then(response => response.json())
        .then(async data => {  //5 = success; 10 = error; 1,2 = warning
            clearTimeout(dToll);
            stopLoading();
            if (data.code === 10) {
                document.getElementById("dailygift").classList.remove("collected");
                collStatus = false;
                popup("Error!", data.response);
            } else if (data.code === 1) {
                document.getElementById("dailygift").classList.remove("collected");
                collStatus = false;
                popup("Slow down there!", data.response);
            } else if ((data.code === 2) || (data.code === 5)) {
                document.getElementById("dailycheckinstreak").innerHTML = data.response;
                document.getElementById("dailygift").classList.remove('collected');
                document.getElementById("dailygift").classList.add('collectedx');
                const reward = JSON.parse(data.claimed);
                popup("Daily rewards claimed!", `</p>${parseRewards(reward, data.level)}
                <br>Don't forget to claim again tomorrow!` + (data.code === 2 ? "<br><br>Due to an internal error, your reward will not show up in your transaction history." : ""));
                loadWallet();
            }
        })
        .catch((error) => {
            clearTimeout(dToll);
            console.error('Error invoking function:', error);
            document.getElementById("dailygift").classList.remove("collected");
            popup("An error occurred", "We had issues trying to collect your daily reward. Please try again later.", true, true);
            collStatus = false;
        });
}

function parseRewards(reward, level) {
    return `<p style="margin:0; text-align:center">You have received:<br>
                ${reward.nus ? reward.nus.toLocaleString('en-US', { useGrouping: false, maximumSignificantDigits: 21 }) + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">$</span><br>" : ""}
                ${reward.noca ? reward.noca + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">¤</span><br>" : ""}
                ${reward.sat ? reward.sat.toLocaleString('en-US', { useGrouping: false, maximumSignificantDigits: 21 }) + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">₿</span><br>" : ""}
                ${reward.coin ? reward.coin + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">€</span><br>" : ""}
                ${reward.hash ? "+" + reward.hash + " H/s<br>" : ""}
                ${reward.div ? "+" + reward.div + " Dividend Power<br>" : ""}
                ${reward.spin ? reward.spin + "Spin Token" + (reward.spin === 1 ? "" : "s") + "<br>" : ""}
                ${reward.con ? reward.con + " Mining Contract" + (reward.con === 1 ? "" : "s") + "<br>" : ""}
                ${/*reward.event.*?reward.event.*+"<span style=\"font-family: 'currencycompnus', Ubuntu !important\">?</span><br>":""*/ ""}
                ${reward.xp ? "+" + reward.xp + " XP<br>" : ""}
                ${level ? "You have enough XP to level up!<br><a href='levels.html' class='link'>Level Up Now!</a><br>" : ""}`;
}

function smallBonus(title, description, bonus) {
    popup(title, `
    ${description}</p><p style="margin:1em; font-size:0.8em; text-align: center; color: #ccc; text-decoration: underline; cursor:pointer" id="smallBonusLink" onclick="window.open('${BONUS.bonus[bonus][2]}', '_blank');"></p>
    <button onclick="smallBonusParts('${bonus}', 0);window.open('${BONUS.bonus[bonus][2]}', '_blank');" id="smallBonusBtn" class="fullwidth">LET'S GO!</button>
<p style="margin:0;>
`, true, true);
    var btn = document.getElementById('smallBonusBtn');
    var lnk = document.getElementById('smallBonusLink');
    var bonuses = localStorage.getItem('smallBonus');
    if (bonuses?.includes(bonus + ' ')) {
        btn.innerHTML = "Claimed!";
        btn.classList.add('disabled');
        lnk.innerHTML = "Open Link";
    }
}

async function smallBonusParts(bonus, part) {
    var btn = document.getElementById("smallBonusBtn");
    switch (part) {
        case 0:
            btn.innerHTML = "CLAIM REWARD";
            btn.setAttribute("onclick", `smallBonusParts('${bonus}', 1)`);
            smallBonusReq = BONUS.bonus[bonus][0];
            smallBonusTime = new Date().getTime();
            break;
        case 1:
            if (new Date().getTime() >= smallBonusTime + smallBonusReq * 1000) {
                btn.innerHTML = "...";
                btn.classList.add("disabled");
                startLoading();
                await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/collectSmallBonus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
                    },
                    body: JSON.stringify({bid:bonus})
                })
                    .then(response => response.json())
                    .then(async data => {
                        stopLoading();
                        if (data.sc) {
                            btn.innerHTML = "Claimed!"
                            if (data.claimed) {
                                addLocalBonus(bonus);
                                loadWallet();
                            } else addLocalBonus(data.response, true);
                        } else {
                            btn.classList.remove('disabled');
                            btn.innerHTML = "CLAIM REWARD";
                            popup("An error occurred", data.response);
                        }
                    })
                    .catch((error) => {
                        clearTimeout(dToll);
                        console.error('Error invoking function:', error);
                    });
            } else {
                btn.innerHTML = "LET'S GO!";
                btn.setAttribute("onclick", `smallBonusParts('${bonus}', 0);window.open('${BONUS.bonus[bonus][2]}', '_blank');`);
                smallBonusReq = smallBonusTime = null;
            }
            break;
    }
}

function addLocalBonus(id, sync=false) {
    if (sync) localStorage.setItem('smallBonus', id);
    else localStorage.setItem('smallBonus', localStorage.getItem('smallBonus') + id + ' ');
}

function funtile(id, ...p) {
    let elm;
    elm = document.getElementById("funtile_" + id);
    switch (id) {
        case "color":
            if (p[0] === 0) elm.style.transition = "none";
            let color = random(20);
            elm.style.backgroundColor = "rgba(" + color[0] + " " + color[1] + " " + color[2] + ")"
            if (p[0] === 0) window.setTimeout(() => { elm.style.transition = "0.5s ease-out" }, 1);
            break;
        case "transform":
            elm.style.transform = `scale(${random(0, 0.2, 1, 2)}, ${random(0, 0.2, 1, 2)}) translate(${random(0, -5, 5)}px, ${random(0, -5, 5)}px) skew(${random(0, -30, 30, 2)}deg, ${random(0, -30, 30, 2)}deg) rotate(${random(0, -180, 180, 1)}deg)`;
            break;
    }
}

async function spinWheel() {
    const wheel = document.getElementById("spinawinm");
    if (wheel.style.pointerEvents === "none") return;
    if (spintokens < 1) {
        popup("You have no Spin Tokens!", "You need Spin Tokens to spin the wheel! Earn more from daily rewards or by leveling up! You can also look for them elsewhere. Maybe you will find something!", true, true);
        return;
    }
    document.getElementById("spintokens").innerHTML = --spintokens;
    wheel.style.pointerEvents = "none";
    if (wheel.style.rotate !== "0deg") {
        wheel.style.rotate = Number(wheel.style.rotate.substring(0, wheel.style.rotate.length - 3))%360 + "deg";
        wheel.style.transition = "0.3s ease-out transform, .2s ease-out rotate";
        wheel.style.rotate = "0deg";
        await new Promise(resolve => setTimeout(resolve, 200));
    };
    var spinning = false;
    var spingoal = 0;
    var reward = null;
    function sspin() {
        if (spinning) {
            wheel.style.rotate = Number(wheel.style.rotate.substring(0, wheel.style.rotate.length - 3)) + 360 + "deg";
            window.setTimeout(sspin, 500);
        } else {
            wheel.style.transition = "0.3s ease-out transform, 3s cubic-bezier(0, 1, 0.7, 1.02) rotate";
            wheel.style.rotate = Number(wheel.style.rotate.substring(0, wheel.style.rotate.length - 3)) + 360 + spingoal + "deg";
            window.setTimeout(() => {
                wheel.style.transition = "0.3s ease-out transform";
                wheel.style.pointerEvents = "auto";
                if (reward) {
                    popup("Congratulations!", `${parseRewards(reward, data.level)} <br>Spin again once you feel lucky!`, true, true)
                }
            }, 3000);
        }
    }
    wheel.style.transition = "0.3s ease-out transform, 1s cubic-bezier(0.3,-0.75, 1, 0.8) rotate";
    wheel.style.rotate = "360deg";
    window.setTimeout(async () => {
        wheel.style.transition = "0.3s ease-out transform, 0.5s linear rotate";
        spinning = true;
        sspin();
        await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/spinAWheel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
            }
        })
            .then(response => response.json())
            .then(async data => {
                spingoal = data.rot;
                spinning = false;
                if (data.sc) {
                    reward = JSON.parse(data.response);
                } else {
                    popup("An error occurred", data.response);
                    wheel.style.pointerEvents = "auto";
                    wheel.style.transition = "0.3s ease-out transform";
                    document.getElementById("spintokens").innerHTML = ++spintokens;
                }
            })
            .catch((error) => {
                spinning = false;
                console.error('Error invoking function:', error);
            });
    }, 1000);
}

const SRFORMAT = {
    // [0:name, 1:prepend, 2:append, 3:imagetype (0=img, 1=text, 2=none), 4?:imageparam]
    noca: ["Nocas", "", "", 0, "../../site/image/logo/noca.svg"],
    sat: ["Bitcoin Satoshis", "", "", 0, "../../site/image/logo/sats.svg"],
    nus: ["$NUS", "", "", 0, "../../site/image/logo/currency.svg"],
    coin: ["Marks", "", "", 0, "../../site/image/logo/coins.svg"],
    spin: ["Spin Tokens", "", "", 0, "https://img.icons8.com/?size=100&id=bUrGLkai6eS8&format=png&color=FFFFFF"],
    xp: ["XP", "+", "", 1, "XP"],
    div: ["Dividend Power", "+ ", " Dividend Power", 2],
    hash: ["Hashrate", "+", "H/s", 0, "../../site/image/assets/mining/hash0.png"],
    cont: ["Mining Contract", "", "", 0, "../../site/image/assets/mining/cooling1.png"],
};

function getSpinElement(type, amount) {
    const elm = document.createElement("div");
    elm.classList.add("spinawin_re");
    const f = SRFORMAT[type];
    elm.title = f[0];
    switch (f[3]) {
        case 0:
            const img = document.createElement("img");
            img.src = f[4];
            elm.appendChild(img);
            break;
        case 1:
            const text = document.createElement("h6");
            text.innerHTML = f[4];
            elm.appendChild(text);
            break;
    }
    const amt = document.createElement("p");
    if (type === "cont") {
        amt.innerHTML = amount.name + " (" + formatNumber(amount.hash).join("") + "H/s for " + amount.dur + " minutes)"
    } else amt.innerHTML = f[1] + (
        typeof amount === "number" ?
            amount :
            amount.split("-").slice(0,2).join("<span>-</span>")
    ) + f[2];
    elm.appendChild(amt);
    return elm;
}

function addSpinReward(container_id, bg_id, entry) {
    const container = document.getElementById(container_id);
    const elm = document.createElement("div");
    elm.classList.add("spinawin_entry");
    const name = document.createElement("h1");
    name.innerHTML = entry[0];
    elm.appendChild(name);
    if (entry[1].length === 1) {
        const loot = document.createElement("div");
        loot.classList.add("spinawin_unit", "spinawin_single");
        const looti = document.createElement("div");
        looti.classList.add("spinawin_table");
        for (var i in entry[1][0][1]) looti.appendChild(getSpinElement(i, entry[1][0][1][i]));
        loot.appendChild(looti);
        elm.appendChild(loot);
    } else {
        for (var i of entry[1]) {
            const loot = document.createElement("div");
            loot.classList.add("spinawin_unit");
            const lootb = document.createElement("h1");
            lootb.innerHTML = i[0] + "%";
            lootb.title = "Chance";
            const looti = document.createElement("div");
            looti.classList.add("spinawin_table");
            for (var j in i[1]) looti.appendChild(getSpinElement(j, i[1][j]));
            loot.appendChild(lootb);
            loot.appendChild(looti);
            elm.appendChild(loot);
        }
    }
    elm.classList.add("spinawin_bg" + bg_id);
    container.appendChild(elm);
}

async function getSpinRewards() {
    startLoading();
    try {
        var SR = await fetch('../../supabase/functions/_shared/spinawin.json').then(response => response.json());
    } catch {
        stopLoading();
        popup("An Error Occurred", "We could not access the current loot table roster. Please try again later.");
        return;
    }
    stopLoading();
    popup(
        "Current Spin and Win Rewards",
        `
            <h1 class="spinawinroster">Common</h1>
            <h2 class="spinawinroster">Rewards with white background</h2>
            <div class="spinawin_loot" id="saw_common"></div>
            <br>
            <h1 class="spinawinroster">Uncommon</h1>
            <h2 class="spinawinroster">Rewards with reddish chino background</h2>
            <div class="spinawin_loot" id="saw_uncommon"></div>
            <br>
            <h1 class="spinawinroster">Rare</h1>
            <h2 class="spinawinroster">Rewards with bluish purple background</h2>
            <div class="spinawin_loot" id="saw_rare"></div>
            <br>
            <h1 class="spinawinroster">Legendary</h1>
            <h2 class="spinawinroster">Reward with golden background</h2>
            <div class="spinawin_loot" id="saw_legendary"></div>

<p style='margin:0'>`,
        true, true
    );
    for (var i = 0; i < 6; i++) addSpinReward("saw_common", 0, SR.win[i]);
    for (var i = 6; i < 9; i++) addSpinReward("saw_uncommon", 1, SR.win[i]);
    for (var i = 9; i < 11; i++) addSpinReward("saw_rare", 2, SR.win[i]);
    addSpinReward("saw_legendary", 3, SR.win[11]);
}