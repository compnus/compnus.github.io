var dt;

async function main() {
    const { data, error } = await supabase.auth.getUser();
    dt = {
        user_id: data.user.id,
        uid: (await supabase.auth.getSession()).data.session?.user.id
    };

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

    document.getElementById("welcomer").innerHTML = `Welcome, ${nameddata.name}!`;

    loadWallet();
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

console.log("profile loaded");