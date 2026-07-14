const SUPABASE_URL = "https://jwpvozanqtemykhdqhvk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cHZvemFucXRlbXlraGRxaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzY3MDgsImV4cCI6MjA1NDk1MjcwOH0.uoNqHwXBalSEoaJgtlmPE8gMr4VmTGmL-XDPFJq1Xr0";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var popupid = 0;


async function logOut() {
    await sb.auth.signOut();
    window.location.href = "/";
}

async function getUser(bypass=false) {
    const { data, error } = await sb.auth.getUser();

    if (error || !data.user) {
        return { user:false, data:error };
    }
    if (!bypass) {
        const { data: d, error: e } = await sb.from("users").select("username").eq("id", data.user.id).single();
        if (!d || e || d.username[0] === ".") window.location.assign("/u/setup.html");
    }
    return { user: true, data: data.user };
}

function random(type, ...settings) {
    switch (type) {
        case 100:
            let count = settings[0] || 10;
            let result = "";
            const chars = "qwertyuiopasdfghjklzxcvbnm0123456789_";
            for (let i = 0; i < count; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
            return result;
        default:
            return "Unknown type";
    }
}

function popup(title, message, close = true, compact = false) {
    var x = document.createElement("div");
    x.style.opacity = 0;
    x.style.transition = '0.1s';
    x.id = "popup" + popupid++;
    x.className = "popup";
    x.innerHTML = `
    <div onclick="e = window.event; e.stopPropagation()" class="${compact?"cm":""}">
    <div class="inside">
    <h1>${title}</h1>
    <h2 onclick="document.getElementById('${x.id}').style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('${x.id}')), 201)">X</h2>
    </div>
    <p style="margin-bottom:0">
    ${message}
    </p>
    </div>
    `;
    if (close) {
        x.onclick = () => {
            x.style.opacity = 0;
            window.setTimeout(() => document.body.removeChild(document.getElementById(x.id)), 201);
        }
    }

    document.body.appendChild(x);
    window.setTimeout(() => x.style.opacity = 1, 1);
}

async function getBalance(uid) {
    const { data: balance, error: userExistsErrorn } = await sb
        .from("udata")
        .select("balance_nus, balance_noca, balance_sats")
        .eq("user_id", uid)
        .single();

    if (!balance || userExistsErrorn) return false;

    return [balance.balance_nus, balance.balance_noca, balance.balance_sats];
}

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

async function getVariable(vars) {
    const { data, error } = await sb
        .from("variable")
        .select("value")
        .eq("key", vars)
        .single();

    if (!data || error) return null;
    else return data.value;
}

addEventListener("keydown", async (e) => {
    if (e.key === "q" && (e.ctrlKey || e.metaKey)) {
        const { user, data } = await getUser();
        if (user) {
            popup('Log Out', `Please confirm that you want to log out.</p><br><div class='flex cc'><br><button onclick='logOut()' class='fullwidth'>Log Out</button></div><p style='margin:0'>`)
        }
    }
});

console.log("script loaded");

