var collStatus = false;
var BONUS;
var smallBonusReq, smallBonusTime;

async function freeMain() {
    const { data: sdata, error: userExistsErrorn } = await sb
        .from("udata")
        .select("daily_last, daily_streak")
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
                popup("Daily rewards claimed!", `<p style="margin:0; text-align:center">You have received:<br>
                ${reward.nus ? reward.nus.toLocaleString('en-US',{useGrouping:false,maximumSignificantDigits: 21}) + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">$</span><br>" : ""}
                ${reward.noca ? reward.noca + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">¤</span><br>" : ""}
                ${reward.sat ? reward.sat.toLocaleString('en-US', { useGrouping: false, maximumSignificantDigits: 21 }) + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">₿</span><br>" : ""}
                ${reward.hash ? "+"+ reward.hash + " H/s<br>" : ""}
                ${reward.div ? "+" + reward.div + " Dividend Power<br>" : ""}
                ${reward.con ? reward.con + " Mining Contract"+(reward.con===1?"":"s")+"<br>" : ""}
                ${/*reward.event.*?reward.event.*+"<span style=\"font-family: 'currencycompnus', Ubuntu !important\">?</span><br>":""*/ ""}
                ${reward.xp ? "+"+reward.xp + " XP<br>" : ""}
                ${data.level ? "You have enough XP to level up!<br><a href='levels.html' class='link'>Level Up Now!</a><br>" : ""}
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

function smallBonus(title, description, bonus) {
    popup(title, `
    ${description}</p><br><p style="margin:0.5em; font-size:0.8em; text-align: center; color: #ccc; text-decoration: underline" id="smallBonusLink" onclick="window.open('${BONUS.bonus[bonus][2]}', '_blank');"></p>
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