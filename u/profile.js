var dt = {user_id: null, uid: null};

async function main() {
    const { data, error } = await supabase.auth.getUser();
    dt.user_id = data.user.id;
    dt.uid = (await supabase.auth.getSession()).data.session?.user.id;

    fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/inituser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(dt)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Function response:', data);
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });

    const { data: nameddata, error: namederror } = await supabase
        .from("users")
        .select("name")
        .eq("id", dt.user_id)
        .single();

    if (namederror || !nameddata.name) {
        window.location.href = "setup.html";
    }

    document.getElementById("welcomer").innerHTML = `Welcome, ${nameddata.name}!`;

    loadWallet();
    loadMessages();
    window.setTimeout(5000, ()=>{ loadWallet(); loadMessages(); });
}

async function loadWallet() {
    var x, whole, rem;
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/getbalance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(dt)
    })
        .then(response => response.json())
        .then(data => {
            x = data.balance[0];
            whole = Math.floor(x);
            rem = Math.round((x - whole) * 100000000);
            document.getElementById("walletnus").innerHTML = `${whole}<span class="walletdecimal">.${"0".repeat(8 - rem.toString().length)}${rem}</span>`;
            y = data.balance[1];
            document.getElementById("walletnoca").innerHTML = y;
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}

async function loadMessages() {
    var msgcont = document.getElementById("messagecont");
    try {
        const { x, y } = await supabase.from("users").select("messages").eq("id", dt.uid).single();
        if (!x || y) {
            throw new DOMException();
        }
    } catch {
        msgcont.innerHTML = `<p>An error occured while trying to load messages.</p>`;
        return;
    }
    x = x.data.messages.split("%$$%");
    if (!(x.trim() === "")) {
        msgcont.innerHTML = `<p>You have no messages.</p>`;
        return;
    }
    msgcont.innerHTML = "";
    for (var i of x) {

        msgcont.innerHTML += i;

    }
}

function collapse(id) {
    panel = document.getElementById(id);
    document.getElementById("collapse" + id).classList.toggle("collapsed");
    if (panel.classList.contains("collapsed")) {
        panel.classList.remove("collapsed");
        panel.style.height = panel.scrollHeight - (window.innerHeight / 25) + "px";
    } else {
        panel.style.height = panel.scrollHeight - (window.innerHeight / 20) + "px";
        panel.offsetHeight;
        panel.style.height = "3.5vh";
        panel.classList.add("collapsed");
    }
}

async function attemptRecovery() {
    var status = document.getElementById('passresetstatus');
    status.innerHTML = "Please wait...";
    const { email, noemail } = await supabase.from('users').select('email').eq('id', dt.uid).single();
    if (!email || noemail) {
        status.innerHTML = "Error fetching user data.<br>Try refreshing the page.";
        return;
    }
    email = email.data.email;
    if (email !== document.getElementById('resetpassword')) {
        status.innerHTML = "Emails do not match."
        return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
        status.innerHTML = error.message;
    } else {
        status.innerHTML = "Password reset link sent! Check your email.";
    }
}

async function copyTemplate() {
    var x = `I would like to delete my account on CompNUS.
Username: [[Put your username here, as a confirmation]]
Reason: [[Optionally, you can tell us why you are leaving CompNUS]]

I do acknowledge, that I will lose access to everything connected to my CompNUS account, and funds in my wallet will be lost forever: [[Write "YES" here]]`;
    navigator.clipboard.writeText(x);
    popup("Template copied!", "Template preview:<br><br>"+x.replaceAll("\n","<br>"));
}

console.log("profile loaded");