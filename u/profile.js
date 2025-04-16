function main() {
    const dt = {
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

function loadWallet() {
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
    var whole = 
}