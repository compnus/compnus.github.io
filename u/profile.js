var dt = { user_id: null, uid: null };
var messageid = 0;
var loadedmessages = {};
var ismsgban = false;

async function main() {
    const { data, error } = await supabase.auth.getUser();
    dt.user_id = data.user.id;
    dt.uid = (await supabase.auth.getSession()).data.session?.user.id;

    const { data: userindt, error: problem } = await supabase.from("udata").select("user_id").eq("user_id", dt.user_id).single();
    if (!userindt || problem || userindt.user_id!=dt.user_id) fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/inituser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(dt)
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error invoking function:', error);
        });

    const { data: nameddata, error: namederror } = await supabase
        .from("users")
        .select("name")
        .eq("id", dt.user_id)
        .single();

    if (namederror || !nameddata.name) {
        window.location.href = "setup.html";
    }

    document.getElementById("welcomer").innerHTML = `Welcome, ${nameddata.name}!`;

    loadWallet();
    loadMessages();
    administr();
    window.setTimeout(5000, ()=>{ loadWallet(); loadMessages(); });
}

async function loadWallet() {
    var x, whole, rem, y, wholes, rems;
    balance = await getBalance(dt.uid);
    x = balance[0];
    whole = Math.floor(x);
    rem = Math.round((x - whole) * 100000000);
    document.getElementById("walletnus").innerHTML = `${whole}<span class="walletdecimal">.${"0".repeat(8 - rem.toString().length)}${rem}</span>`;
    document.getElementById("walletnoca").innerHTML = balance[1];
    y = balance[2];
    wholes = Math.floor(y);
    rems = Math.round((y - wholes) * 10000);
    document.getElementById("walletsats").innerHTML = `${wholes}<span class="walletdecimal">.${"0".repeat(4 - rems.toString().length)}${rems}</span>`;
    var pricebtc;
    await fetch('https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=BTC-USD').then(response => response.json()).then(json => { pricebtc = json.Data["BTC-USD"].VALUE });
    var pricebtcnew = (y * (pricebtc / 100000000)).toFixed(3);
    document.getElementById("valuebtcsats").innerHTML = `&asymp; $${pricebtcnew.substring(0, 4)}<span style="color:#999; font-weight:300">${pricebtcnew.substring(4)}</span>`;
}

async function loadMessages() {
    var msgcont = document.getElementById("messagecont");
    loadedmessages = {};
    messageid = 0;
    var { data: x, error: y } = await supabase.from("users").select("messages").eq("id", dt.uid).single();
    try {
        if (!x || y) {
            throw new DOMException(y.message);
        }
    } catch (x) {
        msgcont.innerHTML = `<p>An error occurred while trying to load messages${x?": "+x:""}.</p>`;
        return;
    }
    x = x.messages;
    if (x === null) {
        msgcont.innerHTML = `<p>You have no messages.</p>`;
        return;
    }

    x = x.split("%$$%");
    if (x.length === 1 && x[0].trim() === '') {
        msgcont.innerHTML = `<p>You have no messages.</p>`;
        return;
    }
    msgcont.innerHTML = "";
    for (var i of x) {
        loadedmessages[messageid] = i;
        if (i.trim() === "") continue;
        var y = i.trim().split("%$,%");
        var z = {
            id: messageid,
            title: "",
            from: "",
            message: ``
        }

        for (var j of y) {
            if (j.startsWith("%$t%")) z.title = j.substring(4);
            else if (j.startsWith("%$f%")) z.from = j.substring(4);
            else if (j.startsWith("%$m%")) z.message = j.substring(4);
        }

        messageid++;

        var cont = document.createElement("div");
        cont.classList.add("message");
        cont.id = "message" + z.id;
        var trash = document.createElement("img");
        trash.classList.add("msgtrash");
        trash.src = "https://img.icons8.com/?size=100&id=85194&format=png&color=FFFFFF";
        trash.title = "Delete Message (This cannot be undone!)";
        trash.setAttribute("onclick", "deleteMessage("+z.id+")");
        cont.appendChild(trash);
        var title = document.createElement("h1");
        title.classList.add("msgtitle");
        title.innerHTML = z.title;
        cont.appendChild(title);
        var from = document.createElement("h3");
        from.classList.add("msgfrom");
        var formatXp = z.title.replaceAll("%", "%25").replaceAll("'", "%27").replaceAll('"', "<CHQTE>").replaceAll("&amp;", "<CHAMP>");
        var replyButton = ismsgban?"":`<img class="msgaction" src="https://img.icons8.com/?size=100&id=9TytzhcaAZJO&format=png&color=FFFFFF" title="Reply" onclick="location.assign('message.html?to=${z.from}&title=Re:%20${formatXp}')"/>`;
        from.innerHTML = "From: " + z.from + (z.from === "CompNUS" ? `<img class="msgverified" src="https://img.icons8.com/?size=100&id=85190&format=png&color=FFFFFF" title="This is an official message from CompNUS."/>`
            : `${replyButton}<img class="msgaction" src="https://img.icons8.com/?size=100&id=94733&format=png&color=FFFFFF" title="Report Message" onclick="reportMsg(${JSON.stringify(z)})"/><img class="msgaction" src="https://img.icons8.com/?size=100&id=83222&format=png&color=FFFFFF" title="Block User" onclick="blockUser('${z.from}')"/>`);
        cont.appendChild(from);
        var msg = document.createElement("div");
        msg.classList.add("msgmsg");
        msg.innerHTML = z.message;
        cont.appendChild(msg);

        msgcont.appendChild(cont);
    }
    if (msgcont.innerHTML.trim() === "") {
        msgcont.innerHTML = `<p>You have no messages.</p>`;
    }
}

async function administr() {
    const { data: msgadm, error: msgadmerror } = await supabase
        .from("udata")
        .select("can_message, admin")
        .eq("user_id", dt.uid)
        .single();

    if (!msgadm || msgadmerror) console.error(msgadmerror);
    else {
        ismsgban = !msgadm.can_message;
        if (msgadm.admin) document.getElementById("adminactions").style.display = "grid";
        if (ismsgban) document.getElementById("messagenew").style.display = "none";
    }
}

function reportMsg(msg) {
    msg = JSON.parse(msg);
    popup("Report Message from "+msg.from, `
    <form id="suggestionform" onsubmit='event.preventDefault(); reportMessage(${JSON.stringify(msg)}, document.getElementById("offensetype").value, document.getElementById("describerep").value, document.getElementById("reportmsgstatus"));'>
        <div class="input">
            <label for="offensetype">Report for:</label>
            <select id="offensetype" style="width:initial !important; flex:10">
              <option value="spam">Spam / Chain Message</option>
              <option value="scam">Malicious Content / Scam</option>
              <option value="hate">Hate Speech / Threats</option>
              <option value="illegal">Illegal Activity</option>
              <option value="nsfw">Pornographic Content</option>
              <option value="other">Other</option>
            </select>
        </div>
        <p style="margin-bottom: 0.5vw">Anything you would like to add?<br><i>Feel free to add additional notes regarding your concern.</i></p>
        <textarea id="describerep"></textarea>
        <br>
        <p id="reportmsgstatus" style="font-weight:bold;text-align:center"></p>
        <button type="submit" class="fullwidth" style="border-color: red">Report Message</button>
        </form>
        <p style="margin:0">
    `);
}

async function reportMessage(message, offense, dsc, status) {
    message = JSON.parse(message);
    status.innerHTML = "Please wait...";
    dsc = dsc.trim();
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/reportMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ uid: dt.uid, type: offense, msg: `from->${message.from}\ntitle->${message.title}\nmessage->${message.message}`, concern: dsc })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.sc) {
                status.innerHTML = "Error: " + data.response;
            } else {
                status.innerHTML = data.response;
                var toremove = popupid - 1
                document.getElementById('popup' + toremove).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + toremove)), 201);
                popup(data.response, "We advise you to block this user as well, to prevent any other messages from them.<br>Thank you for your help!");
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}

async function blockUser(username) {

}

async function deleteMessage(id) {
    var buffer = loadedmessages[id];
    delete loadedmessages[id];
    var newmessages = "";
    for (var i in loadedmessages) newmessages+=(loadedmessages[i].trim() + "%$$%");
    newmessages = newmessages.replace(/%\$\$%$/, '').trim();
    const { data, error } = await supabase
        .from("users")
        .update({ messages: newmessages })
        .eq("id", dt.uid);
    if (error) {
        alert("An error occured while trying to delete the message.\n" + error.message);
        loadedmessages[id] = buffer;
    } else {
        document.getElementById("messagecont").removeChild(document.getElementById("message" + id));
        if (JSON.stringify(loadedmessages) === "{}") {
            document.getElementById("messagecont").innerHTML = `<p>You have no messages.</p>`;
        }
        if (document.getElementById("messagecont").innerHTML.trim() === "") {
            document.getElementById("messagecont").innerHTML = `<p>You have no messages.</p>`;
        }
    }
}

function collapse(id) {
    panel = document.getElementById(id);
    document.getElementById("collapse" + id).classList.toggle("collapsed");
    if (panel.classList.contains("collapsed")) {
        panel.classList.remove("collapsed");
        panel.style.height = panel.scrollHeight - (window.innerHeight / 25) + "px";
    } else {
        panel.style.height = panel.scrollHeight - (window.innerHeight / 20) + "px";
        panel.offsetHeight;
        panel.style.height = "3.5vh";
        panel.classList.add("collapsed");
    }
}

async function attemptRecovery() {
    var status = document.getElementById('passresetstatus');
    status.innerHTML = "Please wait...";
    const { data:email, error:noemail } = await supabase.from('users').select('email').eq('id', dt.uid).single();
    if (!email || noemail) {
        status.innerHTML = "Error fetching user data.<br>Try refreshing the page.";
        return;
    }
    email = email.data.email;
    if (email !== document.getElementById('resetpassword').value) {
        status.innerHTML = "Emails do not match."
        return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
        status.innerHTML = error.message;
    } else {
        status.innerHTML = "Password reset link sent! Check your email.";
    }
}

async function copyTemplate() {
    var x = `I would like to delete my account on CompNUS.
Username: [[Put your username here, as a confirmation]]
Reason: [[Optionally, you can tell us why you are leaving CompNUS]]

I do acknowledge, that I will lose access to everything connected to my CompNUS account, and funds in my wallet will be lost forever: [[Write "YES" here]]`;
    navigator.clipboard.writeText(x);
    popup("Template copied!", "Template preview:<br><br>"+x.replaceAll("\n","<br>"));
}

console.log("profile loaded");