var selected = 0;

function messageType(type) {
    selected = type;
    document.getElementById("types" + type).classList.add("selected");
    document.getElementById("type" + type).classList.add("selected");
    document.getElementById("types" + Number(!type)).classList.remove("selected");
    document.getElementById("type" + Number(!type)).classList.remove("selected");
}

async function sendMessage() {

}

function remainingChar() {
    var rm = document.getElementById("remainingchar");
    var length = 300 - document.getElementById("normalmsg").value.length;
    var breaks = document.getElementById("normalmsg").value.split("\n").length - 1;
    var length = length-(breaks*4);
    rm.innerHTML = "Characters remaining: " + length;
    if (length >= 100) rm.style.color = "white";
    else if (length >= 50) rm.style.color = "yellow";
    else if (length >= 0) rm.style.color = "orange";
    else rm.style.color = "red";
    var x = document.getElementById("limitedsend");
    if (length >= 0) x.classList.remove("disabled");
    else x.classList.add("disabled");
}

function fixTitle(which) {
    which = which.replace("title", "");
    var i = {
        "normal": document.getElementById('normaltitle'),
        "adv": document.getElementById('advtitle')
    }

    if (i[which].value.length > 100) i[which].value = i[which].value.substring(0, 100);

    if (which === "normal") i["adv"].value = i[which].value;
    else if (which === "adv") i["normal"].value = i[which].value;

    document.getElementById("normaltitleremchar").innerHTML = "Title length: " + i[which].value.length + "/100";
    document.getElementById("advtitleremchar").innerHTML = "Title length: " + i[which].value.length + "/100";
}