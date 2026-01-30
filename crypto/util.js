function main() {
    var list = GetURLParameter("to");
    if (list) {
        document.getElementById("setter").value = list;
        setScreen(list);
    }
}

function setScreen(to) {
    var x = document.querySelectorAll(".utilScreen");
    x.forEach(i => {
        i.style.display = "none";
    });
    document.getElementById(to).style.display = "flex";
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
}