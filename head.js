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
<p class="link hnav" id="servicenus" title="Projects, tools and other services by CompNUS, or by partners of CompNUS."><a href="/services.html">Services</a></p>
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
<p class="link hnav" id="servicenus" title="Projects, tools and other services by CompNUS, or by partners of CompNUS."><a href="/services.html">Services</a></p>
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
<div id="footerline">
<p id="footnote">&copy;<span id="footnoteyear">2069</span> CompNUS, All rights reserved.</p>
<div id="footernav">
<p class="link fnav"><a href="/legal/credits.html">Credits</a></p>
<p class="link fnav"><a href="/legal/tos.html">Terms of Service</a></p>
</div>
</div>
<div id="footerbottom">
</div>
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

function initFooter(full = false) {
    if (full) {
        document.body.appendChild(fullfooter.content);
    } else {
        document.body.appendChild(footer.content);
    }
    document.getElementById("footnoteyear").innerHTML = new Date().getFullYear().toString();
}