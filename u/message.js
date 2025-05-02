var selected = 0;
var lastLoc = 0;
var selectStyle = 0;
var dt = { user_id: null, uid: null };
var mt = { user_id: null, uid: null, to: null, title: null, message: null }

function messageType(type) {
    selected = type;
    document.getElementById("types" + type).classList.add("selected");
    document.getElementById("type" + type).classList.add("selected");
    document.getElementById("types" + Number(!type)).classList.remove("selected");
    document.getElementById("type" + Number(!type)).classList.remove("selected");
    loadNocas();
}

async function loadNocas() {
    const { data, error } = await supabase.auth.getUser();
    dt.user_id = data.user.id;
    dt.uid = (await supabase.auth.getSession()).data.session?.user.id;
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/getbalance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(dt)
    })
        .then(response => response.json())
        .then(data => {
            y = data.balance[1];
            document.getElementById("nocabalance").innerHTML = y;
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}

async function sendMessage() {
    if (selected === 0) {
        if (document.getElementById("normalreciever").value.trim() === "") {
            popup("Receiver is missing!","Please input the username of the person you want your message to be delivered to.");
            return;
        }
        if (document.getElementById("normaltitle").value.trim() === "") {
            popup("Title is missing!", "Please input the title of your message.");
            return;
        }
        if (document.getElementById("normalmsg").value.trim() === "") {
            popup("Message is missing!", "There is no message to send.");
            return;
        }
        var bt = document.getElementById("limitedsend");
        bt.innerHTML = "Please wait...";
        const { data, error } = await supabase.auth.getUser();
        if (error) { popup("Error!", "You need to be logged-in to send messages!"); bt.innerHTML = "Send"; return }
        mt.user_id = data.user.id;
        mt.uid = (await supabase.auth.getSession()).data.session?.user.id;
        mt.to = document.getElementById("normalreciever").value;
        mt.title = document.getElementById("normaltitle").value;
        mt.message = document.getElementById("normalmsg").value;
        await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/sendMessageNormal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify(mt)
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === null || data.type === undefined) {
                    popup("Error!", data.response);
                    bt.innerHTML = "Send";
                    return;
                }
                if (data.type === 0) {
                    popup(data.response, data.message);
                    bt.innerHTML = "Send";
                    return;
                }
                if (data.type === 1) popup(data.response, "</p><div class='flex cc'><button onclick='history.back()'>Return</button></div><p style='margin:0'");
            })
            .catch((error) => {
                console.error('Error invoking function:', error);
            });
        bt.innerHTML = "Send";
    }

    if (selected === 1) {
        if (document.getElementById("advreciever").value.trim() === "") {
            popup("Receiver is missing!", "Please input the username of the person you want your message to be delivered to.");
            return;
        }
        if (document.getElementById("advtitle").value.trim() === "") {
            popup("Title is missing!", "Please input the title of your message.");
            return;
        }
        if (document.getElementById("advmsg").value.trim() === "") {
            popup("Message is missing!", "There is no message to send.");
            return;
        }
        var bt = document.getElementById("limitedsend");
        bt.innerHTML = "Please wait...";
        const { data, error } = await supabase.auth.getUser();
        if (error) { popup("Error!", "You need to be logged-in to send messages!"); bt.innerHTML = "Send"; return }
        mt.user_id = data.user.id;
        mt.uid = (await supabase.auth.getSession()).data.session?.user.id;
        mt.to = document.getElementById("normalreciever").value;
        mt.title = document.getElementById("normaltitle").value;
        mt.message = document.getElementById("normalmsg").value;
        await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/sendMessageNormal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify(mt)
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === null || data.type === undefined) {
                    popup("Error!", data.response);
                    bt.innerHTML = "Send";
                    return;
                }
                if (data.type === 0) {
                    popup(data.response, data.message);
                    bt.innerHTML = "Send";
                    return;
                }
                if (data.type === 1) popup(data.response, "</p><div class='flex cc'><button onclick='history.back()'>Return</button></div><p style='margin:0'");
            })
            .catch((error) => {
                console.error('Error invoking function:', error);
            });
        bt.innerHTML = "Send";
    }
}

function remainingChar() {
    var rm = document.getElementById("remainingchar");
    var length = 300 - document.getElementById("normalmsg").value.length;
    var breaks = document.getElementById("normalmsg").value.split("\n").length - 1;
    var lefts = document.getElementById("normalmsg").value.split("<").length - 1;
    var rights = document.getElementById("normalmsg").value.split(">").length - 1;
    var amps = document.getElementById("normalmsg").value.split("&").length - 1;
    length = length - ((breaks + amps) * 4) - ((lefts + rights) * 3);
    rm.innerHTML = "Characters remaining: " + length;
    if (length >= 100) rm.style.color = "white";
    else if (length >= 50) rm.style.color = "yellow";
    else if (length >= 0) rm.style.color = "orange";
    else rm.style.color = "orangered";
    var x = document.getElementById("limitedsend");
    if (length >= 0) x.classList.remove("disabled");
    else x.classList.add("disabled");
}

function increaseChar() {
    var advmsg = document.getElementById("advmsg").value;
    var rm = document.getElementById("charcount");
    var length = advmsg.length;
    var breaks = advmsg.split("\n").length - 1;
    var lefts = advmsg.split("<").length - 1;
    var rights = advmsg.split(">").length - 1;
    var amps = advmsg.split("&").length - 1;
    var lbr = advmsg.split("{{").length - 1;
    var rbr = advmsg.split("}}").length - 1;
    var hrs = advmsg.split("{l}").length - 1;
    var hs = advmsg.split("{h}").length - 1;
    var nhs = advmsg.split("{/h}").length - 1;
    var quts = advmsg.split('"').length - 1;
    var links = advmsg.split("{link}").length - 1;
    var imgs = advmsg.split("{img}").length - 1;
    var nbsps = advmsg.split("{!}").length - 1;
    var imgsts = (advmsg.split("{img1}").length - 1) + (advmsg.split("{img2}").length - 1) + (advmsg.split("{img3}").length - 1) + (advmsg.split("{img4}").length - 1) + (advmsg.split("{img5}").length - 1) + (advmsg.split("{img6}").length - 1) + (advmsg.split("{img7}").length - 1) + (advmsg.split("{img8}").length - 1);
    length = length + ((breaks + amps) * 4) + ((lefts + rights + nbsps) * 3) + ((lbr + rbr) * 6) + (hs+nhs) + quts*5 + (imgs*2) + (imgsts*15) + hrs*8 + links*30;
    rm.innerHTML = "Characters: " + length;
    document.getElementById("messagecost").innerHTML = 1 + links + (Math.floor((length - 1) / 50) >= 0 ? Math.floor((length - 1) / 50):0);
}

function preview() {
    var content = document.getElementById("advmsg").value.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>").replaceAll("{l}<br>", "{l}")
        .replaceAll("&", "&amp;").replaceAll("{{", "&lbrace;").replaceAll("}}", "&rbrace;").replaceAll("{b}", "<b>").replaceAll("{/b}", "</b>").replaceAll("{i}", "<i>").replaceAll("{/i}", "</i>").replaceAll("{u}", "<u>").replaceAll("{/u}", "</u>")
        .replaceAll("{s}", "<s>").replaceAll("{/s}", "</s>").replaceAll("{h}", "<h0>").replaceAll("{/h}", "</h0>").replaceAll("{l}", "</p><hr><p>").replaceAll("{link}", "<a class='linkstv' target='_blank' href='").replaceAll("{text}", "'>")
        .replaceAll("{/link}", "</a>")        .replaceAll("{/img}", "'>").replaceAll("{img}", "<img src='").replaceAll("{img1}", "<img class='img1' src='").replaceAll("{img2}", "<img class='img2' src='").replaceAll("{img3}", "<img class='img3' src='")
        .replaceAll("{img4}", "<img class='img4' src='").replaceAll("{img5}", "<img class='img5' src='").replaceAll("{img6}", "<img class='img6' src='").replaceAll("{img7}", "<img class='img7' src='").replaceAll("{img8}", "<img class='img8' src='")
        .replaceAll("{!}","&nbsp;");
    popup("Preview", `</p>
        <div class="msgmsgmain">
        <div class="msgmsg">
        <p>
        ${content}
        </p>
        </div>
        </div>
        <p style="margin:0">
    `);
}

function add(x) {
    var msg = document.getElementById("advmsg");
    lastLoc = msg.selectionEnd;
    msg.value = msg.value.slice(0, lastLoc) + x + msg.value.slice(lastLoc);
    msg.selectionEnd = lastLoc + x.length;
    msg.focus();
}

function addLink() {
    popup("Add Link", `
        </p>
        <div class="input">
            <label for="llink">URL:</label>
            <input id="llink" placeholder="https://example.com" oninput='this.value=this.value.replaceAll(" ","%20").replaceAll("<","%3C").replaceAll(">","%3E").replaceAll("{","%7B").replaceAll("}","%7D").replaceAll("\\"","%22")'/>
        </div>
        <div class="input">
            <label for="ltext">Displayed Text:</label>
            <input id="ltext" placeholder="My Link!"/>
        </div>
        <div class="flex cc"><button onclick="addLinkComp('popup${popupid}')">Add Link</button></div><p style="margin:0">
    `);
}

function addLinkComp(id) {
    add(`{link}${document.getElementById("llink").value}{text}${document.getElementById("ltext").value}{/link}`);
    document.getElementById(id).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById(id)), 201);
}

function addImage() {
    selectStyle = 0;
    popup("Add Image", `
        </p>
        <div class="input">
            <label for="ilink">Link to Image:</label>
            <input id="ilink" placeholder="https://example.com" oninput='this.value=this.value.replaceAll(" ","%20").replaceAll("<","%3C").replaceAll(">","%3E").replaceAll("{","%7B").replaceAll("}","%7D").replaceAll("\\"","%22")'/>
        </div>
        <div class="input"><label>Style:</label></div>
        <div id="ichoser">
            <div class="choserthing" style="grid-row:1/3"><div id="choser0" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=0; this.classList.add('chosen')" class="choser chosen" title="Default"></div></div>
            <div class="choserthing"><div id="choser1" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=1; this.classList.add('chosen')" class="choser" title="Square (Big)"></div></div>
            <div class="choserthing"><div id="choser2" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=2; this.classList.add('chosen')" class="choser" title="Square (Small)"></div></div>
            <div class="choserthing"><div id="choser3" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=3; this.classList.add('chosen')" class="choser" title="Rounded (Big)"></div></div>
            <div class="choserthing"><div id="choser4" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=4; this.classList.add('chosen')" class="choser" title="Rounded (Small)"></div></div>
            <div class="choserthing"><div id="choser5" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=5; this.classList.add('chosen')" class="choser" title="Circle (Big)"></div></div>
            <div class="choserthing"><div id="choser6" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=6; this.classList.add('chosen')" class="choser" title="Circle (Small)"></div></div>
            <div class="choserthing"><div id="choser7" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=7; this.classList.add('chosen')" class="choser" title="Hover (Big)"><p>HOVER*</p></div></div>
            <div class="choserthing"><div id="choser8" onclick="document.querySelector('.chosen').classList.remove('chosen'); selectStyle=8; this.classList.add('chosen')" class="choser" title="Hover (Small)"><p>HOVER*</p></div></div>
        </div>
        <p>* Note: On mobile devices, the effect will activate upon clicking.</p>
        <div class="flex cc"><button onclick="addImageComp('popup${popupid}')">Add Image</button></div><p style="margin:0">
    `);
}

function addImageComp(id) {
    add(`{img${selectStyle===0?"":selectStyle}}${document.getElementById("ilink").value}{/img}`);
    document.getElementById(id).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById(id)), 201);
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