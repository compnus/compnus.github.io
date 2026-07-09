async function loadWallet() {
    balance = await getBalance((await sb.auth.getSession()).data.session?.user.id);
    document.getElementById("walletnus").innerHTML = balance[0];
    document.getElementById("walletnoca").innerHTML = balance[1];
    document.getElementById("walletsats").innerHTML = balance[2];
    var pricebtc;
    await fetch('https://api.coinlore.net/api/ticker/?id=90').then(response => response.json()).then(json => json.forEach(x => { pricebtc = x.price_usd }));
    var pricebtcnew = (balance[2] * (pricebtc / 100000000)).toFixed(3);
    document.getElementById("bitcoinss").innerHTML = (balance[2] / 100000000).toFixed(8);
    document.getElementById("bitcoinpr").innerHTML = pricebtcnew;
}

async function refreshs(btc, ...nodes) {
    var nocavals = btc ? await getVariable("nocaforsat") : await getVariable("nocafornus");
    nodes[0].innerHTML = nocavals;
    nodes[1].innerHTML = parseFloat((nodes[2].value / nocavals).toFixed(4));
}

async function setMax(btc, ...nodes) {
    var bls = await getBalance((await sb.auth.getSession()).data.session?.user.id);
    var setting = btc ? bls[2] : bls[0];
    var nocavals = btc ? await getVariable("nocaforsat") : await getVariable("nocafornus");
    nodes[2].value = Math.floor(setting * nocavals) + ((setting * nocavals) - Math.floor(setting * nocavals) > 0.9995 ?1:0);

    refreshs(btc, ...nodes);
}

async function exchangeNocas(btc, amount, status) {
    status.innerHTML = "Please wait...";
    var uid = (await sb.auth.getSession()).data.session?.user.id;
    if (btc && (amount < 100)) { status.innerHTML = "Minimum exchange for Satoshis is 100 Nocas."; return; }
    else if (amount < 10) { status.innerHTML = "Minimum exchange for $NUS is 10 Nocas."; return; }
    var bls = await getBalance(uid);
    if (!bls) { status.innerHTML = "You need to be logged in to use this feature."; return; }
    bls = btc ? bls[2] : bls[0];
    var nocavals = btc ? await getVariable("nocaforsat") : await getVariable("nocafornus");
    if (parseFloat((amount / nocavals).toFixed(4)) > bls) { status.innerHTML = "Insufficient funds."; return; }
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/exchangeNocas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ uid: uid, btc: btc, amount: amount })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.sc) {
                status.innerHTML = "Error: " + data.response;
            } else {
                status.innerHTML = data.response;
                loadWallet();
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}

async function convertNocas(btc = false) {
    popup("Exchange Coin for Nocas",
        `
            <div class="flex cc"><p style="margin: 0; color: #ccc; font-style: italic">Current conversion rate:</p></div>
            <div class="flex cc"><p style="font-family: 'currencycompnus',Ubuntu !important; margin-top: 0">1 ${btc ? "&#8383;" : "$"} = <span id="amountrt">100</span> &curren;</p></div>
            <div class="input">
            <label for="amountnc">Nocas to receive:</label>
            <div class="halve">
            <input id="amountnc" type="number" step="1" oninput="refreshs(${btc}, document.getElementById('amountrt'), document.getElementById('amountpr'), document.getElementById('amountnc'));" min="${btc ? 100 : 10}" value="${btc ? 100 : 10}">
            <p onclick="setMax(${btc}, document.getElementById('amountrt'), document.getElementById('amountpr'), document.getElementById('amountnc'))" style="font-weight: bold; color: yellow; cursor: pointer;">MAX</button>
            </div></div>
            <div class="flex cc"><p style="font-family: 'currencycompnus',Ubuntu !important">Price: <span id="amountpr">0</span> ${btc ? "&#8383;" : "$"}</p></div>
            <p id="status" style="font-weight: bold;text-align:center"></p>
            <button class="fullwidth" onclick="exchangeNocas(${btc}, document.getElementById('amountnc').value, document.getElementById('status'))">Exchange</button>
            <p style="margin:0">
        `
    );

    await refreshs(btc, document.getElementById("amountrt"), document.getElementById("amountpr"), document.getElementById("amountnc"));
}

async function setMaxW(fee, num, passd) {
    var bls = await getBalance((await sb.auth.getSession()).data.session?.user.id);
    if (!bls) {
        location.href = "login.html";
        return;
    }
    bls = bls[2];
    var netw = document.getElementById("withdrawnetwork").value;
    if (netw === "spd") {
        if (bls < 12) {
            popup("Not Enough Satoshi!", "The minimum amount to withdraw (fee included) is 12 Satoshis.");
            return;
        }
        else if (bls < 103) num.value = bls - 2;
        else if (bls < 1004) num.value = bls - 3;
        else if (bls < 10005)  num.value = bls - 4;
        else num.value = 10000;
    }
    else if (netw === "lgn") {
        if (bls < 2100) {
            popup("Not Enough Satoshi!", "The minimum amount to withdraw (fee included) is 2100 Satoshis.<br>If you want to withdraw less, switch the network to Lightning (Speed Wallet) or Binance!");
            return;
        } else if (bls < 10100) num.value = bls - 100;
        else num.value = 10000;
    }
    else if (netw === "btc") {
        if (bls < 23000) {
            popup("Not Enough Satoshi!", "The minimum amount to withdraw (fee included) is 23000 Satoshis.<br>If you want to withdraw less, switch the network to Lightning or Binance!");
            return;
        } else if (bls < 1003000) num.value = bls - 3000;
        else num.value = 10000;
    } else if (netw === "bnb") {
        if (bls < 100) {
            popup("Not Enough Satoshi!", "The minimum amount to withdraw is 100 Satoshis.<br>If you want to withdraw less, switch the network to Lightning (Speed Wallet)!");
            return;
        } else num.value = Math.min(100000000, bls);
    }
    updateFee(num, fee, passd);
}

function updateFee(num, onNode, dedc) {
    var netw = document.getElementById("withdrawnetwork").value;
    numv = parseInt(num.value);
    if (netw === "spd") {
        if (!numv || numv < 10) numv = 10;
        if (numv > 10000) numv = 10000;
        onNode.innerHTML = String(numv).length;
        dedc.innerHTML = numv + String(numv).length;
    }
    else if (netw === "lgn") {
        if (!numv || numv < 2000) numv = 2000;
        if (numv > 10000) numv = 10000;
        dedc.innerHTML = numv + 100;
    } else if (netw === "btc") {
        if (!numv || numv < 20000) numv = 20000;
        if (numv > 1000000) numv = 1000000;
        dedc.innerHTML = numv + 3000;
    } else if (netw === "bnb") {
        if (!numv || numv < 100) numv = 100;
        if (numv > 100000000) numv = 100000000;
        dedc.innerHTML = numv;
    }
    
    num.value = numv;
}

function updateNetwork(to) {
    var nodes = [document.getElementById("wnspd"), document.getElementById("wnlgn"), document.getElementById("wnbtc"), document.getElementById("wnbnb")];
    var mn = document.getElementById("wtminimum");
    var mx = document.getElementById("wtmaximum");
    var fee = document.getElementById("withdrawfee");
    var amount = document.getElementById("withdrawamount");
    var spad = document.getElementById("speedad");
    var bnad = document.getElementById("binancead");
    var ded = document.getElementById('withdrawdeduct');
    for (i of nodes) i.style.display = "none";
    spad.style.display = "none";
    bnad.style.display = "none";
    if (to === "spd") {
        mn.innerHTML = "10";
        mx.innerHTML = "10000";
        fee.innerHTML = "2";
        amount.min = 10;
        amount.max = 10000;
        spad.style.display = "grid";
        nodes[0].style.display = "flex";
    } else if (to === "lgn") {
        mn.innerHTML = "2000";
        mx.innerHTML = "10000";
        fee.innerHTML = "100";
        amount.min = 2000;
        amount.max = 100000;
        nodes[1].style.display = "flex";
    } else if (to === "btc") {
        mn.innerHTML = "20000";
        mx.innerHTML = "1000000";
        fee.innerHTML = "3000";
        amount.min = 20000;
        amount.max = 1000000;
        nodes[2].style.display = "flex";
    } else if (to === "bnb") {
        mn.innerHTML = "100";
        mx.innerHTML = "100000000";
        fee.innerHTML = "0";
        amount.min = 100;
        amount.max = 100000000;
        bnad.style.display = "grid";
        nodes[3].style.display = "flex";
    }
    updateFee(amount, fee, ded);
}

async function finalizeWithdraw(amount, network, status) {
    var address = document.getElementById("withdrawaddress" + network).value;
    amount = parseInt(amount);
    status.innerHTML = "Please wait...";
    if (!address) {
        if ((network === "spd") || (network === "btc")) status.innerHTML = "Please enter a valid address.";
        if (network === "lgn") status.innerHTML = "Please enter a valid invoice.";
        if (network === "bnb") status.innerHTML = "Please enter a valid Binance ID.";
        return;
    }
    if ((network === "spd") && ((address.includes("@speed.app") && !/[0-9A-Za-z\._]+/.test(address.substring(0, address.length - 10))) || !/[0-9A-Za-z\._]+/.test(address))) {
        status.innerHTML = "Please enter a valid Speed Wallet address.";
        return;
    }
    if ((network === "lgn") && !address.startsWith("lnbc")) {
        status.innerHTML = "Please enter a valid invoice.";
        return;
    }
    if ((network === "bnb") && !/^\d+$/.test(address)) {
        status.innerHTML = "Please enter a valid Binance ID.";
        return;
    }

    if ((network === "spd" && ((amount < 10) || (amount > 10000))) || (network === "lgn" && ((amount < 2000) || (amount > 10000))) || (network === "btc" && ((amount < 20000) || (amount > 1000000))) || (network === "bnb" && ((amount < 100) || (amount > 100000000)))) {
        status.innerHTML = "Please enter a valid amount.";
    }

    var bls = await getBalance((await sb.auth.getSession()).data.session?.user.id);
    if (!bls) {
        location.href = "login.html";
        return;
    }
    bls = bls[2];

    var fee = 0;
    if (network === "spd") fee = amount.length;
    if (network === "lgn") fee = 100;
    if (network === "btc") fee = 3000;

    if (bls < (amount + fee)) {
        status.innerHTML = "Insufficient funds."
        return;
    }

    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/withdrawRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ uid: (await sb.auth.getSession()).data.session?.user.id, network: network, amount: amount, address: address })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.sc) {
                status.innerHTML = "Error: " + data.response;
            } else {
                status.innerHTML = data.response;
                loadWallet();
            }
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}

function withdraw() {
    popup("Withdraw Bitcoin Satoshi",
        `
    <div class="input">
    <label for="withdrawnetwork">Network:</label>
    <select id="withdrawnetwork" onchange="updateNetwork(this.value)" style="width:100%">
    <option value="spd">Lightning (Speed Wallet)</option>
    <option value="lgn">Lightning (Other)</option>
    <option value="btc">Bitcoin</option>
    <option value="bnb">Binance</option>
    </select>
    </div>

    <div id="speedad" class="promobannerad" onclick="window.open('/promo/speed.html', '_blank')">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2FaYGRdyHW07ic-jZf8xyeYg34x-Br9Ya7aUg6vFgA-zYtNmv8R7pOWSTl-i2bW2GwRA&f=1&nofb=1&ipt=b7637308ff3bee0fb8895fbae06a4c7192e110b46463ef95d0764474d5dac6f5">
    <div>
    <h1>Bitcoin at the speed of light.</h1>
    <p>Use Speed Wallet to store your Satoshis, and get 500 <span title="Satoshis">SATS</span> for free!<br>Click "Learn More" to claim this offer!</p>
    </div>
    <button>LEARN MORE</button>
    </div>

    <div id="binancead" style="display:none" class="promobannerad" onclick="window.open('/promo/binance.html', '_blank')">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Factufinance.fr%2Fwp-content%2Fuploads%2F2020%2F08%2Fbinance.png&f=1&nofb=1&ipt=80c76507bb6ef5fd2efb02a1c47005a6c935bd1c733a9b37fcc6f5314b160f45">
    <div>
    <h1>Withdraw and trade without fees.</h1>
    <p>Trade with Binance and get 10% back on Spot and Futures trading!<br>Click "Learn More" to claim this offer!</p>
    </div>
    <button>LEARN MORE</button>
    </div>

    <p>
    Minimum Withdrawal: <span id="wtminimum">10</span> Satoshis<br>
    Maximum Withdrawal: <span id="wtmaximum">10000</span> Satoshis<br>
    Network Fee: <span id="withdrawfee">2</span> Satoshis</p>
    <div class="input">
    <label for="withdrawamount">Amount to Withdraw:</label>
    <div class="halve">
    <input id="withdrawamount" type="number" step="1" min="10" max="10000" oninput="updateFee(this, document.getElementById('withdrawfee'), document.getElementById('withdrawdeduct'))" value="10">
    <p onclick="setMaxW(document.getElementById('withdrawfee'), document.getElementById('withdrawamount'), document.getElementById('withdrawdeduct'))" style="font-weight: bold; color: yellow; cursor: pointer;">MAX</button>
    </div>
    </div>
    <div class="input" id="wnspd">
    <label for="withdrawaddressspd">Speed Wallet Address:</label>
    <input id="withdrawaddressspd" type="text" placeholder="johndoe@speed.app">
    </div>
    <div class="input" id="wnlgn" style="display:none">
    <label for="withdrawaddresslgn">Lightning Invoice:</label>
    <div class="halve">
    <input id="withdrawaddresslgn" type="text" placeholder="lnbc1500n1pw9q5g0pp5g0g0g0g0g0g0g0g0g0g0g0g">
    <button onclick="popup('Lightning Invoice','Do not make the invoice contain a set amount of money to withdraw!<br>Doing so may result in your transaction being rejected.')">?</button>
    </div></div>
    <div class="input" id="wnbtc" style="display:none">
    <label for="withdrawaddressbtc">Bitcoin Address:</label>
    <input id="withdrawaddressbtc" type="text" placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa">
    </div>
    <div class="input" id="wnbnb" style="display:none">
    <label for="withdrawaddressbnb">Binance ID:</label>
    <input id="withdrawaddressbnb" type="text" placeholder="12345678">
    </div>
    <p>Total to be deducted from your wallet: <span id="withdrawdeduct" style="font-weight: bold">12</span> Satoshis</p>
    <p style="color: #ccc; text-align: center;">Withdrawals are processed manually.<br>If you don't receive your Satoshis within 7 days, please contact the support.<br>
    If your withdrawal gets rejected, you will be fully refunded (fee included).</p>
    <p id="withdrawstatus" style="font-weight: bold;text-align:center"></p>
    <button class="fullwidth" onclick="finalizeWithdraw(document.getElementById('withdrawamount').value, document.getElementById('withdrawnetwork').value, document.getElementById('withdrawstatus'))">Request Withdrawal</button>
    <p style="margin:0">
        `
    );
}

function ttloadTransactions(to) {
    let list = null;
    let view = document.getElementById("ttl_list");
    if (to === "in") list = incomingt;
    else if (to === "out") list = outgoingt;
    else view.innerHTML = `<p style="text-align: center" id="ttl_status">Unknown transaction type.</p>`;
    view.innerHTML = "";
    for (i of list) {
        var x = document.createElement("div");
        x.classList.add("ttview");
        x.innerHTML = `
        <p>Transaction <span title="Transaction ID (TID)">${i.id}</span><span class="ttlmobnn">&emsp;&emsp;</span><br class="mobileonlytt" />Sent <span>${formatDate(i.created)}</span></p>
        <div class="flex cc"><p>Sender: <span>${i.from}</span></p><p>&emsp;</p><p>Recipient: <span>${i.to}</span></p></div>
        <div class="ttvgrid">
            <div class="ttvgridl">
                <h2>Message:</h2><h3>${i.message.length > 0 ? i.message : "<i style='color: #ccc;'>No message.</i>"}</h3>
            </div>
            <div class="ttvgridr">
                <h2>Assets transferred:</h2>
                <div id="ttv_${i.id}">
                    <p>Please wait while we load transaction details...</p>
                </div>
            </div>
        </div>`;
        view.appendChild(x);
        fillResources(document.getElementById(`ttv_${i.id}`), i.resource);
    }
    if (view.innerHTML === "") view.innerHTML = `<p style="text-align: center" id="ttl_status">No transactions found.</p>`;
}

const RESOURCE = {
    "nus": ["$NUS", "/site/image/logo/currency.svg", 0],
    "noca": ["Noca", "/site/image/logo/noca.svg", 1],
    "sat": ["Satoshi", "/site/image/logo/sats.svg", 1],
}
function resolveResource(id) {
    var x = RESOURCE[id];
    if (x) return {name: x[0], icon: x[1], config: x[2]};
    else return { name: "Unknown Resource "+id, icon: "https://img.icons8.com/?size=100&id=85965&format=png&color=FFFFFF", config: 1};
}

function fillResources(div, data) {
    div.innerHTML = "";
    for (var res in data) {
        var x = document.createElement("div");
        x.classList.add("ttv_res_obj");
        const { name, icon, config } = resolveResource(res);
        x.innerHTML = `
            <img src="${icon}">
            <p>${data[res]}</p>
        `;
        x.title = `${data[res]} ${name}${config===1?(data[res]!==1?"s":""):""}`;
        div.appendChild(x);
    }
    if (div.innerHTML === "") div.innerHTML = "<p style='text-align:right; margin:0'><i style='color: #ccc;'>No assets were transferred.</i></p>";
}

async function ttforceload(id) {
    const { user, data } = await getUser();
    if (!user) {
        document.getElementById("ttlist").innerHTML = "<p style='text-align:center'>You must be logged in to view your transactions.</p><h2 style='text-align:center'><a class='link' href='login.html'><b>Login</b></a></h2>";
        return;
    }
    document.getElementById("ttl_refresh").classList.add("disabled");
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/viewTransaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await sb.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ action: id === "in" ? 2 : 3, data: "" })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response !== "0") document.getElementById("ttl_status").innerHTML = data.response;
        else {
            if (id == "in") {
                incomingt = data.data;
                ttloadTransactions("in");
            } else if (id == "out") {
                outgoingt = data.data;
                ttloadTransactions("out");
            }
        }
    })
    .catch((error) => {
        console.error('Error invoking function:', error);
    });
    document.getElementById("ttl_refresh").classList.remove("disabled");
}

async function ttload(id) {
    document.getElementById("ttverify").style.display = "none";
    document.getElementById("ttlist").style.display = "none";
    document.getElementById("ttreport").style.display = "none";
    if (id == "up") {
        document.getElementById("ttverify").style.display = "block";
        document.getElementById("ttveri").innerHTML = "Information about the transaction will appear here.";
        document.getElementById("ttveri").style.display = "block";
        document.getElementById("ttverf").style.display = "none";
    } else if (id == "rep") {
        document.getElementById("ttreport").style.display = "block";
        document.getElementById("ttrep").innerHTML = "Please fetch the transaction you want to report to proceed.";
        document.getElementById("ttrep").style.display = "block";
        document.getElementById("ttrepv").style.display = "none";
        document.getElementById("reportingform").style.display = "none";
        document.getElementById("ttverfbutton").classList.remove("disabled");
        document.getElementById("trid").classList.remove("disabled");
        document.getElementById("trid").value = "";
    } else {
        document.getElementById("ttlist").style.display = "block";
        const { user, data } = await getUser();
        if (!user) {
            document.getElementById("ttlist").innerHTML = "<p style='text-align:center'>You must be logged in to view your transactions.</p><h2 style='text-align:center'><a class='link' href='login.html'><b>Login</b></a></h2>";
            return;
        } else {
            document.getElementById("ttl_list").innerHTML = `<p style='text-align:center' id="ttl_status">Loading transactions...</p>`;
            if (id == "in" && incomingt.length > 0) ttloadTransactions("in");
            else if (id == "out" && outgoingt.length > 0) ttloadTransactions("out");
            else await ttforceload(id);
        }
    }
}

function formatDate(udf) {
    function getOrdinal(day) {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }
    const date = new Date(udf);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-GB", {
        month: "long",
        timeZone: "UTC",
    });
    const year = date.getUTCFullYear();
    return `${day}${getOrdinal(day)} ${month} ${year}`;
}

async function verifyTID(tid) {
    var status = document.getElementById("ttveri");
    var view = document.getElementById("ttverf");
    var assets = document.getElementById("ttv_res");
    status.style.display = "block";
    view.style.display = "none";
    assets.innerHTML = "";
    if (!tid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) status.innerHTML = "Invalid TID format.";
    else {
        status.innerHTML = "Please wait...";
        document.getElementById("ttverfbutton").classList.add("disabled");
        document.getElementById("ttid").classList.add("disabled");
        await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/viewTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ action: 1, data: tid })
        }).then(response => response.json())
        .then(data => {
            if (data.response === '0') {
                status.style.display = "none";
                view.style.display = "block";
                document.getElementById("ttv_id").innerHTML = data.data.id;
                document.getElementById("ttv_date").innerHTML = formatDate(data.data.created);
                document.getElementById("ttv_from").innerHTML = data.data.from;
                document.getElementById("ttv_to").innerHTML = data.data.to;
                document.getElementById("ttv_mes").innerHTML = data.data.message || "<i style='color: #ccc;'>No message.</i>";
                fillResources(assets, data.data.resource);
                document.getElementById("ttid").value = "";
            } else status.innerHTML = data.response;
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
            status.innerHTML = "Something went wrong.";
        });
    }
    document.getElementById("ttverfbutton").classList.remove("disabled");
    document.getElementById("ttid").classList.remove("disabled");
}

async function fetchTID(tid) {
    var status = document.getElementById("ttrep");
    var view = document.getElementById("ttrepv");
    status.style.display = "block";
    view.style.display = "none";
    if (!tid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        status.innerHTML = `Invalid TID format.<br>Are you sure you did not mean to <a onclick="document.getElementById('tselect').value = 'up';ttload('up');" class="link">verify</a> a transaction instead?`;
        return;
    }
    const { user, data } = await getUser();
    if (!user) status.innerHTML = `<p style='text-align:center'>You must be logged in to report transactions.</p><h2 style='text-align:center'><a class='link' href='login.html'><b>Login</b></a></h2><br><br>Maybe you meant to <a onclick="document.getElementById('tselect').value = 'up';ttload('up');document.getElementById('ttid').value = '${tid}';verifyTID('${tid}');" class="link">verify</a> a transaction instead?`;
    else {
        status.innerHTML = "Please wait...";
        document.getElementById("ttrepbutton").classList.add("disabled");
        document.getElementById("trid").classList.add("disabled");
        await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/viewTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ action: 1, data: tid })
        }).then(response => response.json())
            .then(data => {
                if (data.response === '0') {
                    status.style.display = "none";
                    view.style.display = "block";
                    document.getElementById("ttr_from").innerHTML = data.data.from;
                    document.getElementById("ttr_to").innerHTML = data.data.to;
                    document.getElementById("ttr_mes").innerHTML = data.data.message || "<i style='color: #ccc;'>No message.</i>";
                    document.getElementById("ttr_cc").innerHTML = Object.keys(data.data.resource).length || 0;
                    document.getElementById("reportingform").style.display = "block";
                } else {
                    status.innerHTML = data.response + `<br><br>Maybe you meant to <a onclick="document.getElementById('tselect').value = 'up';ttload('up');document.getElementById('ttid').value = '${tid}';verifyTID('${tid}');" class="link">verify</a> a transaction instead?`;
                    document.getElementById("ttrepbutton").classList.remove("disabled");
                    document.getElementById("trid").classList.remove("disabled");
                }
            })
            .catch((error) => {
                console.error('Error invoking function:', error);
                status.innerHTML = "Something went wrong.";
                document.getElementById("ttrepbutton").classList.remove("disabled");
                document.getElementById("trid").classList.remove("disabled");
            });
    }
}

async function blockUser(username) {
    let { user, data } = getUser();
    if (!user) window.location.href = "login.html";
    const { data: nameData, error: nameError } = await sb
        .from("users")
        .select("username")
        .eq("id", dt.user_id)
        .single();
    if (username == "CompNUS") {
        popup("Cannot block CompNUS!", "This is a system transaction. If you still think this transaction should be reported, please contact the support.");
    } else if (username == nameData.username) {
        popup("Cannot block yourself!", "You cannot block yourself. If you still think this transaction should be reported, please contact the support.");
    } else
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
    if (authError) { document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201); popup("An error occurred.", authError.message); return; }
    const { data, error } = await sb.from("users").select("blocked_users").eq("id", user.id).single();
    if (error) { document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201); popup("An error occurred.", error.message); return; }
    if (data.blocked_users.startsWith(username + "|") || data.blocked_users.endsWith("|" + username) || data.blocked_users.includes("|" + username + "|")) {
        document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201);
        popup("You have already blocked " + username + "!", "This user is already blocked. You cannot block them again.<br>You can try blocking them IRL. Dunno how that would work tho...");
        return;
    }
    const { data: finalize, error: finalizeError } = await sb.from("users").update({ blocked_users: data.blocked_users + username + "|" }).eq("id", user.id).single();
    if (finalizeError) { document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201); popup("An error occurred.", authError.message); return; }
    else {
        document.getElementById('popup' + stableID).style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('popup' + stableID)), 201);
        popup("You have blocked " + username + "!", "You will no longer receive messages from this user.<br>To unblock them, go to the Edit Account page.");
    }
}

function checkUUID(of) {
    document.getElementById("ttveri").innerHTML = "Information about the transaction will appear here.";
    if (of.length > 36) of = of.substring(0, 36);
    of = of.toLowerCase();
    return of.replaceAll(/[^0-9a-f-]/g, '');
}

function reportTT() {
    let tid = document.getElementById("trid").value;
    let type = document.getElementById("ttr_type").value;
    let mes = document.getElementById("ttr_details").value.trim();
    let status = document.getElementById("ttr_status");
    if (!tid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        status.innerHTML = "The fetched transaction is invalid. Please try fetching again.";
        document.getElementById("ttverfbutton").classList.remove("disabled");
        document.getElementById("trid").classList.remove("disabled");
    }
}