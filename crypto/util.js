function main() {
    var list = GetURLParameter("to") || GetURLParameter("l");
    if (list) {
        document.getElementById("setter").value = list;
        setScreen(list);
    }
    var app = GetURLParameter("id");
    if (app) {
        document.getElementById("appselect").value = app;
    }
}

function setScreen(to) {
    var x = document.querySelectorAll(".utilScreen");
    x.forEach(i => {
        i.style.display = "none";
    });
    if (to != "null") document.getElementById(to).style.display = "flex";
    updateSelect(to);
}

function updateSelect(to) {
    var slct = document.getElementById("appselect");
    if (to == "new") LIQ = LISTN;
    else if (to == "earn") LIQ = LISTE;
    else {
        slct.classList.add("disabled");
        slct.innerHTML = "<option value='null'>Please select what you want to report first.</option>";
        return;
    }
    slct.classList.remove("disabled");
    slct.innerHTML = "<option value='null'>-- please select --</option>";
    for (const i of LIQ) {
        if (i.attr.verified == 1) continue;
        slct.innerHTML += `<option value='${i.id}'>${i.name}</option>`;
    }
}

function setText(to) {
    let span = document.getElementById("earnspan");
    let text = document.getElementById("earntext");
    if (to == "scam") {
        span.innerHTML = "a <i>scam</i>";
        text.innerHTML = "* Please describe the scam aspect and provide proof. This can be anything from pointing out the red flags to showing any proof of it actually being a scam (provide links to reliable media, show the background of the developers, etc.):";
    } else if (to == "legit") {
        span.innerHTML = "<i>legit</i>";
        text.innerHTML = "* Please provide any proof of legitimacy. This could be anything from providing provable withdrawal hashes, links to reliable media, debunking red flags, etc.:"
    }
}

async function submitForm(page, screen) {
    var status = document.getElementById(screen + "status");
    var button = document.getElementById(screen + "submit");
    status.innerHTML = "Please wait...";
    status.style.display = "block";
    button.classList.add("disabled");
    var body = { type: screen };
    if (page == "add") {
        body.name = document.getElementById(screen + "name").value;
        body.link = document.getElementById(screen + "link").value;
        if (screen != "scam") body.links = JSON.stringify({
            web: document.getElementById(screen + "lw").value,
            android: document.getElementById(screen + "la").value,
            ios: document.getElementById(screen + "li").value,
            tg: document.getElementById(screen + "lt").value
        });
        else body.dsc = document.getElementById("scamprf").value;
        await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/submitCryptoApp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                status.innerHTML = data.response;
            });
        return;
    }
    else if (page == "rep") {
        var app = document.getElementById("appselect").value;
        var dsc = document.getElementById(screen+"prf").value;
        if (app == "null") {
            status.innerHTML = "Please select an app first.";
            button.classList.remove("disabled");
            return;
        }
        if (dsc.length < 50) {
            status.innerHTML = "Please provide a more detailed proof (at least 50 characters).<br>Remember to include <i>links</i> to reliable media and other <i>relevant information</i>."
            button.classList.remove("disabled");
            return;
        }
        body.app = app;
        body.dsc = dsc;
        if (screen == "earn") body.oft = document.getElementById("earntype").value;
        await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/reportCryptoApp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify(body)
        }).then(response => response.json()).then(data => {
            status.innerHTML = data.response;
        });
        return;
    }
}