var FILTERID = "scam0";

var LISTS = [
    {
        name: "Perp100",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2FX1qkqxxxSD7krtTzrzGX9n1uy66bjVuuPSycNW20hpqN_bqd5QqfuREgyav65eywVEb1SAG8QBEcWjC0hNk9%3Dw280-h280&f=1&nofb=1&ipt=e68da0f674aa8cb2117f32837457210869e39bc5f72e400829c8186aa6f1c383",
        short: "You wake up and boom! The app is not what it quite used to be.",
        long: `This app used to be called Remint Network and was used to mine a real crypto token. One day, just when I personally was about to withdraw, it conveniently changed to AnyCard. All Remint tokens were lost that day. You would think that is the end but no - it went further - once I collected enough AnyCard Coins, I redeemed them for an airdrop reward (which hasn't arrived to this day) and boom! The app rebranded again into Perp100 and all AnyCard Coins were lost. Now it doesn't even state its purpose anymore, it just kind of exists and tries to get you to watch ads or purchase pointless VIP.`,
        id: "remint_perp",
        category: 1
    },
    {
        name: "WalletSweep",
        icon: "https://walletsweep.com/assets/walletsweep-logo-CZkN018i.png",
        short: "You wake up and boom! The app is not what it quite used to be.",
        long: `This app used to be called MineSwap (not to be cofused with <a class="link" href="viewNew.html?id=mineswap">Mineswap</a>) and promised mining free crypto. Once it was time for the withdrawal phase, the app suddenly changed to this with no explanation and all assets being lost. If that's not a scam then I don't know what is.`,
        id: "remint_walletsweep",
        category: 1
    },
    {
        name: "TON Miner",
        icon: "https://minitelegram.com/_next/image?url=https%3A%2F%2Fminitelegram-media.s3.eu-central-003.backblazeb2.com%2F3e38a1b6cf44c9f27552aa8422a6760a2e6a8afd-320x320.jpg&w=256&q=70",
        short: "When something seems too good to be true, it's probably a scam.",
        long: `This app is one of like a hundred apps built of the same template - free mining, want to withdraw? well deposit one TON to protect from bots. Oh! Oh no! Suddenly, it's impossible to log in! Oh shoot! So unfortunate!`,
        id: "minetonapp_",
        category: 1
    },
    {
        name: "NiTon Mining",
        icon: "https://static.nicegram.app/features/telegram_channel_icons/3db6bedf-62a1-40fa-9c7e-4e60885f56ee.jpeg",
        short: "When something seems too good to be true, it's probably a scam.",
        long: `This app is one of like a hundred apps built of the same template - free mining, want to withdraw? well deposit one TON to protect from bots. Oh! Oh no! Suddenly, it's impossible to log in! Oh shoot! So unfortunate!`,
        id: "nitonntonapp_",
        category: 1
    },
    {
        name: "BlueTon",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Feasy-peasy.ai%2Fcdn-cgi%2Fimage%2Fquality%3D80%2Cformat%3Dauto%2Cwidth%3D700%2Fhttps%3A%2F%2Fmedia.easy-peasy.ai%2F27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e%2Fdbadee08-c5a9-4e50-9ea6-ea81c85eaa09.png&f=1&nofb=1&ipt=cc0429e4433bc1f35237d9d2b15f4fe92aeb9fdf96df4fd2dff3d53df322e447",
        short: "When something seems too good to be true, it's probably a scam.",
        long: `This app is one of like a hundred apps built of the same template - free mining, want to withdraw? well deposit one TON to protect from bots. Oh! Oh no! Suddenly, it's impossible to log in! Oh shoot! So unfortunate!`,
        id: "bluertonapp_",
        category: 1
    },
    {
        name: "Fast Miner",
        icon: "https://minitelegram.com/_next/image?url=https%3A%2F%2Fminitelegram-media.s3.eu-central-003.backblazeb2.com%2F43427ce03ee84ddd274909c187837240b042aa5f-320x320.jpg&w=256&q=70",
        short: "Look at how fast your money leave your wallet!",
        long: `This app is one of like a hundred apps built of the same template - free mining, want to withdraw? well deposit one TON to protect from bots. Oh! Oh no! Suddenly, it's impossible to log in! Oh shoot! So unfortunate!`,
        id: "fastminerapp_",
        category: 1
    },
    {
        name: "Solanix App",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpublic.bnbstatic.com%2Fimage%2Fcms%2Fcrawler%2FWALLETINVESTOR_NEWS%2FBest_Telegram_Trading_Bots.webp&f=1&nofb=1&ipt=1520a71c7bd5e50c29a41de1bda578836b73ef6e7ca85d43e1cfe85a89baceda",
        short: "When something seems too good to be true, it's probably a scam.",
        long: `This app is one of like a hundred apps built of the same template - free mining, want to withdraw? well deposit one TON to protect from bots. Oh! Oh no! Suddenly, it's impossible to log in! Oh shoot! So unfortunate!`,
        id: "solanixapp_",
        category: 1
    },
    {
        name: "Qzino",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcoingape.com%2Fwp-content%2Fuploads%2F2024%2F03%2FQzino-square-logo-2.webp&f=1&nofb=1&ipt=72bb292163f9b9b9b53b8e8a06e71f41507e564e32822f8ade5ac6871929664d",
        short: "Now the casino may not be a scam, but the project that preceeded it definitely was.",
        long: `So basically, Qzino now is a casino/betting app. We are not sure whether it is a scam or legit, but that is completely besides the point. Before it was a casino, it used to be an app for rolling Telegram Gifts. After migration to the casino, all deposited TON, Stars and collected USDT vouchers disappeared and in order to get them back you must wager instane amounts of money. They also have this free spins thing? Where you can pay money to get free spins? The money does not get you anything only the spins. Why call them free? Anyway, in order to get the money you earned from free spins you must wager way more. Yeah it is only getting worse. The main point is: this app betrayed its early supporters.`,
        id: "qzino",
        category: 2
    },
    {
        name: "X-Market",
        icon: "https://x-market.io/LOGO/XMT-logo.png",
        short: "Make deposit their money and then turn the promised token into random leaderboard points worth nothing. Great job.",
        long: `X-Market used to be a regular mining app, you would mine the $AIX token, hoping it would launch on TON and you would make some money. Later it did launch - not as anyone expected it to, but it did. People could not only withdraw but also deposit. Later, it turned into the betting up we know and hate today. All the money you invested into it is gone, there is a new token that you need to pay to even get airdrop access... It might not be a scam, but after the past expierience? Yeah try to avoid it.`,
        id: "aix",
        category: 2
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
    },
    {
        name: "Epic Gift",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftehnoobzor.com%2Fwp-content%2Fuploads%2F2025%2F09%2Fepic-gift-280037.png&f=1&nofb=1&ipt=dd972d4467a08624a4e2e49fe97dea8e9fe3d3a992cf820a70842d422ddab2fe",
        short: "The red flags on this one are truly <i>epic</i>.",
        long: `Epic Gift presents itself as an app to get free Telegram Gifts. Eventually, you need to deposit stars to continue rolling free TON. And that would not really be an issue, after all, hazard aspect is not a red flag, but the fact this requirement appears when a withdrawable gist is just a roll or two away really makes you rethink your life choices. Now of course, there are other red flags such as a beautiful deposit button being shoved into your face while the withdraw button is nowhere to be found.`,
        id: "epicgiftbot",
        category: 2
    },
    {
        name: "&#1047;&#1074;&#1105;&#1079;&#1076;&#1099; &#1079;&#1072; &#1091;&#1084;",
        icon: "https://dbc.fmsnsr.xyz/api/files/1nlpavfhdos0lje/eg16g369pxxvadd/avatar_ho51om5tbe.jpg",
        short: "If you have any &#1091;&#1084;, you will know better than to waste your time with this one.",
        long: `Stars for intelligence (&#1047;&#1074;&#1105;&#1079;&#1076;&#1099; &#1079;&#1072; &#1091;&#1084;) is a bot that really tests your intelligence. Because if you keep going even after you have joined 100 scam groups, you might have none. This app allows you to get 99 Stars for solving math equations. The minimum withdrawal threshold is 100 Stars. So how do you get the last one? Well it is very simple my friend! Just join our group! Oh okay, so I did that what now? Oh you want more groups? Sure here are ten more groups to join. Okay I joined them, can I get my stars now? Oh, of course! Just join these ten new groups! You get the point.`,
        id: "zvjozdyzaum",
        category: 1
    },
    {
        name: "&#1047;&#1074;&#1077;&#1079;&#1076;&#1072;&#32;&#1087;&#1086;&#1076;&#32;&#1082;&#1085;&#1086;&#1087;&#1082;&#1086;&#1081;",
        icon: "https://dbc.fmsnsr.xyz/api/files/1nlpavfhdos0lje/i3hbl88gb8h6aj2/avatar_1hu3buiv07.jpg",
        short: "The only button you should press when interacting with this bot, is the delete and block button.",
        long: `Star under the button they said. The only thing hiding under the button are ads. Oh also, same situation as <a class="link" href="?id=zvjozdyzaum">Stars for intelligence</a>, you can never withdraw.`,
        id: "zvjezdapodknopkoj",
        category: 1
    },
    {
        name: "&#1047;&#1072;&#1073;&#1077;&#1088;&#1080;&#32;&#1087;&#1086;&#1076;&#1072;&#1088;&#1086;&#1082;",
        icon: "https://botstat.io/files/images/@tg_podarkov_bot_1770455348.jpg",
        short: "Yet another one of these 'get stars/gifts quickly' bots. Telegram is filled with these for some reason.",
        long: `Just read this, I refuse to write it multiple times: <a class="link" href="?id=zvjozdyzaum">Stars for intelligence</a>.`,
        id: "zaberipodarok",
        category: 1
    },
    {
        name: "kegli",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.DlI-A7D5siIRkmmbu9BBGgAAAA%3Fr%3D0%26pid%3DApi&f=1&ipt=c66abde8aed93623d95f102d8e01eea48fbf72be9666264dc5408fb2b395ce33",
        short: "Want some stars? Well too bad!",
        long: `Yet another one of those infinite ad loop holes like <a class="link" href="?id=zvjozdyzaum">Stars for intelligence</a>.`,
        id: "kegli",
        category: 1
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