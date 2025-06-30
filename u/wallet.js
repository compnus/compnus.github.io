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
    nodes[2].value = Math.floor(setting * nocavals) >= nodes[2].min ? Math.floor(setting * nocavals) : nodes[2].min;

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
    if (amount / nocavals > bls) { status.innerHTML = "Insufficient funds."; return; }
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
                console.log(data.obj);
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

function withdraw() {

}