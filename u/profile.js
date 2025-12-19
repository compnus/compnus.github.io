var dt = { user_id: null, uid: null, referral: null };
var messageid = 0;
var loadedmessages = {};
var messagecontainer = {};
var ismsgban = false;
var reclinktype = 0;
var dtusername = "";

async function main() {
    const { data, error } = await sb.auth.getUser();
    dt.user_id = data.user.id;
    dt.uid = (await sb.auth.getSession()).data.session?.user.id;
    dt.referral = localStorage.getItem("referral") || "";

    const { data: userindt, error: problem } = await sb.from("udata").select("user_id").eq("user_id", dt.user_id).single();
    if (!userindt || problem || userindt.user_id!=dt.user_id) await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/inituser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(dt)
    })
        .then(response => response.json())
        .then(data => {
            if (data.wongref) {
                popup("Invalid Referral Code", "The referral code you used is incorrect and you have not received your 0.01 $NUS bonus.<br>If you want to receive this bonus, select Edit Account in Account Actions and click 'Add Referral Code...'.")
                localStorage.removeItem("referral");
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });

    const { data: nameddata, error: namederror } = await sb
        .from("users")
        .select("name, username")
        .eq("id", dt.user_id)
        .single();

    if (namederror || !nameddata) {
        window.location.href = "setup.html";
    }

    document.getElementById("welcomer").innerHTML = `Welcome, ${nameddata.name}!`;
    dtusername = nameddata.username;

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
    document.getElementById("walletnus").innerHTML = `${whole}<span class="walletdecimal" style="color: #ccc !important">.${"0".repeat(8 - rem.toString().length)}${rem}</span>`;
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
    messagecontainer = {};
    messageid = 0;
    var { data: x, error: y } = await sb.from("users").select("messages").eq("id", dt.uid).single();
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
            : `${replyButton}<img class="msgaction" src="https://img.icons8.com/?size=100&id=94733&format=png&color=FFFFFF" title="Report Message" onclick="reportMsg(${z.id})"/><img class="msgaction" src="https://img.icons8.com/?size=100&id=83222&format=png&color=FFFFFF" title="Block User" onclick="blockUser('${z.from}')"/>`);
        cont.appendChild(from);
        var msg = document.createElement("div");
        msg.classList.add("msgmsg");
        msg.innerHTML = z.message;
        cont.appendChild(msg);

        msgcont.appendChild(cont);
        messagecontainer[z.id] = z;
    }
    if (msgcont.innerHTML.trim() === "") {
        msgcont.innerHTML = `<p>You have no messages.</p>`;
    }
}

async function administr() {
    const { data: msgadm, error: msgadmerror } = await sb
        .from("udata")
        .select("can_message, admin")
        .eq("user_id", dt.uid)
        .single();

    if (!msgadm || msgadmerror) console.error(msgadmerror);
    else {
        ismsgban = !msgadm.can_message;
        if (msgadm.admin) document.getElementById("adminactions").style.display = "grid";
        if (ismsgban) document.getElementById("messagenew").style.display = "none";
        return msgadm.admin;
    }
    return false;
}

function reportMsg(msg) {
    popup("Report Message from "+messagecontainer[msg].from, `
    <form id="suggestionform" onsubmit='event.preventDefault(); reportMessage(${msg}, document.getElementById("offensetype").value, document.getElementById("describerep").value, document.getElementById("reportmsgstatus"));'>
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
    message = messagecontainer[message];
    status.innerHTML = "Please wait...";
    dsc = dsc.trim();
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/reportMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
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

function blockUser(username) {
    popup("Do you want to block " + username + "?", `
        Blocking this user will remove their ability to send you messages.<br>
        You can unblock them from the Edit Account page.<br>
        Do you wish to proceed?</p>
        <p id="blockuserstatus" style="font-weight:bold;text-align:center"></p>
        <button class="fullwidth" style="border-color: red" onclick="blockUserConfirm('${username}')">Yes, block ${username}</button><br>
        <button class="fullwidth" onclick="document.getElementById('popup' + (popupid-1)).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + (popupid-1))), 201)">Cancel</button>
        <p style="margin:0">
    `);
}

async function blockUserConfirm(username) {
    username = username.trim();
    const status = document.getElementById("blockuserstatus");
    status.innerHTML = "Please wait...";
    const { data: { user }, error: authError } = await sb.auth.getUser();
    var stableID = popupid - 1;
    if (authError) { document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201); popup("An error occured.", authError.message); return; }
    const { data, error } = await sb.from("users").select("blocked_users").eq("id", user.id).single();
    if (error) { document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201); popup("An error occured.", error.message); return; }
    if (data.blocked_users.startsWith(username + "|") || data.blocked_users.endsWith("|" + username) || data.blocked_users.includes("|" + username + "|")) {
        document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201);
        popup("You have already blocked " + username + "!", "This user is already blocked. You cannot block them again.<br>You can try blocking them IRL. Dunno how that would work tho...");
        return;
    }
    const { data: finalize, error: finalizeError } = await sb.from("users").update({ blocked_users: data.blocked_users + username + "|" }).eq("id", user.id).single();
    if (finalizeError) { document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201); popup("An error occured.", authError.message); return; }
    else {
        document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201);
        popup("You have blocked " + username + "!", "You will no longer receive messages from this user.<br>To unblock them, go to the Edit Account page.");
    }
}

async function deleteMessage(id) {
    var buffer = loadedmessages[id];
    delete loadedmessages[id];
    var newmessages = "";
    for (var i in loadedmessages) newmessages+=(loadedmessages[i].trim() + "%$$%");
    newmessages = newmessages.replace(/%\$\$%$/, '').trim();
    const { data, error } = await sb
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
    const { data:email, error:noemail } = await sb.from('users').select('email').eq('id', dt.uid).single();
    if (!email || noemail) {
        status.innerHTML = "Error fetching user data.<br>Try refreshing the page.";
        return;
    }
    email = email.data.email;
    if (email !== document.getElementById('resetpassword').value) {
        status.innerHTML = "Emails do not match."
        return;
    }
    const { error } = await sb.auth.resetPasswordForEmail(email);

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

async function showAccountInfo() {
    const { data, error } = await sb.from("users").select("username, email, birthdate").eq("id", dt.uid).single();
    const { data: data1, error: error1 } = await sb.from("udata").select("can_message, referred, invitees").eq("user_id", dt.uid).single();
    if (error || !data || error1 || !data1) {
        popup("An Error Occured", "An error occurred while fetching your account information.<br>" + (error ? error.message : "") + (error1 ? "<br>" + error1.message : ""));
        return;
    }
    var invitees = data1.invitees.match(/\(([^)]+)\)/g)?.map(s => s.slice(1, -1)) || [];
    var invites = invitees.length;
    if (invites === 1 && invitees[0] === "") invites = 0;
    popup("Account Information", `
    <b>Username:</b> ${data.username}<br>
    <b>Email:</b> ${data.email}<br>
    <b>Date of Birth:</b> ${new Date(data.birthdate).toLocaleDateString()}<br>
    <b>Banned from Sending Messages:</b> ${data1.can_message ? "No" : "Yes"}<br>
    ${data1.referred ? "<b>Referred By:</b> " + data1.referred + "<br>" : ""}<br>
    You invited <b>${invites} user${invites == 1 ? "" : "s"}</b> to CompNUS.
    `);
}

function calcFees() {
    var type = document.getElementById("sendmoneyselect").value;
    var totalReceivedCur = document.getElementById("sendmoneytotalcur");
    var totalPaidCur = document.getElementById("sendmoneytotalpaidcur");
    var amountFix = document.getElementById("sendmoneyamount")
    if (amountFix.value.includes("e")) amountFix.value = parseFloat(amountFix.value).toFixed(8);
    var parts = amountFix.value.split(".");
    if (type == "nus" && parts[1] && parts[1].length > 8) amountFix.value = parseFloat(parseFloat(amountFix.value)?.toFixed(8));
    if (type == "sat" && parts[1] && parts[1].length > 4) amountFix.value = parseFloat(parseFloat(amountFix.value)?.toFixed(4));
    var amount = parseFloat(amountFix.value) || 0;
    var fee = document.getElementById("sendmoneyfee");
    var feecur = document.getElementById("sendmoneyfeecur");
    if (type == "nus") {
        feecur.innerHTML = "$";
        totalReceivedCur.innerHTML = "$";
        totalPaidCur.innerHTML = "$";
        if (amount / 20 <= 0.005) fee.innerHTML = 0.005;
        else if (amount / 20 >= 1) fee.innerHTML = 1;
        else fee.innerHTML = (amount / 20).toFixed(3);
    } else if (type == "noca") {
        feecur.innerHTML = "¤";
        totalReceivedCur.innerHTML = "¤";
        totalPaidCur.innerHTML = "¤";
        if (amount / 100 >= 95) fee.innerHTML = 100;
        else fee.innerHTML = Math.floor(amount / 100) + 5;
    } else if (type == "sat") {
        feecur.innerHTML = "₿";
        totalReceivedCur.innerHTML = "₿";
        totalPaidCur.innerHTML = "₿";
        fee.innerHTML = 5;
    }

    return calcTotals();
}

function fixRecValues() {
    var type = document.getElementById("recmoneyselect").value;
    var amountFix = document.getElementById("recmoneyamount")
    if (amountFix.value.includes("e")) amountFix.value = parseFloat(amountFix.value).toFixed(8);
    var parts = amountFix.value.split(".");
    if (type == "nus" && parts[1] && parts[1].length > 8) amountFix.value = parseFloat(parseFloat(amountFix.value)?.toFixed(8));
    if (type == "sat" && parts[1] && parts[1].length > 4) amountFix.value = parseFloat(parseFloat(amountFix.value)?.toFixed(4));
}

function calcTotals() {
    var type = document.getElementById("sendmoneyfeetype").value;
    var amount = parseFloat(document.getElementById("sendmoneyamount").value) || 0;
    var fee = parseFloat(document.getElementById("sendmoneyfee").innerHTML);
    var totalPaid = document.getElementById("sendmoneytotalpaid");
    var totalReceived = document.getElementById("sendmoneytotal");

    if (type == "extra") {
        totalReceived.innerHTML = amount.toFixed(8).replace(/\.?0+$/, '');
        totalPaid.innerHTML = (amount + fee).toFixed(8).replace(/\.?0+$/, '');
    } else if (type == "part") {
        totalReceived.innerHTML = (amount - fee).toFixed(8).replace(/\.?0+$/, '');
        totalPaid.innerHTML = amount.toFixed(8).replace(/\.?0+$/, '');
    }

    return [parseFloat(totalReceived.innerHTML), parseFloat(totalPaid.innerHTML)];
}

console.log("profile loaded");