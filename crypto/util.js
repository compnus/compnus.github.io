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
    if (page == "add") {

    }
}