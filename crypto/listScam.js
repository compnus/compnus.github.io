var FILTERID = "scam0";

var LISTS = [
    {
        name: "Test",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.bitgetimg.com%2FmultiLang%2Fweb%2F62e18cee66b35accc2bc058b443ebe34.png&f=1&nofb=1&ipt=3906f68d603756784f2c35345e24d61f662d7b519e652d1eb13211f48caa0827",
        short: "An actual wallet by the way! Spell Wallet not only holds your tokens and stakes them (SOL only), but also allows you to earn MANA and participate in Missions to earn money!",
        long: `Spell wallet allows you to <a class="link" onclick="popup('Token Staking in Spell Wallet', 'Sewat Wallet allows you to stake <b>Solana</b> from 0.001 SOL at up to 6.7% APY.')">hold and stake various tokens</a>, while also allowing you to collect MANA through mining, daily check-ins and quests and earn money (or more MANA) by participating in missions! You will be able to use MANA in the future to unlock airdrops!`,
        id: "test",
        category: 1
    },
    {
        name: "SpinFi",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F017%2F222%2F025%2Fsmall_2x%2Fspinning-fortune-wheel-lucky-roulette-online-promotion-events-png.png&f=1&nofb=1&ipt=70d40684a96846f7be0e03130bea179af1074b5f5e3173df16e6cc66ca196130",
        short: "It takes about 300 days to withdraw 0.02$.",
        long: `This app promises 300$. In reality it will take you 300 days to withdraw the single most abysmal and ridiculous amount of money. Basically, you can get 0.01$ in TON relatively quick for coins - which you can get efficiently by playing BitGame, and after about 300 days you will reach the 300$ withdrawal threshold which will only allow you to withdraw 0.01$ in TON. In order to withdraw more, the developers need to manually process your withdrawal, which will never happen. So really, the only reason this is in the "Not Worth Your Time" category is because you can technically earn money. 0.02$. If it's worth wasting your time at, by all means, go for it. Just do not purchase gems. That's the real scam here.`,
        id: "spinfi",
        category: 3
    },
    {
        name: "BitGame",
        icon: "https://www.bitgame.fun/favicon/apple-touch-icon.png",
        short: "The withdraw option literally does not work. But yeah depositing works just fine!",
        long: `As much as this game is not that bad for a game - yes it gets boring after some time, but there is some charm - this app presents itself as a way to get money, which is certainly not possible. Basically you earn Miner Coins, which can be exchanged for $MINER crypto (or at least, it should be possible) which you can then withdraw as USDT. The only detail and perhaps an issue is that: it does not work? Attempting to exchange Miner Coins for $MINER yields a message saying "not enough gems", which makes no sense because there is no information about you needing gems to exchange. We messaged the official support about this and, as you could have guessed, we got no response. It has been over a year since we sent the email. That is another reason to think this app is a scam.`,
        id: "bitgame",
        category: 2
    }
];

function search(via) {
    via = via.toLowerCase().replace(/ /g, "_").trim();
    for (var i of document.getElementById("main").children) {
        i.style.display = "grid";
        if (!i.id.includes(via) || (FILTERID != "scam0" && !i.classList.contains("cat-"+FILTERID))) {
            i.style.display = "none";
            continue;
        }
    }
    if ([...document.getElementById("main").children].every(x => x.style.display === "none")) {
        let jmsg = document.getElementById("messagenone");
        jmsg.style.display = "block";
    } else {
        document.getElementById("messagenone").style.display = "none";
    }
}

function scamFilter(cat) {
    FILTERID = "scam"+cat;
    search(document.getElementById('searchbarinput').value);
}

function load() {
    for (i of LISTS) {
        let cnt = document.createElement("div");
        cnt.classList.add("scamitem");
        cnt.innerHTML = `<div>
        <img src="${i.icon}" alt="${i.name} icon" class="icon">
        <h1>${i.name}</h1>
        </div>
        <p>${i.short}</p>
        `;

        cnt.id = `${i.id}___${i.name.replace(/ /g, "_").replace("#", "hash").toLowerCase()}`;
        cnt.setAttribute("onclick", "loadView('" + i.id + "')");
        cnt.classList.add("cat-scam" + i.category);
        if (i.category == 2) cnt.style.borderColor = "orange";
        else if (i.category == 3) cnt.style.borderColor = "lightblue";
        document.getElementById("main").appendChild(cnt);
        DEFAULT.push(cnt);
    }
    var isid = GetURLParameter("id");
    if (isid) loadView(isid);
}

function loadView(iteid) {
    let item = LISTS.find(obj => obj.id === iteid)
    popup(`<img src="${item.icon}" class="scamicon">`+item.name, `
    <p class="scamtext">${item.long}</p>
    <button class="fullwidth" onclick="navigator.clipboard.writeText('https://compnus.com/crypto/scam.html?id=${item.id}'); this.innerHTML='Copied!'; this.classList.add('disabled')">Copy Link to This App</button>
    <p style="margin: 0">
    `, true, true);
}