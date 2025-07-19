LIST = [
    {
        name: "Robox",
        icon: "https://play-lh.googleusercontent.com/4WJT23_3x0VGuNia2wVJ0M6LO7ZkaiGwWl8avIaPkWpkY3XF6QN1otAA_iumCGWdKg=w240-h480-rw",
        featured: true,
        description: "Robox digital products allow you to mine the Robox stable coin in various different ways allowing you to earn a lot of money in a short period of time. Combine this with their special wallet which allows you to earn 7% APR interest and we have a great way to get some extra cash with low effort!",
        added: "7-15-2024",
        id: "robox_main",
        attr: {
            verified: 1,
            dividends: true,
            platform: "wai",
            type: "mine",
            coin: "other:Robox",
            effort: 1,
            rating: 5
        },
        more: "page:robox"
    }, 
    {
        name: "Robox",
        unlisted: true,
        icon: "https://play-lh.googleusercontent.com/4WJT23_3x0VGuNia2wVJ0M6LO7ZkaiGwWl8avIaPkWpkY3XF6QN1otAA_iumCGWdKg=w240-h480-rw",
        description: "Robox is the heart of the Robox ecosystem, allows you to effortlessly mine Robox by checking in the app every 3 hours!",
        id: "robox",
        attr: {
            verified: 1,
            dividends: true,
            platform: "wai",
            type: "mine",
            coin: "other:Robox",
            effort: 0,
            rating: 5
        },
        info: {},
        go: {
            type: 0,
            link: ""
        },
        tips: [],
        pros: [],
        cons: [],
        benefits: []
    }, 
    {
        name: "#mate",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fminingcombo.com%2Fwp-content%2Fuploads%2F2025%2F03%2Fhash-mate-logo.webp&f=1&nofb=1&ipt=32321a8cf968e78d8752d064e51501960af68a10b2c1625adee8d234decf24dc",
        featured: true,
        description: "#mate allows you to mine TON, NOT, Telegram Stars and more without investment! Frequent event, NFT mining and random cases allow you to earn a lot of various cryptocurrencies effortlessly!",
        added: "7-16-2024",
        id: "hashmate",
        attr: {
            verified: 1,
            dividends: true,
            platform: "t",
            type: "mine",
            coin: "ton stars other:NOT other:Dogs other:Major other:Cati other:PX",
            effort: 0,
            rating: 5
        },
        info: {
            description: "",
            effort: ""
        },
        go: {
            type: 0,
            link: "https://t.me/hashmate_bot?start=8f86ot00"
        },
        tips: [],
        pros: [],
        cons: [],
        benefits: ["Free miner to help you get started"]
    }
];

FILTERS = {
    main: {
        featured: false,
        dividend: false,
        verm1: false,
        ver0: false,
        ver1: false
    },
    pf: {
        web: false,
        android: false,
        ios: false,
        telegram: false
    },
    type: {
        mine: false,
        p2e: false,
        faucet: false,
        ad: false,
        mt: false,
        nw: false,
        other: false
    },
    coin: {
        btc: false,
        ton: false,
        usdt: false,
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
    via = via.toLowerCase().replace(/ /g, "_").replace("#", "hash");
    for (var i of document.getElementById("main").children) {
        i.style.display = "grid";
        if (!i.id.includes(via)) {
            i.style.display = "none";
            continue;
        }
        if (allFiltersFalse()) continue;
        let a = {
            x: true,
            y: true,
            z: false
        }
        let b = false;
        let c = false;
        let d = false;
        let e = false;
        let f = false;

        let feat = false;
        let divd = false;

        let individuals = {
            b: individualFiltersFalse("pf"),
            c: individualFiltersFalse("type"),
            d: individualFiltersFalse("coin"),
            e: individualFiltersFalse("effort"),
            f: individualFiltersFalse("rating")
        }
        for (j of i.classList) {
            if (j === "fmainfeatured") feat = true;
            if (j === "fmaindividend") divd = true;
            if (!(FILTERS.main.ver0 || FILTERS.main.ver1 || FILTERS.main.verm1)) a.z = true;
            else if ((j.startsWith("fmainver") && FILTERS.main["ver" + j.substring(8)])) a.z = true;
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
        if (!(a.x && a.y && a.z && b && c && d && e && f)) i.style.display = "none";

    }
    if ([...document.getElementById("main").children].every(x => x.style.display === "none")) {
        document.getElementById("messagenone").style.display = "block";
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
            ${i.featured ? "<h2 title='This app is featured by CompNUS for being a reliable way to earn!'>Featured</h2>" : ""}
            <h1>${i.name}</h1>
            <p>${i.description}</p>
        </div>
        `;
        let atr = document.createElement("div");
        atr.classList.add("attr");
        let verified = document.createElement("div");
        if (i.attr.verified === 1) { verified.innerHTML = "<img src='https://img.icons8.com/?size=100&id=102561&format=png&color=000000'> <p style='color:#4caf50'>Verified</p>"; verified.title = 'This app is verified to be legit.'; }
        else if (i.attr.verified === 0) { verified.innerHTML = "<img src='https://img.icons8.com/?size=100&id=84097&format=png&color=CCCCCC'> <p>Unknown</p>"; verified.title = 'We have not yet verified whether this app is legit.'; }
        else { verified.innerHTML = "<img src='https://img.icons8.com/?size=100&id=12226&format=png&color=000000'> <p style='color:orange'>Possible Scam</p>"; verified.title = 'This app is suspicious and might be a scam.' }
        atr.appendChild(verified);
        if (i.attr.dividends) {
            let dividends = document.createElement("div");
            dividends.style.background = "linear-gradient(45deg,rgba(9, 145, 9, 1) 0%, rgba(10, 209, 10, 1) 100%)";
            dividends.innerHTML = "<p>Dividends Available</p>";
            atr.appendChild(dividends);
        }
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
        else if (i.attr.type === "faucet") type.innerHTML = "<p>Earning Type: Faucet</p>";
        else if (i.attr.type === "ad") type.innerHTML = "<p>Earning Type: Watch to Earn</p>";
        else if (i.attr.type === "mt") type.innerHTML = "<p>Earning Type: Micro Tasks</p>";
        else if (i.attr.type === "nw") type.innerHTML = "<p>Earning Type: Network Sharing</p>";
        else type.innerHTML = "<p>Earning Type: " + i.attr.type + "</p>";
        atr.appendChild(type);
        let coin = document.createElement("div");
        if (i.attr.coin === "btc") coin.innerHTML = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fexplore-feed.github.com%2Ftopics%2Fbitcoin%2Fbitcoin.png&f=1&nofb=1&ipt=0fc5f2026f1b50c404143ab248bb02156a85728bb713e9281df90d4b8e90e6ce'><p>Bitcoin</p>";
        else if (i.attr.coin === "ton") coin.innerHTML = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcoin-images.coingecko.com%2Fcoins%2Fimages%2F17980%2Flarge%2Fton_symbol.png%3F1696517498&f=1&nofb=1&ipt=90939ae1f3c6eb4ce309bc33f8ae788e1492abf53131bc126af4e0711d839d50'><p>TON</p>";
        else if (i.attr.coin === "usdt") coin.innerHTML = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcoinivore.com%2Fwp-content%2Fuploads%2F2020%2F11%2FTether-USDT.png&f=1&nofb=1&ipt=5b05429fb157f5eb8f37b2f5060c8abecfc511658a8f2d3c621c65f9d6dbeba7'><p>USDT/USDC</p>";
        else if (i.attr.coin === "stars") coin.innerHTML = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fkupistars.ru%2Fassets%2Fimg%2Ftgstars.png&f=1&nofb=1&ipt=80c59d47eda2ee08b9421a8ca2256b51a99e1a9566f0dd2f858786dc35377832'><p>Telegram Stars</p>";
        else if (i.attr.coin.startsWith("other:")) coin.innerHTML = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fcoin%2Fcoin_PNG36871.png&f=1&nofb=1&ipt=e3fb6b38cdd94324ca1d7f1358e2bf66b6fbf803b701370f5ad64c7c0c1d4703"><p>${i.attr.coin.substring(6)}</p>`;
        else coin.innerHTML = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F013%2F391%2F079%2Fnon_2x%2Fcryptocurrency-exchange-3d-illustration-free-png.png&f=1&nofb=1&ipt=923304f21fdaf94f5c47b4ec445165ba37fa57f98d6e8b258995325165034d74"><p>Multi-Coin</p>`;
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

        if (i.featured) cnt.classList.add("fmainfeatured");
        if (i.attr.dividends) cnt.classList.add("fmaindividend");
        if (i.attr.verified === 1) cnt.classList.add("fmainver1");
        else if (i.attr.verified === 0) cnt.classList.add("fmainver0");
        else cnt.classList.add("fainmverm1");
        if (i.attr.platform.includes("w")) cnt.classList.add("fpfweb");
        if (i.attr.platform.includes("a")) cnt.classList.add("fpfandroid");
        if (i.attr.platform.includes("i")) cnt.classList.add("fpfios");
        if (i.attr.platform.includes("t")) cnt.classList.add("fpftelegram");
        if (i.attr.type === "mine") cnt.classList.add("ftypemine");
        else if (i.attr.type === "p2e") cnt.classList.add("ftypep2e");
        else if (i.attr.type === "faucet") cnt.classList.add("ftypefaucet");
        else if (i.attr.type === "ad") cnt.classList.add("ftypead");
        else if (i.attr.type === "mt") cnt.classList.add("ftypemt");
        else if (i.attr.type === "nw") cnt.classList.add("ftypenw");
        else cnt.classList.add("ftypeother");
        if (i.attr.coin === "btc") cnt.classList.add("fcoinbtc");
        else if (i.attr.coin === "ton") cnt.classList.add("fcointon");
        else if (i.attr.coin === "usdt") cnt.classList.add("fcoinusdt");
        else if (i.attr.coin.startsWith("other:")) cnt.classList.add("fcoinother");
        else {
            for (j of i.attr.coin.split(" ")) {
                if (j === "btc") cnt.classList.add("fcoinbtc");
                else if (j === "ton") cnt.classList.add("fcointon");
                else if (j === "usdt") cnt.classList.add("fcoinusdt");
                else cnt.classList.add("fcoinother");
            }
        }
        if (i.attr.effort === 0) cnt.classList.add("feffortno");
        else if (i.attr.effort === 1) cnt.classList.add("feffortlow");
        else if (i.attr.effort === 2) cnt.classList.add("feffortmedium");
        else if (i.attr.effort === 3) cnt.classList.add("fefforthigh");
        if (i.attr.rating === 1) cnt.classList.add("fratinglowest");
        else if (i.attr.rating === 2) cnt.classList.add("fratinglow");
        else if (i.attr.rating === 3) cnt.classList.add("fratingmedium");
        else if (i.attr.rating === 4) cnt.classList.add("fratinghigh");
        else if (i.attr.rating === 5) cnt.classList.add("fratinghighest");
        cnt.classList.add("added-"+i.added)

        cnt.id = `${i.id}___${i.name.replace(/ /g, "_").replace("#","hash").toLowerCase()}`;

        if (i.more) {
            var x = i.more.split(" ");
            for (j of x) {
                if (j.startsWith("page:")) cnt.setAttribute("onclick", "window.location.assign('" + j.substring(5) + ".html')");
            }
        } else cnt.setAttribute("onclick", "window.location.assign('viewEarn.html?id="+i.id+"')");
        document.getElementById("main").appendChild(cnt);
        DEFAULT.push(cnt);
    }
}

function loadView(item) {
    document.getElementById("viewicon").src = item.icon;
    document.getElementById("description").src = item.info.description;
    document.getElementById("benefits").setAttribute("onclick", "popup('Benefits for using "+item.name+" through CompNUS', '<ul>"+(item.benefits.length?"<li>"+ item.benefits.join("</li><li>") +"</li>":"") + (item.attr.dividends?`<li>Get dividends from CompNUS (you can request them <a target="_blank" style="color:yellow" href="../nus/dividends.html"><b>here</b></a>)</li>`:"")+"</ul>')");
    let verf;
    if (item.attr.verified === -1) verf = "Possible Scam";
    else if (item.attr.verified === 0) verf = "Unknown";
    else if (item.attr.verified === 1) verf = "Verified";
    document.getElementById("legitimacy").innerHTML = verf;
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
            document.getElementById("platforms").innerHTML+="&ensp;";
        }
    }
    let etype;
    switch (item.attr.type) {
        case "mine": etype = "Mining";break;
        case "p2e": etype = "Play to Earn";break;
        case "faucet": etype = "Faucet";break;
        case "ad": etype = "Watch to Earn";break;
        case "mt": etype = "Micro Tasks";break;
        case "nw": etype = "Network Sharing"; break;
        default: etype = item.attr.type;
    }
    document.getElementById("earningtype").innerHTML = etype;
    let curr;
    switch (item.attr.coin) {
        case "btc": curr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fexplore-feed.github.com%2Ftopics%2Fbitcoin%2Fbitcoin.png&f=1&nofb=1&ipt=0fc5f2026f1b50c404143ab248bb02156a85728bb713e9281df90d4b8e90e6ce'> Bitcoin"; break;
        case "ton": curr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcoin-images.coingecko.com%2Fcoins%2Fimages%2F17980%2Flarge%2Fton_symbol.png%3F1696517498&f=1&nofb=1&ipt=90939ae1f3c6eb4ce309bc33f8ae788e1492abf53131bc126af4e0711d839d50'> TON"; break;
        case "usdt": curr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcoinivore.com%2Fwp-content%2Fuploads%2F2020%2F11%2FTether-USDT.png&f=1&nofb=1&ipt=5b05429fb157f5eb8f37b2f5060c8abecfc511658a8f2d3c621c65f9d6dbeba7'> USDT/USDC"; break;
        case "stars": curr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fkupistars.ru%2Fassets%2Fimg%2Ftgstars.png&f=1&nofb=1&ipt=80c59d47eda2ee08b9421a8ca2256b51a99e1a9566f0dd2f858786dc35377832'> Telegram Stars"; break;
        default:
            if (item.attr.coin.startsWith("other:")) curr = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fcoin%2Fcoin_PNG36871.png&f=1&nofb=1&ipt=e3fb6b38cdd94324ca1d7f1358e2bf66b6fbf803b701370f5ad64c7c0c1d4703"> ${item.attr.coin.substring(6)}`;
            else {
                curr = "Click to view";
                let xpt = [];
                for (i of item.attr.coin.split(" ")) {
                    let xpr = "";
                    switch (i) {
                        case "btc": xpr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fexplore-feed.github.com%2Ftopics%2Fbitcoin%2Fbitcoin.png&f=1&nofb=1&ipt=0fc5f2026f1b50c404143ab248bb02156a85728bb713e9281df90d4b8e90e6ce'> Bitcoin"; break;
                        case "ton": xpr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcoin-images.coingecko.com%2Fcoins%2Fimages%2F17980%2Flarge%2Fton_symbol.png%3F1696517498&f=1&nofb=1&ipt=90939ae1f3c6eb4ce309bc33f8ae788e1492abf53131bc126af4e0711d839d50'> TON"; break;
                        case "usdt": xpr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcoinivore.com%2Fwp-content%2Fuploads%2F2020%2F11%2FTether-USDT.png&f=1&nofb=1&ipt=5b05429fb157f5eb8f37b2f5060c8abecfc511658a8f2d3c621c65f9d6dbeba7'> USDT/USDC"; break;
                        case "stars": xpr = "<img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fkupistars.ru%2Fassets%2Fimg%2Ftgstars.png&f=1&nofb=1&ipt=80c59d47eda2ee08b9421a8ca2256b51a99e1a9566f0dd2f858786dc35377832'> Telegram Stars"; break;
                        default: xpr = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fcoin%2Fcoin_PNG36871.png&f=1&nofb=1&ipt=e3fb6b38cdd94324ca1d7f1358e2bf66b6fbf803b701370f5ad64c7c0c1d4703"> ${i.substring(6)}`;
                    }
                    let xpe = document.createElement("div");
                    xpe.classList.add("singleCoin");
                    xpe.innerHTML = xpr;
                    xpt.push(xpe.outerHTML);
                }
                document.getElementById("currency").setAttribute("onclick", `popup('Earning Currencies', '${xpt.join(" ")}')`);
                document.getElementById("currency").classList.add("clickableCurr");
            }
    }
    document.getElementById("currency").innerHTML = curr;
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
}