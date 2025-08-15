LIST = [
    {
        name: "test",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fminingcombo.com%2Fwp-content%2Fuploads%2F2025%2F03%2Fhash-mate-logo.webp&f=1&nofb=1&ipt=32321a8cf968e78d8752d064e51501960af68a10b2c1625adee8d234decf24dc",
        description: "test app",
        added: "7-16-2024",
        id: "testapp",
        attr: {
            platform: "t",
            type: "mine",
            coin: "testcoin",
            effort: 0,
            rating: 5
        },
        info: {
            description: "peaking of the marketplace, you can purchase and sell miners to complete collections and get mining boosts!",
            effort: "Everything you have to do is to start mining every 20 hours. It doesn't get simpler than that!"
        },
        go: {
            type: 0,
            link: "https://t.me/hashmate_bot?start=8f86ot00"
        },
        benefits: ["Free miner to help you get started"],
        features: [["Offline Mining of Your Chosen Currency", "You can choose a currency to mine and for the next 20 hours you will be mining it completely effort-free!"],
        ["#Marketplace", "Buy and sell Limited Miners and Cases to maximize your earnings!"],
        ["NFT and Case Drops", "While mining, there is a small chance you will get free cases or NFTs!"],
        ["#Tasks", "Daily, General and Partner tasks reward you with MATE coin, which can be used to purchase miners!"]
        ],
        tips: [["Periodically collect your loot!", "Collect your loot after you wake up and before you go to sleep. This will reset the 20 hour timer, making you never stop mining!"]
        ],
        pros: ["Daily tasks allowing you to get free $MATE, which can be used to buy miners", "Free NFTs and Cases", "Active developer team, frequent updates and events", "Helpful notification service", "No ads", "Fast withdrawals"],
        cons: ["Relatively high withdrawal fee (0.1 TON, 35 STARS, ...)", "Cases require a key to open, which must be purchased with TON", "Pay-to-Win aspect with x50 block reward costing STARS to unlock", "The app has many little bugs that altogether can make the app tedious to use"],
        banner: "bin"
    }
];

FILTERS = {
    pf: {
        web: false,
        android: false,
        ios: false,
        telegram: false
    },
    type: {
        mine: false,
        p2e: false,
        ad: false,
        other: false
    },
    effort: {
        no: false,
        low: false,
        medium: false,
        high: false
    },
    rating: {
        lowest: false,
        low: false,
        medium: false,
        high: false,
        highest: false
    }
}

function search(via) {
    for (var i of document.getElementById("main").children) {
        i.style.display = "grid";
        if (!i.id.includes(via)) {
            i.style.display = "none";
            continue;
        }
        if (allFiltersFalse()) continue;
        let b = false;
        let c = false;
        let e = false;
        let f = false;

        let feat = false;
        let divd = false;

        let individuals = {
            b: individualFiltersFalse("pf"),
            c: individualFiltersFalse("type"),
            e: individualFiltersFalse("effort"),
            f: individualFiltersFalse("rating")
        }
        for (j of i.classList) {
            if (individuals.b) b = true;
            else if (FILTERS.pf[j.substring(3)]) b = true;
            if (individuals.c) c = true;
            else if (j.startsWith("ft") && FILTERS.type[j.substring(5)]) c = true;
            if (individuals.d) d = true;
            else if (j.startsWith("fc") && FILTERS.coin[j.substring(5)]) d = true;
            if (individuals.e) e = true;
            else if (j.startsWith("fe") && FILTERS.effort[j.substring(7)]) e = true;
            if (individuals.f) f = true;
            else if (j.startsWith("fr") && FILTERS.rating[j.substring(7)]) f = true;
        }
        if (FILTERS.main.featured && !feat) a.x = false;
        if (FILTERS.main.dividend && !divd) a.y = false;
        if (!(b && c && e && f)) i.style.display = "none";

    }
    if ([...document.getElementById("main").children].every(x => x.style.display === "none")) {
        let jmsg = document.getElementById("messagenone");
        jmsg.style.display = "block";
        var xc = "There are no apps that match your filters and/or search query.<br>"
        jmsg.innerHTML = xc;
    } else {
        document.getElementById("messagenone").style.display = "none";
    }
}

function load() {
    for (i of LIST) {
        if (i.unlisted) continue;
        let cnt = document.createElement("div");
        cnt.classList.add("mainitem");
        cnt.innerHTML = `
        <img src="${i.icon}" alt="${i.name} icon" class="icon">
        <div>
            <h1>${i.name}</h1>
            <p>${i.description}</p>
        </div>
        `;
        let atr = document.createElement("div");
        atr.classList.add("attr");
        let platform = document.createElement("div");
        for (j of i.attr.platform) {
            var x = document.createElement("img");
            if (j === "w") {
                x.src = "https://img.icons8.com/?size=100&id=89777&format=png&color=FFFFFF";
                x.title = "Web";
            }
            if (j === "a") {
                x.src = "https://img.icons8.com/?size=100&id=86306&format=png&color=FFFFFF";
                x.title = "Android";
            }
            if (j === "i") {
                x.src = "https://img.icons8.com/?size=100&id=30840&format=png&color=FFFFFF";
                x.title = "iOS";
            }
            if (j === "t") {
                x.src = "https://img.icons8.com/?size=100&id=lUktdBVdL4Kb&format=png&color=FFFFFF";
                x.title = "Telegram";
            }
            platform.appendChild(x);
            if (!i.attr.platform.endsWith(j)) {
                var y = document.createElement("p");
                y.innerHTML = "&nbsp;|&nbsp;";
                y.style.color = "#ccc";
                platform.appendChild(y);
            }
        }
        atr.appendChild(platform);
        let type = document.createElement("div");
        if (i.attr.type === "mine") type.innerHTML = "<p>Earning Type: Mining</p>";
        else if (i.attr.type === "p2e") type.innerHTML = "<p>Earning Type: Play to Earn</p>";
        else if (i.attr.type === "ad") type.innerHTML = "<p>Earning Type: Watch to Earn</p>";
        else type.innerHTML = "<p>Earning Type: " + i.attr.type + "</p>";
        atr.appendChild(type);
        let coin = document.createElement("div");
        coin.innerHTML = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fcoin%2Fcoin_PNG36871.png&f=1&nofb=1&ipt=e3fb6b38cdd94324ca1d7f1358e2bf66b6fbf803b701370f5ad64c7c0c1d4703"><p>${i.attr.coin}</p>`;
        atr.appendChild(coin);
        let effort = document.createElement("div");
        if (i.attr.effort === 0) effort.innerHTML = "<p>No Effort</p>";
        else if (i.attr.effort === 1) { effort.innerHTML = "<p>Low Effort</p>"; effort.style.background = "linear-gradient(45deg,rgba(49, 125, 34, 1) 0%, rgba(138, 138, 23, 1) 100%)" }
        else if (i.attr.effort === 2) { effort.innerHTML = "<p>Medium Effort</p>"; effort.style.background = "linear-gradient(45deg,rgba(170, 85, 34, 1) 0%, rgba(207, 82, 4, 1) 100%)" }
        else if (i.attr.effort === 3) { effort.innerHTML = "<p>High Effort</p>"; effort.style.background = "linear-gradient(45deg,rgba(170, 34, 34, 1) 0%, rgba(230, 5, 5, 1) 100%)" }
        atr.appendChild(effort);
        let rating = document.createElement("div");
        if (i.attr.rating === 1) rating.innerHTML = "<p>App Rating: <span style='color:yellow'>&starf;&star;&star;&star;&star;</span></p>";
        else if (i.attr.rating === 2) rating.innerHTML = "<p>App Rating: <span style='color:yellow'>&starf;&starf;&star;&star;&star;</span></p>";
        else if (i.attr.rating === 3) rating.innerHTML = "<p>App Rating: <span style='color:yellow'>&starf;&starf;&starf;&star;&star;</span></p>";
        else if (i.attr.rating === 4) rating.innerHTML = "<p>App Rating: <span style='color:yellow'>&starf;&starf;&starf;&starf;&star;</span></p>";
        else if (i.attr.rating === 5) rating.innerHTML = "<p>App Rating: <span style='color:yellow'>&starf;&starf;&starf;&starf;&starf;</span></p>";
        atr.appendChild(rating);
        cnt.appendChild(atr);

        if (i.attr.platform.includes("w")) cnt.classList.add("fpfweb");
        if (i.attr.platform.includes("a")) cnt.classList.add("fpfandroid");
        if (i.attr.platform.includes("i")) cnt.classList.add("fpfios");
        if (i.attr.platform.includes("t")) cnt.classList.add("fpftelegram");
        if (i.attr.type === "mine") cnt.classList.add("ftypemine");
        else if (i.attr.type === "p2e") cnt.classList.add("ftypep2e");
        else if (i.attr.type === "ad") cnt.classList.add("ftypead");
        else cnt.classList.add("ftypeother");
        if (i.attr.effort === 0) cnt.classList.add("feffortno");
        else if (i.attr.effort === 1) cnt.classList.add("feffortlow");
        else if (i.attr.effort === 2) cnt.classList.add("feffortmedium");
        else if (i.attr.effort === 3) cnt.classList.add("fefforthigh");
        if (i.attr.rating === 1) cnt.classList.add("fratinglowest");
        else if (i.attr.rating === 2) cnt.classList.add("fratinglow");
        else if (i.attr.rating === 3) cnt.classList.add("fratingmedium");
        else if (i.attr.rating === 4) cnt.classList.add("fratinghigh");
        else if (i.attr.rating === 5) cnt.classList.add("fratinghighest");
        cnt.classList.add("added-" + i.added)

        cnt.id = `${i.id}___${i.name.replace(/ /g, "_").replace("#", "hash").toLowerCase()}`;

        if (i.more) {
            var x = i.more.split(" ");
            for (j of x) {
                if (j.startsWith("page:")) cnt.setAttribute("onclick", "window.location.assign('" + j.substring(5) + ".html')");
            }
        } else cnt.setAttribute("onclick", "window.location.assign('viewNew.html?id=" + i.id + "')");
        document.getElementById("main").appendChild(cnt);
        DEFAULT.push(cnt);
    }
}

function loadView(item) {
    document.getElementById("viewicon").src = item.icon;
    document.getElementById("description").innerHTML = item.info.description;
    document.getElementById("benefits").setAttribute("onclick", "popup('Benefits for using " + item.name + " through CompNUS', '<ul>" + (item.benefits.length ? "<li>" + item.benefits.join("</li><li>") + "</li>" : "") + (item.attr.dividends ? `<li>Get dividends from CompNUS (you can request them <a target="_blank" style="color:yellow" href="../nus/dividends.html"><b>here</b></a>)</li>` : "") + "</ul>')");
        for (j of item.attr.platform) {
        var x = document.createElement("img");
        if (j === "w") {
            x.src = "https://img.icons8.com/?size=100&id=89777&format=png&color=FFFFFF";
            x.title = "Web";
        }
        if (j === "a") {
            x.src = "https://img.icons8.com/?size=100&id=86306&format=png&color=FFFFFF";
            x.title = "Android";
        }
        if (j === "i") {
            x.src = "https://img.icons8.com/?size=100&id=30840&format=png&color=FFFFFF";
            x.title = "iOS";
        }
        if (j === "t") {
            x.src = "https://img.icons8.com/?size=100&id=lUktdBVdL4Kb&format=png&color=FFFFFF";
            x.title = "Telegram";
        }
        document.getElementById("platforms").appendChild(x);
        if (!item.attr.platform.endsWith(j)) {
            document.getElementById("platforms").innerHTML += "&ensp;";
        }
    }
    let etype;
    switch (item.attr.type) {
        case "mine": etype = "Mining"; break;
        case "p2e": etype = "Play to Earn"; break;
        case "ad": etype = "Watch to Earn"; break;
        default: etype = item.attr.type;
    }
    document.getElementById("earningtype").innerHTML = etype;
    let effrt;
    switch (item.attr.effort) {
        case 0: effrt = "None"; break;
        case 1: effrt = "Low"; break;
        case 2: effrt = "Medium"; break;
        case 3: effrt = "High"; break;
    }
    document.getElementById("effort").innerHTML = effrt;
    document.getElementById("effortdetails").setAttribute("onclick", `popup('Effort Details', "${item.info.effort}")`);
    let rating;
    switch (item.attr.rating) {
        case 1: rating = "&starf;&star;&star;&star;&star;"; break;
        case 2: rating = "&starf;&starf;&star;&star;&star;"; break;
        case 3: rating = "&starf;&starf;&starf;&star;&star;"; break;
        case 4: rating = "&starf;&starf;&starf;&starf;&star;"; break;
        case 5: rating = "&starf;&starf;&starf;&starf;&starf;"; break;
    }
    document.getElementById("rating").innerHTML = rating;

    var xad = document.getElementById("banner");
    if (item.banner) switch (item.banner) {
        case "bin":
            xad.innerHTML = `<div class="promobannerad" style="background-color: #151a1d">
            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Factufinance.fr%2Fwp-content%2Fuploads%2F2020%2F08%2Fbinance.png&f=1&nofb=1&ipt=80c76507bb6ef5fd2efb02a1c47005a6c935bd1c733a9b37fcc6f5314b160f45">
            <div>
            <h1>Withdraw and trade without fees.</h1>
            <p>Trade with Binance and get 10% back on Spot and Futures trading!<br>Click "Learn More" to claim this offer!</p>
            </div>
            <button>LEARN MORE</button>
            </div>`;
            xad.setAttribute("onclick", "window.open('/promo/binance.html', '_blank')");
            break;
        case "blum":
            xad.innerHTML = `<div class="promobannerad" style="background-color: #222">
            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpublic.bnbstatic.com%2Fimage%2Fpgc%2F202405%2F557fc5897e250bbf2bff985d98d8a8aa.png&f=1&nofb=1&ipt=e517bc01bf5e8f7b3f864ede50b53d9ecd1a22d2c5c25b6681d72e19bd25fcf0">
            <div>
            <h1>Trade TON tokens before they go live!</h1>
            <p>Trade meme tokens on Blum before they are listed and get access to airdrops! Free tokens coming soon!</p>
            </div>
            <button>SIGN UP</button>
            </div>`;
            xad.setAttribute("onclick", "window.open('https://t.me/blum/app?startapp=ref_DMcaJgFZFZ', '_blank')");
            break;
        default:
            xad.innerHTML = item.banner;
            xad.setAttribute("onclick", "window.open('" + item.bannerLink + "', '_blank')");
    }

    for (i of item.features) {
        var itsx = document.createElement("div");
        itsx.innerHTML = `<h1>${i[0]}</h1><p>${i[1]}</p>`;
        document.getElementById("mainfeatures").appendChild(itsx);
    }

    for (i of item.tips) {
        var itsx = document.createElement("div");
        itsx.innerHTML = `<h1>${i[0]}</h1><p>${i[1]}</p>`;
        document.getElementById("mobiletab1").appendChild(itsx);
        if (i !== item.tips[item.tips.length - 1]) {
            document.getElementById("mobiletab1").innerHTML += "<br>";
        }
    }

    for (i of item.pros) {
        document.getElementById("mobiletab2").innerHTML += `<img src="https://img.icons8.com/?size=100&id=83145&format=png&color=00CC00"><h2>${i}</h2>`;
    }
    for (i of item.cons) {
        document.getElementById("mobiletab3").innerHTML += `<img src="https://img.icons8.com/?size=100&id=95771&format=png&color=FF0000"><h2>${i}</h2>`;
    }

    switch (item.go.type) {
        case 0:
            document.getElementById("signupbutton").setAttribute("onclick", "window.open('" + item.go.link + "', '_blank')");
            break;
        case 1:
            document.getElementById("signupbutton").onclick = function () {
                popup(
                    "Please read!",
                    `Make sure to use the code <b id="copyCode${item.go.code}" title="Click to copy.">${item.go.code}</b> during sign-up to get access to benefits!</p>
        <button class="fullwidth" onclick="window.open('${item.go.link}', '_blank')">LET'S GO!</button><p style="margin:0">`
                );
                setTimeout(function () {
                    var copyElem = document.getElementById("copyCode" + item.go.code);
                    if (copyElem) {
                        copyElem.onclick = function () {
                            navigator.clipboard.writeText(item.go.code);
                            this.innerHTML = 'Copied!';
                            setTimeout(() => { this.innerHTML = item.go.code; }, 2000);
                        };
                    }
                }, 10);
            };
            break;
    }

    mobileTab("0");
}