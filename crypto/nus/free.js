var collStatus = false;

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
                ${reward.nus ? reward.nus + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">$</span><br>" : ""}
                ${reward.noca ? reward.noca + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">¤</span><br>" : ""}
                ${reward.sat ? reward.sat + " <span style=\"font-family: 'currencycompnus', Ubuntu !important\">₿</span><br>" : ""}
                ${reward.hash ? "+"+ reward.hash + " H/s<br>" : ""}
                ${reward.div ? "+"+reward.div + " Dividend Power<br>" : ""}
                <br>Dont't forget to claim again tomorrow!` + (data.code === 2 ? "<br><br>Due to an internal error, your reward will not show up in your transaction history." : ""));
                loadWallet();
            }
        })
        .catch((error) => {
            clearTimeout(dToll);
            stopLoading();
            console.error('Error invoking function:', error);
            document.getElementById("dailygift").classList.remove("collected");
            popup("An error occurred", "We had issues trying to collect your daily reward. Please try again later.", true, true);
            collStatus = false;
        });
}