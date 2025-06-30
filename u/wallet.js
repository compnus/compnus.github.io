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

async function convertNocas(btc = false) {
    var nocavals = btc ? await getVariable("nocaforsat") : await getVariable("nocafornus");
    popup("Exchange Coin for Nocas",
        `
            <div class="flex cc"><p style="font-family: 'currencycompnus',Ubuntu !important">1 ${btc ? "&#8383;" : "$"} = ${nocavals} &curren;</p></div>
        `
    );
}

function withdraw() {

}