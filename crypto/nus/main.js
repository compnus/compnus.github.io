var uid = "";
var balance = null;

async function main() {
    const { user, data } = await getUser();
    //if (!user) window.location.href = "/u/login.html";
    uid = data.id;

    await loadWallet();
}

async function loadWallet() {
    balance = await getBalance();

    document.getElementById("balance_nus").innerHTML = balance[0];
    document.getElementById("balance_noca").innerHTML = balance[1];
    document.getElementById("balance_sat").innerHTML = balance[2];
}

console.log("nus loaded");