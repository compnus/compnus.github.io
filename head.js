const head = `
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Gabarito:wght@400..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
`;

document.head.innerHTML += head;

const header = document.createElement("template");
const promoheader = document.createElement("template");
const footer = document.createElement("template");
const fullfooter = document.createElement("template");

header.innerHTML = `
<header>
<div class="flex cc">
<a href="/"><img id="headerlogo" src="/site/image/logo/main.svg"/></a>
<h1 id="title"></h1>
</div>
<div id="headernav">
<p class="link hnav" id="cryptonus" title="Free crypto, new crypto projects, scam list and so much more!"><a href="/crypto/">CryptoNUS</a></p>
<p class="link hnav" id="servicenus" title="Explore the world of NUS! Versatile apps, services and features are only one click away!"><a href="/apps.html">Apps</a></p>
<p class="link hnav" id="userlogin" title="Gateway to everything NUS: mine $NUS crypto and more!"><a href="/u/signup.html">Sign Up</a> <span style="color: white !important">/</span> <a href="/u/login.html">Log In</a></p>
</div>
</header>
`;

promoheader.innerHTML = `
<header>
<div class="flex cc">
<a href="/"><img id="headerlogo" src="/site/image/logo/main.svg"/></a>
<h1 id="title"></h1>
</div>
<div id="headernav">
<p class="link hnav" id="cryptonus" title="Free crypto, new crypto projects, scam list and so much more!"><a href="/crypto/">CryptoNUS</a></p>
<p class="link hnav" id="servicenus" title="Explore the world of NUS! Versatile apps, services and features are only one click away!"><a href="/apps.html">Apps</a></p>
<p class="link hnav" id="userlogin" title="Gateway to everything NUS: mine $NUS crypto and more!"><a href="/u/signup.html">Sign Up</a> <span style="color: white !important">/</span> <a href="/u/login.html">Log In</a></p>
</div>
</header>
`;

footer.innerHTML = `
<footer>
<p id="footnote">&copy;<span id="footnoteyear">2069</span> CompNUS, All rights reserved.</p>
<div id="footernav">
<p class="link fnav"><a href="/legal/faq.html">FAQ</a></p>
<p class="link fnav"><a href="/legal/">Legal</a></p>
</div>
</footer>
`;

fullfooter.innerHTML = `
<footer class="full">
<div id="footnote">
<p>&copy;<span id="footnoteyear">2069</span> CompNUS, All rights reserved.</p>
<p style="flex:1">&nbsp;</p>
<p>Support: <a class="link" href="mailto:supcompnus@gmail.com">supcompnus@gmail.com</a></p>
</div>
<div class="footerx">
<p class="link fnav"><a href="/legal/">Legal</a></p>
<p class="link fnav fnavbot"><a href="/legal/credits.html">Credits</a></p>
<p class="link fnav fnavbot"><a href="/legal/tos.html">Terms of Service</a></p>
<p class="link fnav fnavbot"><a href="/legal/faq.html">Frequently Asked Questions</a></p>
</div>
<div class="footerx">
<p class="link fnav"><a href="/about.html">About Us</a></p>
<p class="link fnav fnavbot"><a href="#telegramnews#">News <img class="footerpng" src="https://img.icons8.com/?size=100&id=lUktdBVdL4Kb&format=png&color=FFFFFF"></a></p>
<p class="link fnav fnavbot"><a href="/apps.html">Apps</a></p>
</div>
<br><br><br>
<p id="footmes">There's nothing to see here... for now.<br><span class="link" style="font-weight: bold; cursor: pointer" onclick="window.scrollTo(0, 0);">Back to top</span></p>
</footer>
`;

function initHeader(title) {
    document.body.appendChild(header.content);
    document.getElementById("title").innerHTML = title;
    document.addEventListener("DOMContentLoaded", async () => {
        var user = await getUser();
        var usern;
        if (user.user) {
            const { data: username, error: dbError } = await supabase
                .from("users")
                .select("username")
                .eq("id", user.data.id)
                .single();

            if (dbError) {
                console.log(dbError);
            } else {
                if (username.username) usern = username.username;
            }
            document.getElementById("userlogin").innerHTML = `<a href="/u/profile.html">My Profile (${usern})</a>`;
        }
    });
}

function promoHeader(title, color, image) {
    document.body.appendChild(header.content);
    document.getElementById("title").innerHTML = title;
    document.getElementById("headerlogo").src = image;
    document.getElementById("headerlogo").style.borderRadius = "10%";
    document.querySelector("header").style.background = color;
    document.addEventListener("DOMContentLoaded", async () => {
        var user = await getUser();
        var usern;
        if (user.user) {
            const { data: username, error: dbError } = await supabase
                .from("users")
                .select("username")
                .eq("id", user.data.id)
                .single();

            if (dbError) {
                console.log(dbError);
            } else {
                if (username.username) usern = username.username;
            }
            document.getElementById("userlogin").innerHTML = `<a href="/u/profile.html">My Profile (${usern})</a>`;
        }
    });
}

async function initFooter(full = false) {
    if (full) {
        document.body.appendChild(fullfooter.content);
    } else {
        document.body.appendChild(footer.content);
    }
    document.getElementById("footnoteyear").innerHTML = new Date().getFullYear().toString();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    document.addEventListener("DOMContentLoaded", async () => {
        var r = await getUser();
        if ((localStorage.getItem("lastActive") !== today) && r.user) {
            const { error } = await supabase.from("users").update({ last_active: today }).eq("id", r.data.id);
            localStorage.setItem("lastActive", today);
        }
    });
}