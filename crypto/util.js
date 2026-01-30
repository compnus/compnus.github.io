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

function submitForm(page, screen) {
    console.log(page, screen)
    var status = document.getElementById(screen + "status");
    var button = document.getElementById(screen + "submit");
    status.innerHTML = "Please wait...";
    status.style.display = "block";
    button.classList.add("disabled");
    var body = {uid: getUser().data.id};
    if (page == "add") {
        body.name = document.getElementById(screen + "name").value;
        body.link = document.getElementById(screen + "link").value;
        body.type = screen;
        if (screen != "scam") {
            body.links = {
                web: document.getElementById(screen + "lw").value,
                android: document.getElementById(screen + "la").value,
                ios: document.getElementById(screen + "li").value,
                tg: document.getElementById(screen + "lt").value
            }
        }
    }
}