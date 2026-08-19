var collStatus = false;

async function freeMain() {
    const { data: sdata, error: userExistsErrorn } = await sb
        .from("udata")
        .select("daily_last, daily_streak")
        .eq("user_id", uid)
        .single();
    if (!sdata || userExistsErrorn) console.log("Server error.");
    const daily_last = daysBetween(sdata.daily_last);
    if (sdata.daily_last !== null && daily_last !== null && daily_last <= 1) {
        document.getElementById("dailycheckinstreak").innerHTML = sdata.daily_streak;
    }
    if (daily_last && daily_last == 0) {
        document.getElementById("dailygift").classList.add('collected');
        document.getElementById("information_kiosk_daily").innerHTML = "Come back tomorrow for another reward!";
    }
}

function daysBetween(serverDateString) {
    if (!serverDateString) return null;
    const parts = serverDateString.split('-').map(Number);
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    const serverUtc = Date.UTC(y, m - 1, d);
    const now = new Date();
    const localMidnightUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor((localMidnightUtc - serverUtc) / 86400000);
}

async function collectDaily() {
    if (collStatus) return;
    collStatus = true;
    var pToll = null;
    var dToll = setTimeout(() => { pToll = popup('', '<div class="flex cc" style="flex-direction:column"><img src="../../site/image/assets/loading.gif" style="filter:invert(1);mix-blend-mode:color-dodge;"><br><p style="margin:0">Please wait...</p></div><p style="margin:0">', false, true, false) }, 2000);
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/collectDailyReward', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: ""
    })
        .then(response => response.json())
        .then(async data => {  //0,5 = success; 10 = error; 1,2 = warning
            clearTimeout(dToll);
            if (pToll !== null) { document.getElementById(pToll).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById(pToll)), 201); pToll = null; }
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
            clearTimeout(dToll);
            if (pToll !== null) { document.getElementById(pToll).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById(pToll)), 201); }
            console.error('Error invoking function:', error);
            document.getElementById("dailygift").classList.remove("collected");
            popup("An error occurred", "We had issues trying to collect your daily reward. Please try again later.", true, true);
            collStatus = false;
        });
}