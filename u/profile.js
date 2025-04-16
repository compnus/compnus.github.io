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
    document.getElementById("walletnus").innerHTML = "Loading...";
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
            x = data.balance;
            whole = Math.floor(x);
            rem = Math.floor((x - whole) * 100000000);
            document.getElementById("walletnus").innerHTML = `${whole}<span class="walletdecimal">.${"0".repeat(8 - rem.toString().length)}${rem}</span>`;
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
}

console.log("profile loaded");