var dt = null;

async function main() {
    const { data, error } = await supabase.auth.getUser();
    if (!data || error) {
        window.location.href = '/u/';
    }
    dt = data.user.id;
    const { data: msgadm, error: msgadmerror } = await supabase
        .from("udata")
        .select("admin")
        .eq("user_id", dt)
        .single();

    if (!msgadm || msgadmerror || !msgadm.admin) window.location.href = '/u/';
}

function preview() {
    popup("Preview", `</p>
        <div class="msgmsgmain">
        <div class="msgmsg">
        <p>
        ${document.getElementById('msg').value}
        </p>
        </div>
        </div>
        <p style="margin:0">
    `);
}

async function sendMessage() {
    if (!dt) await main();
    var body = {
        uid: dt,
        to: document.getElementById('receiver').value,
        title: document.getElementById('mtitle').value,
        msg: document.getElementById('msg').value
    }
    if ((body.title.trim() == "") || (body.msg.trim() == "")) {
        popup("Title or message is missing!", "Please input the title and the message properly.");
        return;
    var bt = document.getElementById("limitedsend");
    bt.innerHTML = "Please wait...";
    await fetch('https://jwpvozanqtemykhdqhvk.supabase.co/functions/v1/sendMessageAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            if (data.type === null || data.type === undefined) {
                popup("Error!", data.response);
                bt.innerHTML = "Send";
                return;
            }
            if (data.type === 0) {
                popup(data.response, data.message);
                bt.innerHTML = "Send";
                return;
            }
            if (data.type === 1) popup("Success!", data.response);
        })
        .catch((error) => {
            console.error('Error invoking function:', error);
        });
    bt.innerHTML = "Send";
}

console.log("admin loaded");