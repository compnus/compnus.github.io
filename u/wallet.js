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
    nodes[2].value = Math.floor(setting*nocavals) || 0;

    refreshs(btc, ...nodes);
}

async function convertNocas(btc = false) {
    popup("Exchange Coin for Nocas",
        `
            <div class="flex cc"><p style="font-family: 'currencycompnus',Ubuntu !important">1 ${btc ? "&#8383;" : "$"} = <span id="amountrt">100</span> &curren;</p></div>
            <div class="flex cc"><p style="margin-top: 0; color: #ccc">This is the current conversion rate.</p></div>
            <br>
            <div class="input">
            <label for="amountnc">Nocas to receive:</label>
            <div class="halve">
            <input id="amountnc" type="number" min="0" step="1" oninput="refreshs(${btc}, document.getElementById('amountrt'), document.getElementById('amountpr'), document.getElementById('amountnc'));" value="0">
            <p onclick="setMax(${btc}, document.getElementById('amountrt'), document.getElementById('amountpr'), document.getElementById('amountnc'))" style="font-weight: bold; color: yellow; cursor: pointer;">MAX</button>
            </div></div>
            <div class="flex cc"><p style="font-family: 'currencycompnus',Ubuntu !important">Price: <span id="amountpr">0</span> ${btc ? "&#8383;" : "$"}</p></div>
            <button class="fullwidth">Exchange</button>
            <p style="margin:0">
        `
    );

    await refreshs(btc, document.getElementById("amountrt"), document.getElementById("amountpr"), document.getElementById("amountnc"));
}

function withdraw() {

}