async function loadWallet() {
    balance = await getBalance((await supabase.auth.getSession()).data.session?.user.id);
    document.getElementById("walletnus").innerHTML = balance[0];
    document.getElementById("walletnoca").innerHTML = balance[1];
    document.getElementById("walletsats").innerHTML = balance[2];
    var pricebtc;
    await fetch('https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=BTC-USD').then(response => response.json()).then(json => { pricebtc = json.Data["BTC-USD"].VALUE });
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
    var bls = await getBalance((await supabase.auth.getSession()).data.session?.user.id);
    var setting = btc ? bls[2] : bls[0];
    var nocavals = btc ? await getVariable("nocaforsat") : await getVariable("nocafornus");
    nodes[2].value = Math.floor(setting * nocavals) + ((setting * nocavals) - Math.floor(setting * nocavals) > 0.9995 ?1:0);

    refreshs(btc, ...nodes);
}

async function exchangeNocas(btc, amount, status) {
    status.innerHTML = "Please wait...";
    var uid = (await supabase.auth.getSession()).data.session?.user.id;
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
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
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
    var bls = await getBalance((await supabase.auth.getSession()).data.session?.user.id);
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
        spad.style.display = "block";
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
        bnad.style.display = "block";
        nodes[3].style.display = "flex";
    }
    updateFee(amount, fee, ded);
}

async function finalizeWithdraw(amount, network, status) {
    var address = document.getElementById("withdrawaddress" + network).value;
    status.innerHTML = "Please wait...";
    if (!address || !address.value) {
        if ((network === "spd") || (network === "btc")) status.innerHTML = "Please enter a valid address.";
        if (network === "lgn") status.innerHTML = "Please enter a valid invoice.";
        if ((network === "bnb")(/^\d+$/.test(address))) status.innerHTML = "Please enter a valid Binance ID.";
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

    var bls = await getBalance((await supabase.auth.getSession()).data.session?.user.id);
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
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ uid: (await supabase.auth.getSession()).data.session?.user.id, network: network, amount: amount, address: address })
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

    <div id="speedad">
    < speed wallet ad >
    </div>

    <div id="binancead" style="display:none">
    < binance ad >
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