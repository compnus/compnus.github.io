var FILTERID = "new1x";

var LIST = [
    {
    name: "Spell Wallet",
    icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.bitgetimg.com%2FmultiLang%2Fweb%2F62e18cee66b35accc2bc058b443ebe34.png&f=1&nofb=1&ipt=3906f68d603756784f2c35345e24d61f662d7b519e652d1eb13211f48caa0827",
    description: "An actual wallet by the way! Spell Wallet not only holds your tokens and stakes them (SOL only), but also allows you to earn MANA and participate in Missions to earn money!",
    added: "7-21-2024",
    id: "spellwallet",
    attr: {
        platform: "at",
        type: "mine",
        coin: "MANA",
        effort: 0,
        rating: 5
    },
    info: {
        description: `Spell wallet allows you to <a class="link" onclick="popup('Token Staking in Spell Wallet', 'Sewat Wallet allows you to stake <b>Solana</b> from 0.001 SOL at up to 6.7% APR.')">hold and stake various tokens</a>, while also allowing you to collect MANA through mining, daily check-ins and quests and earn money (or more MANA) by participating in missions! You will be able to use MANA in the future to unlock airdrops!`,
        effort: "Claim MANA and activate autoclaim (this will allow you to be offline for 24 hours)"
    },
    go: {
        type: 0,
        link: "https://t.me/spell_wallet_bot/wallet?startapp=r-LYKGH1B__utm-friendsTabRef_telegram"
    },
    benefits: ["Dividends in the future."],
    features: [["Dragon Egg", "Claim MANA and use it to purchase temporary upgrades - Auto Claim, which allow you to be offline for 24 hours and mine MANA, and Boost, which triples your MANA production for the next 6 hours!"],
        ["Spin-the-Wheel for Daily Check-in", "Check-in for 7 days in a row to unlock the wheel spin! Spin to win more MANA!"],
        ["Missions, Quests and Magic Boxes", "Complete quests to get extra MANA! Participate in missions to earn money and Magic Boxes! Magic Boxes contain MANA, wheel spins and achievement badges!"],
    ["Wallet Features", "Store your tokens in a secure wallet, swap them and stake held Solana to earn interest!"]
    ],
    tips: [["Always activate upgrades!", "Upgrades cost MANA, but are very much worth in the end! In order to minimize effort, check-in every day, click the Dragon Egg 6 times to activate mining, click upgrades, buy both Auto Claim and Boost and you can leave for the day! Once you come back, many MANA tokens will be waiting for you!"]],
    pros: ["Secure wallet", "Frequent missions with generous rewards", "High staking APR"],
    cons: ["Misleading banner that claims swapping is without fees (there is a fee of about 0.001 TON per swap)"],
    banner: "bin"
}, {
        name: "Dropee",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fminingcombo.com%2Fwp-content%2Fuploads%2F2024%2F11%2FDropee-logo.webp&f=1&nofb=1&ipt=c6760abe79b0ba76dfdef90e6b9a1d84fecd001225055a8938783e5d697d423b",
        description: "Spin the wheel, get tickets, open chests and win! Upgrade your cards or click the duck to receive $DROPEE tokens! Check out the lotteries to win some TON too!",
        added: "7-16-2024",
        id: "dropee",
        attr: {
            platform: "t",
            type: "mine",
            coin: "DROPEE",
            effort: 2,
            rating: 4
        },
        info: {
            description: "Gamified mining in Droppee allows you to upgrade your cards and receive passive $DROPEE coin income! Spin the wheel, get tickets, open chests and maybe you will win something? Frequent events and lotteries allow you to win not only more $DROPEE coin, but occasionally also TON!",
            effort: "Passive mining only works for 3 hours (it can be increased via random rewards, but only temporarily). You need to spin the wheel and upgrade your cards."
        },
        go: {
            type: 2,
            link: [{ name: "Affiliate Link", link: "https://t.me/DropeeBot?start=_tgr_Aa3DHIhmMDU0", description: "Increase main CompNUS dividends and get more Satoshis!" }, { name: "Game Referral", link: "https://t.me/DropeeBot/play?startapp=ref_LAfjXgNtbyN", description: "Receive in-game benefits listed in the 'See sign up benefits...' popup."}]
        },
        benefits: ["5 Spins", "5000 $DROPEE (or 25000 if you have Telegram Premium)"],
        features: [["Cards and Mining", "Upgrade your cards to increase the amount of tokens you mine per hour (Trading Per Hour)! Feel free to leave the app, as for the next 3+ hours, the mining is completely automatic!"],
            ["Spin the Wheel", "Spin the wheel to receive tickets, chests, feathers or $DROPEE! Spin the wheel every day to receive the ultimate golden spin, which rewards you with more spins!"],
            ["Pathways", "Use feathers to complete pathways and receive more spins and $DROPEE!"],
            ["Boxes and Chests", "Open your free box every day to get random rewards! Get chests from spins and get even more random rewards!"],
            ["Daily Quests", "Complete daily quests for more $DROPEE and spins!"],
            ["Achievements", "Complete achievements and increase your airdrop share!"]
        ],
        tips: [["Complete free pathways!", "From time to time, a completely free pathway opens up and completing many will give you achievements, which are the main point based on which the airdrop is going to be allocated."],
            ["Invest your $DROPEE!", "Upgrade cards not only to increase your TPH, but also to get achievements!"],
            ["Do not click the duck!", "It might be useful when you are starting out, but later it's a waste of time. What you will earn from clicking for 5 minutes, you will earn from TPH in around a second."],
            ["Ignore the daily check-in!", "After 28 days, you will earn 3.4B $DROPEE. After a bit of playing, this is something you can earn in 1 minute. Daily check-in might be useful for achievements, but that's about it."]
        ],
        pros: ["Offline mining", "Many cards to upgrade and explore", "Active developer team", "Frequent events and lotteries"],
        cons: ["Mocking with USDT you cannot withdraw (you can earn up to 6USDT from spinning the wheel, but since the withdrawal threshold is 10USDT, you will never be able to withdraw)", "Poor UX", "Most special cards stay in the game for a very short period of time, making it impossible to upgrade them to a decent level"],
        banner: "blum"
    }, {
        name: "DuckChain",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.cryptorank.io%2Fcoins%2Fduck_chain1730984683577.png&f=1&nofb=1&ipt=473cebed1f1af7cabb59dc3488cd6627dc357f528e9a829b6eaf63dec25c1250",
        description: "DuckChain is a popular meme token that already passed its golden age. Now, however, it's back with AIQ - new token that will be airdropping soon! So don't forget to check-in!",
        added: "8-1-2024",
        id: "duckchain",
        attr: {
            platform: "t",
            type: "Microtasks",
            coin: "DUCK, AIQ",
            effort: 1,
            rating: 4
        },
        info: {
            description: "There is not much to say about DuckChain as of now, as it's an app based on chain event that have ended and it doesn't seem they are coming back anytime soon. Right now, you can collect AIQ tokens to qualify for the upcoming airdrop by completing simple tasks!",
            effort: "Complete simple tasks and check-in every day."
        },
        go: {
            type: 0,
            link: "https://t.me/DuckChain_bot/quack?startapp=ebIyNHii"
        },
        benefits: ["None (probably???)"],
        features: [["Daily Check-in and Tasks", "Collect $DUCK and $AIQ by completing simple tasks! Check-in every day to collect more $DUCK!"],
        ["Events", "Most of DuckChain features are part of events that already ended. Most of them promise phase 2 soon, however."]
        ],
        tips: [["There are no tips.", "Certain events could have potential tips, but since they are all closed, there is nothing to talk about."],
        ],
        pros: ["Popular meme token with active developer team and community", "All tokens are available for free", "No ads"],
        cons: ["Many events that already ended and there is no information about what is going to happen next with them", "Unclear airdrop process (problematic for people who are new to crypto)"],
        banner: "blum"
    }, {
        name: "Xenea Wallet",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2F47qjFziXRvnk_9JPIJPuYeaC1U2mDs1dhSOUEQV2QB8nHIp5H2VmLcHYH9XjkSToh7Wv&f=1&nofb=1&ipt=ce9d3e94d16365c84e54a72a698ccd580a8541d7d0b498c3094596bdedbf78dd",
        description: "Besides being an actual wallet, Xenea also allows you to participate in a 'Gem Campaign'. Based on the amount of gems you own, Xenea will provide you with 'incentives'. You can also explore the whole ecosystems with partners and many interesting services!",
        added: "8-2-2024",
        id: "xenea",
        attr: {
            platform: "ai",
            type: "mine",
            coin: "None",
            effort: 2,
            rating: 4
        },
        info: {
            description: "<b>Wallet</b><br>Xenea Wallet functions as a decent enough wallet.<br><br><b>Gem Campaign</b><br>Collect gems through mining and completing quizzes, checking in daily or completing simble tasks and improve your position in the leaderboards! Discover the Xenea ecosystem and check out many apps and services they have to offer! Every app has their own mission with its own quiz, tasks and daily check-in bonus! Keep in mind that gems are not a token, and currently it is not clear whether Xenea will actually release one as an airdrop reward for gems collected.",
            effort: "Despite mining being active even while offline, the mining rewards are extremely low. In order to get a decent amount of gems you will have to check-in daily on every mission and complete occasional tasks."
        },
        go: {
            type: 0,
            link: "https://xenea.app/register/15Noeb7uv0"
        },
        benefits: ["1000 Gems"],
        features: [["Missions", "Daily quiz, special mission quizzes, multiple daily check-ins and tasks give you a huge variety of available ways to earn gems and even learn something about the Xenea ecosystem!"],
        ["Mining", "Despite looking like a major part of the app, the amount of gems you earn from mining per day is miserably low."]
        ],
        tips: [["There are no tips.", "The app is very simple to get acustomed to and does not need any tips."],
        ],
        pros: ["New missions added frequently", "Daily quizzes and generous gem rewards", "No ads"],
        cons: ["Difficult and buggy sign-up process", "No clear use for gems"],
        banner: "bin"
    }, {
        name: "Rich Dog",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frichdog.io%2Fimg%2Fmain-landing%2FHero_4.jpg&f=1&nofb=1&ipt=04801e8c3f1d43767e9a37d869fd7f4ceec2fb212a2216df195d471a19b20a2c",
        description: "Discover the $RICH economy! Invest coins to increase your profit, spin the slots to get wheel spins and more coins and spin the wheel and get a chance to win TON!",
        added: "7-19-2024",
        id: "richdog",
        attr: {
            platform: "t",
            type: "mine",
            coin: "RICH",
            effort: 2,
            rating: 3
        },
        info: {
            description: "Spin the wheel and the slots, invest your coins and see your profit grow! Collect gems, purchase slot spins, get aliens to unlock wheel spins and spin the wheel to either get more gems or secure your position in the leaderboard to win TON and $RICH! Although you can win USDT in the slots, the amount is ridiculously low (if you are lucky enough to get 3 dollar signs and you spin with 10 gems - already more than possible daily unless you are very lucky - you will get whopping 3 cents. Where the minimum withdrawl is 10 USDT. Just see it as another 'nothing' won). Predict price of $RICH and either win 60% extra or lose it all! Welp, here goes the gambling again.",
            effort: "Upgrade cards to increase profit, spin the slots and the wheel. For the next 3 hours, profit is automatic."
        },
        go: {
            type: 0,
            link: "https://t.me/RichDogGameBot/Play?startapp=kentId5782755258"
        },
        benefits: ["Permanent profit boost (20000 coins per hour or 80000 if you have Telegram Premium)"],
        features: [["Invest and Profit", "Invest coins and increase your profit! Upgrade cards and earn passive income for the next 3 hours!"],
            ["Fortune Wheel and Doggy Slots", "Spin the slots every day for gems (you get 6 free per hour, up to 3 hours), get aliens and unlock wheel spins! Spin the wheel to get more gems or secure your position in the leaderboard to win TON and $RICH!"], 
            ["Trade $RICH", "No idea why it's called that, uh anyway, Check out the ultimate gambling aspect of invest your $RICH to either get 60% bonus or lose it all! Wow! 40% edge of the house! That is actually insane."]
        ],
        tips: [["Check-in often!", "Passive coin production only lasts for 3 hours. Check-in often to claim your coins! Also, you can only get up to 18 gems for being offline! That's exactly 3 hours. Spin the slots!"],
        ["Do not buy NFT skins!", "Unlike other NFTs in other apps that can be resold and have at least some sort of value, these are called \"NFTs\", despite being only regular skins. And they are insanely expensive. And they don't even work as a cosmetic to show off because their appearance in the leaderboard is extremely small."]
        ],
        pros: ["One-tap card upgrading", "No ads"],
        cons: ["Many 'scammy' features (being able to purchase wheel spins even if you only have a slight chance of getting to the leaderboard and even slimmer chance of actually being between those who win TON; being able to purchase coin hash miner even if coins cannot be used to get $RICH, ...)", "Not exclusive, rewarding and addictive as they claim but rather tame, almost no rewards and boring"],
        banner: "blum"
    }, {
        name: "AnyCard (formely Remint Network)",
        icon: "https://play-lh.googleusercontent.com/QpiETMyJBreX1Bp0cdwmgXxQA_nAROHpShnvXpUFB_IlQItZeJYcFhNqoj_cofliDZg=w240-h480-rw",
        description: "Collect ACP points and exchange them for various rewards! Which are... coming soon... still. This app used to be a miner for an already existing Remint Token, but out of nowhere changed to this. And the Remind Tokens are now lost forever. That is the sole reason it has 3 stars, since the app is decent, just the developers... are not.",
        added: "8-3-2024",
        id: "remint",
        attr: {
            platform: "a",
            type: "mine",
            coin: "ACP",
            effort: 0,
            rating: 3
        },
        info: {
            description: "Mine ACP, complete tasks and use it to purchase various products - ranging from airdrops to... Actually, that is the only product available for now. And it still did not arrive. Hmmm, hopefully it will. Otherwise, the <a class='link' href='scam.html'>Scam List</a> is going to be very happy.<br>Before ACP, this app was used to mine the RMT token (Remint) which changed without any prior warning and tokens were lost. For this sole reason we only gave AnyCard 3 stars. It is a decent miner, but due to actions like this, it is hard to trust.",
            effort: "Restrt mining every 24 hours."
        },
        go: {
            type: 1,
            link: "https://www.anycardapp.com",
            code: "COMPNUSX"
        },
        benefits: ["500 ACP"],
        features: [["Mining", "Collect 10 ACP/h for 24 hours every day! Mining also rewards you with 50 EXP - you need 1000 EXP to increase your level, but there is not explanation regarding the leveling system and it does not seem to do anything."],
            ["Bonus ACP Rewards", "Complete daily tasks to get up to 300 ACP for free! Complete social tasks to get even more ACP!"],
        ["Store", "Use your ACP to purchase various products such as airdrops and gift cards! Right now, only airdrops are available, however."]
        ],
        tips: [["Refrain from buying VIP!", "5$ a month for a service that gives you VIP support (useless), x2 EXP rate (no one knows what levels are even for), x2 Referral bonus (extra 500 ACP is cool but it's definitely not worth 5$) and the only actually useful feature - x2 Earning rate is certainly not worth it."],
            ["Collect 100 ACP daily for sharing on social media! <img src='https://pngimg.com/uploads/trollface/trollface_PNG43.png' style='width: 1em; height: 1em; vertical-align: baseline'>", "Yeah so, you don't actually have to do it to receive the extra ACP, just click claim and dismiss the button that prompts you to share it, you will receive the reward nevertheless."]
        ],
        pros: ["Active developer team", "Huge potential", "Decent and simple mining app"],
        cons: ["Features with no clear use (VIP support, leveling system)", "No guarantee that the app will not change to something different and you will lose your tokens when you wake up next morning"],
        banner: "bin"
    }, {
        name: "INSIDERAA",
        icon: "https://cdn.galxe.com/galaxy/192/485555a3-bd1a-47c3-8a5a-3409219fa4e3.png",
        description: "Learn trading patterns like a pro! Understand what patterns mean and how to act while trading! Master these skills and get $RAA token!",
        added: "7-17-2024",
        id: "raa",
        attr: {
            platform: "t",
            type: "Learn to Earn",
            coin: "RAA",
            effort: 1,
            rating: 3
        },
        info: {
            description: "Learn trading patterns, understand them and increase your emotional intelligence when it comes to trading! Upgrade patterns to gather more information and get $RAA token! Complete tasks for more coins and $RAA! Learn key metrics and how to manipulate markets - every day, find an important piece of data and get rewarded with $RAA and coins! Train yourself in recognizing patterns and stregten your brain muscles! Also you will get coins and $RAA for it, so it's definitely worth a try!",
            effort: "Check-in daily and upgrade patterns, everything else is optional."
        },
        go: {
            type: 2,
            link: [{ name: "Affiliate Link", link: "https://t.me/INSIDERAA_bot?start=_tgr_h_6r2jxkMzM0", description: "Increase main CompNUS dividends and get more Satoshis!" }, { name: "Game Referral", link: "https://t.me/INSIDERAA_bot/app?startapp=refid5782755258", description: "Receive in-game benefits listed in the 'See sign up benefits...' popup." }]
        },
        benefits: ["500 Coins (or 3000 with Telegram Premium)"],
        features: [["Learning Patterns", "Learn patterns, upgrade them to increase your passive coin production and complete them to receive $RAA! Train patterns in Tech.Analysis and get even more $RAA and coins!"],
            ["Daily Check-in and Tasks", "Get a huge amount of bonus coins and $RAA for checking in daily! Don't forget to complete tasks to earn even more!"],
            ["Daily Inside", "Find out an important piece of data every day and get rewarded with coins and $RAA!"]
        ],
        tips: [["Check-in often!", "Passive coin production only takes 3 hours. Check-in often to claim your coins!"],
        ["Do not buy anything!", "This app offers many paid features, most of which give you coins. Coins do not have any obvious use besides upgrading patterns, so having higher coin production is not very useful. 1B coins per hour sounds cool, but you definitely have better uses for 150$. The same goes for the gambling cases. There is basically no chance of winning TON, so it is to be advised against."]
        ],
        pros: ["Learn patterns with examples and explanation", "Many features", "No ads"],
        cons: ["You need to invite friends in order to unlock later patterns", "Paid wallet (unknown if necessary for airdrop/withdrawal)", "Annoying popups asking you to pay stars for unnecessary features"],
        banner: "blum"
    }, {
        name: "Rubi",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2FOVJjGaAQNzEBJXeqi8RLvDHKHb-be2bbF95iKsrhltNDSOAYXO-qJKJexTV-OT9h-A&f=1&nofb=1&ipt=27073b70fb4f716c7fb2cc7dad88ee34244421ff91607f25cace5f7075c667ce",
        description: "Mine RUBI on various mining pools around the world! It really is that simple!",
        added: "8-21-2024",
        id: "rubi",
        attr: {
            platform: "a",
            type: "mine",
            coin: "RUBI",
            effort: 0,
            rating: 3
        },
        info: {
            description: `Very simple mining app - click the pickaxe, select the pool to mine on and see your earnings grow! Also, do not mind the misleading assumed value right below your RUBI amount, because it does not mean anything.`,
            effort: "Restart mining every day."
        },
        go: {
            type: 1,
            link: "https://play.google.com/store/apps/details?id=com.nemoholding.android.rubi&hl=en-US",
            code: "KINGPVZ"
        },
        benefits: ["1 RUBI"],
        features: [["Mining", "Mine RUBI every day on various mining pools!"],
        ["Wallet and Discovery", "Store your RUBI in a very secure wallet! (Too secure even, for a token that has no value); Discover events and statistics about the RUBI token!"]],
        tips: [["Mind small mistakes made by the developer team.", "This isn't related to the bugs in this app, rather to a small mistake the developers made, since this app is very simple and doesn't need tips. Basically, the Mining and Discovery menu names are switched."]],
        pros: ["Frequent events and AMAs", "Extremely secure wallet (so secure not even you might make it in! wait is this even an advantage then?)"],
        cons: ["Misleading RUBI value display", "Bugs regarding signing in", "Many buttons in the app just... do not work", "Annoying pop-up ads"],
        banner: "bin"
    }, {
        name: "Lions",
        icon: "https://www.findmini.app/_astro/avatar_jCEfHhyLy9_1SPw6L.webp",
        description: "Check out the next soon-to-be huge meme coin! Maybe. Maybe not. Who knows. If we hype it? Perhaps. Get free $LIONS for completing simple tasks and checking in daily!",
        added: "7-30-2024",
        id: "lions",
        attr: {
            platform: "t",
            type: "Check-in Rewards",
            coin: "LIONS",
            effort: 0,
            rating: 3
        },
        info: {
            description: "Another meme coin based on the popular TON token Dogs is here! Check-in every day for up to 600 $LIONS per day and complete tasks for another up to 500 $LIONS per day! That's 1100 $LIONS every day for free, allowing you to pass on purchasing $LIONS and therefore saving more than 0.12 TON per day! There is also a misleading price prediction based on which 100000 $LIONS which you can purchase for 1 TON would be valued 290 USD. Yeah that's way too good to be true.",
            effort: "Check-in daily to collect tokens."
        },
        go: {
            type: 0,
            link: "https://t.me/Lionsapp_bot/LIONS?startapp=r_5782755258"
        },
        benefits: ["If the token launches, we will distribute dividends."],
        features: [["Activity Rewards", "Get up to 600 $LIONS for free every day for checking in and another 500 $LIONS for completing simple tasks!"],
        ["Roar Pass and Lions NFT", "More scammy looking part of this app is certainly the ability to purchase the Roar Pass - claiming to give you 2 TON worth of benefits for only 1 TON. There is no clear indication of what the \"benefits\" in question are. The only thing you can see is the daily calendar with about 0.02 TON rewards per day, which would result in 0.6 TON for the duration of your Roar Pass. Yeah. Feels... scammy. Another thing is the Lions NFT marketplace, where you can buy and sell overpriced images of Simpsons-ahh lions which is very non-transparent."]
        ],
        tips: [["Avoid purchases.", "Due to the red flags we have to advise you do not invest money into this app. You can already get 3 USDT worth of $LIONS per day for free (based on their price prediction), so why bother investing (and possibly losing) your hard earned TON?"],
        ],
        pros: ["Generous daily check-in", "Active developer team", "No ads"],
        cons: ["Fake verification tick", "Non-transparent marketplace", "Unclear Roar Pass benefits", "Scammy price prediction"],
        banner: "blum"
    }, {
        name: "Minati Mining",
        icon: "https://www.findmini.app/_astro/avatar_y5k4w4h8dp_ZXOySa.webp",
        description: "Mine $MNTCP and collect tokens to qualify for the airdrop! Climb the leaderboards and dominate the world! That sounds cool and all but not when there is absolutely nothing transparent about it.",
        added: "7-31-2024",
        id: "minati",
        attr: {
            platform: "t",
            type: "mine",
            coin: "MNTCP",
            effort: 0,
            rating: 2
        },
        info: {
            description: "Okay so let's get to the point immediately. This app hasn't updated in a year. Even though the community 'group' is actively posting updates, nothing is actually happening to the app or the token. There is not token launch date or anything transparent about this app. You can collect tokens daily and mine more tokens, as well as complete simple tasks that give way more tokens than they should. There is an ability to boost your mining but due to how many tokens you get for tasks and daily check-in, it's definitely not worth even considering.",
            effort: "Check-in daily to collect tokens. Restart mining every 3 hours to mine more tokens."
        },
        go: {
            type: 0,
            link: "https://t.me/Minati_Mining_Bot?start=r5782755258"
        },
        benefits: ["If the token launches, we will distribute dividends."],
        features: [["Daily Check-in and Tasks", "For every 15 days of the daily check-in, you will get 116500 $MNTCP in total. Complete simple tasks to get up to 300000 $MNTCP for free!"],
        ["Mining", "2000 $MNTCP for free every 3 hours (no idea who taught them math though, you receive 400 $MNTCP per hour and mine for 3 hours so 3*400=2000 for some reason???)"]
        ],
        tips: [["Do not boost your mining!", "This is th only part of the app that requires TON and is totally not worth it."],
        ],
        pros: ["Generous daily check-in", "No ads"],
        cons: ["No updates", "Non-transparent token launching process", "Broken leaderboard", "Cannot send messages in the official group"],
        banner: "blum"
    }, {
        name: "Bee Network",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2FObXPOLnQRqz-ME8xyd1FSd4LCrd9pwWZjlzodzCvyzwJbjDtoiKSlqDdCFFRLT25lJI&f=1&nofb=1&ipt=c5d815e050808cac8d11de5a22394164f188f8ab296da0f06967214cf3a39121",
        description: "This app packs a bit too much. For starters, you can mine the BEE token. The rest? Well: Event Center, Playing Games, Wallet, Prepaid VISA Cards???, Explore New Tokens, Crypto Articles, Personal Space, Ranking and Chat Rooms. And that is only the app, with the next 50 or so features on web. This app is crazy!",
        added: "8-20-2024",
        id: "beenetwork",
        attr: {
            platform: "wai",
            type: "mine",
            coin: "BEE",
            effort: 0,
            rating: 2
        },
        info: {
            description: `This app, now THIS APP! It packs a lot. A huge lot. Massive lot. But you see the two stars so why is that? Well, those are what we call <b>major flaws</b>. In general 2 stars mean that the app does not look trustworthy, which is not the case here! But the sheer amount of features this app contains with many of them not being properly explained certainly lowers the rating a lot. It is awesome to have a huge amount of features but not when it completely ruins the UX. For starters, you can mine BEE every day and boost it by watching ads. This is the feature you will most likely stick to because the rest is not exactly the easiest to understand.`,
            effort: "Restart mining every day."
        },
        go: {
            type: 0,
            link: "https://card-share.bee.com/kingpvz/?t=1727317028"
        },
        benefits: ["20% off card activation (do not ask us what this means, we have no idea)", "25% BEE mining bonus if you become part of a security circle", "500 XP"],
        features: [["Mining (Mobile Only)", "Mine BEE every day and boost it via security circle or by watching ads!"],
            ["Games", "This app can basically become the next play store - thousands of games waiting to be played!"],
            ["Explore Crypto", "Check out new and trending tokens, read about crypto in articles and discover popular projects! Also there are even more games on top of the screen seriously?"],
            ["Event Center", "Participate in various events and giveaways and get coins (BEE? i guess?), tokens and NFTs!"],
            ["Personal Space and Wallet", "Show off the games you play, your favorites and the amount of BEE you own! Store your assets in a secure wallet!"],
            ["Prepaid VISA Cards", "Why is this a feature in a crypto startup? No idea. But by signing up through us you will get 20% off! Even though it's free??? It also doesn't seem to work at the moment."],
            ["Ranking and Chat Rooms", "Check out the highest ranked Beelievers and chill out in public chat rooms!"],
            ["Web3 Universe (Web Only)", "Meme launchpad? AI agents? DeSci and DePin? This is already too much make it stop please."],
            ["Daily Tasks and dApp (Web Only)", "Get XP - whatever that is for - by completing daily tasks! Explore the dApp store for interesting tools and even. more. games. Please help this is too much."],
        ["Trap Detector and NFT Tools (Web Only)", "I BEG YOU MAKE IT STOP WHY ARE THERE SO MANY FEATURES"]
        ],
        tips: [["Do not think about it.", "There are too many features. Way too many to explore them all. Simply, do not think about them. Stick to mining, you can check out other features from time to time."]],
        pros: ["Massive amount of features to explore", "Very transparent - perhaps a bit too much"],
        cons: ["Extremely laggy UX", "Both the app and the website take forever to load", "Most features lack proper explanation", "Way too complicated"],
        banner: "bin"
    }, {
        name: "Satoshi Game",
        icon: "https://www.findmini.app/_astro/img_1323_i7hyyxw9zt_ZdMWdm.webp",
        description: "Watch ads, mine SATS and! I wanted to say more but there is nothing else to this app.",
        added: "7-22-2024",
        id: "satoshigame",
        attr: {
            platform: "t",
            type: "ad",
            coin: "SATS",
            effort: 3,
            rating: 2
        },
        info: {
            description: `Satoshi Game allows you to watch ads and receive SATS in return. There are other aspects like tasks, but the only daily tasks there is is the Satoshi Combo, which is broken and does not work. You can also purchase miners for Stars to get more SATS but we strongly advise against doing so.`,
            effort: "Watch ads to earn SATS."
        },
        go: {
            type: 0,
            link: "https://t.me/satoshi_game_bot/game?startapp=5782755258"
        },
        benefits: ["None"],
        features: [["Watch Ads and Earn SATS", "Watch ads to earn SATS! Yes. That's everything this app has to offer. Or at least for free."]
        ],
        tips: [["There are no tips.", "The app doesn't get simpler than that!"]],
        pros: ["App looks modern"],
        cons: ["Presumably dead developer team", "Bugs", "Non-transparent"],
        banner: "blum"
    }, {
        name: "WORK DOGS",
        icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftelegramchannels.me%2Fstorage%2Fmedia-logo%2F2412%2Fworkdogsnews.jpg&f=1&nofb=1&ipt=e51fa49cb0683791ef8ed0a9a46713e68b49b828a1a4c5938e97b0579fd05c9d",
        description: "Have we just met the successor of DOGS? Or just another scam project by an infamous group? Only time will tell.",
        added: "7-20-2024",
        id: "workdogs",
        attr: {
            platform: "t",
            type: "Microtasks",
            coin: "WD",
            effort: 1,
            rating: 1
        },
        info: {
            description: "<b>NOTE: This app closely resembles apps made by an infamous group known for making scam projects like RCH (thankfully most of their apps were banned by Telegram). Under any circumstances do not invest any money into this app!</b><br>Get WORKDOGS by completing tasks and checking in daily and exchange them for $WD!",
            effort: "Check-in every day and exchange WORKDOGS for $WD. Tasks are optional and do not pay as much as the daily check-in."
        },
        go: {
            type: 0,
            link: "https://app.workdog.cc/go?i=gnhzej_5782755258_copy"
        },
        benefits: ["None"],
        features: [["Tasks and Daily Check-in", "Complete simple tasks to get WORKDOGS and Keys. Check in every day for up to 10000 WORKDOGS!"],
            ["Games", "Use keys to play various games and get more WORKDOGS. Obviously an app needs some sort of gambling aspect, so we present: BET AND WIN! Bet WORKDOGS, predict Bitcoin price and wither win it or lose it all! <b>Edge of the house: 5%</b>"]
        ],
        tips: [["Check-in every day!", "Checking in for 7 days in a row gives you a total of 12100 WORKDOGS, which is over 1700 per day on average - way more than you can get for tasks (most give you 100 or 200, special ones can give you more but are rare or require paying money)."],
        ["Do not buy $WD!", "1 $WD for 5$ is insane, since you can get 12.1 $WD every week for free. To top it off, this app closely resembles apps made by an infamous group that got most of their apps banned by Telegram for scamming people. This is the sole reason this app has one star - the sheer amount of red flags."]
        ],
        pros: ["Generous daily check-in bonus"],
        cons: ["Fake verification tick", "Scammy look (based on banned Telegram apps)", "Official group does not allow texting", "Non-transparent token launching process"],
        banner: "blum"
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
    via = via.toLowerCase().replace(/ /g, "_").trim();
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
        if (!(b && c && e && f)) i.style.display = "none";

    }
    if ([...document.getElementById("main").children].every(x => x.style.display === "none")) {
        let jmsg = document.getElementById("messagenone");
        jmsg.style.display = "block";
        var xc = "There are no apps that match your filters and/or search query.<br>"
        if (via.includes("pi") || via.includes("network")) xc += "Are you perhaps looking for <a href='https://minepi.com/kingpvzyt' target='_blank'>Pi Network</a>?"
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

        cnt.id = `${i.id}___${i.name.replace(/ /g, "_").replace("#", "hash").toLowerCase()}___${i.attr.coin.replace(/ /g, "_").replace(/,/g, "_").toLowerCase()}`;

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
                    `Make sure to use the code <b id="copyCode${item.go.code}" title="Click to copy.">${item.go.code}</b> during sign-up to get access to benefits!</p><br>
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
        case 2:
            document.getElementById("signupbutton").onclick = function () {
                popup(
                    "Select the link you wish to follow:",
                    `</p><div id="popuplinktype2"></div><p style="margin:0">`
                );
                setTimeout(function () {
                    var mainLink = document.getElementById("popuplinktype2");
                    for (i of item.go.link) {
                        var button = document.createElement("button");
                        button.classList.add("fullwidth");
                        button.style.marginTop = "15px";
                        button.innerHTML = i.name;
                        button.setAttribute("onclick", `window.open('${i.link}', '_blank')`);
                        var desc = document.createElement("p");
                        desc.style.margin = "5px 0 0 0";
                        desc.style.textAlign = "center";
                        desc.innerHTML = i.description;
                        mainLink.appendChild(button);
                        mainLink.appendChild(desc);
                    }
                }, 10);
            };
            break;
    }

    mobileTab("0");
}