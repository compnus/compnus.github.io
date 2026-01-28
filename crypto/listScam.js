var FILTERID = null;

var LIST = [
    {
        name: "Test",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.bitgetimg.com%2FmultiLang%2Fweb%2F62e18cee66b35accc2bc058b443ebe34.png&f=1&nofb=1&ipt=3906f68d603756784f2c35345e24d61f662d7b519e652d1eb13211f48caa0827",
        short: "An actual wallet by the way! Spell Wallet not only holds your tokens and stakes them (SOL only), but also allows you to earn MANA and participate in Missions to earn money!",
        long: `Spell wallet allows you to <a class="link" onclick="popup('Token Staking in Spell Wallet', 'Sewat Wallet allows you to stake <b>Solana</b> from 0.001 SOL at up to 6.7% APY.')">hold and stake various tokens</a>, while also allowing you to collect MANA through mining, daily check-ins and quests and earn money (or more MANA) by participating in missions! You will be able to use MANA in the future to unlock airdrops!`,
        id: "test"
    }
];

function search(via) {
    via = via.toLowerCase().replace(/ /g, "_").trim();
    for (var i of document.getElementById("main").children) {
        i.style.display = "grid";
        if (!i.id.includes(via)) {
            i.style.display = "none";
            continue;
        }
    }
    if ([...document.getElementById("main").children].every(x => x.style.display === "none")) {
        let jmsg = document.getElementById("messagenone");
        jmsg.style.display = "block";
        var xc = "There are no apps that match your filters and/or search query.<br>"
    } else {
        document.getElementById("messagenone").style.display = "none";
    }
}

function load() {
    for (i of LIST) {
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
        document.getElementById("main").appendChild(cnt);
        DEFAULT.push(cnt);
    }
    var isid = GetURLParameter("id");
    if (isid) loadView(isid);
}

function loadView(iteid) {
    let item = LIST.find(obj => obj.id === iteid)
    popup(`<img src="${item.icon}" class="scamicon">`+item.name, `
    <p class="scamtext">${item.long}</p>
    <button class="fullwidth" onclick="navigator.clipboard.writeText('https://compnus.com/crypto/scam.html?id=${item.id}'); this.innerHTML='Copied!'; this.classList.add('disabled')">Copy Link to This App</button>
    <p style="margin: 0">
    `, true, true);
}