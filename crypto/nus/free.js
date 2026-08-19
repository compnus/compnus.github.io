async function freeMain() {
    const { data: sdata, error: userExistsErrorn } = await sb
        .from("udata")
        .select("daily_last, daily_streak")
        .eq("user_id", uid)
        .single();
    if (!sdata || userExistsErrorn) console.log("Server error.");
    const daily_last = daysBetween(sdata.daily_last);
    if (sdata.daily_last !== null && daily_last && daily_last <= 1) {
        document.getElementById("dailycheckinstreak").innerHTML = daily_last;
    }
    if (daily_last && daily_last == 0) {
        document.getElementById("dailygift").classList.add('collected');
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