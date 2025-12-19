const ITEMS = {

};

async function initInventory(fr) {
    const { data, error } = await sb.from("udata").select("inventory").eq("user_id", fr.id).single();
    if (!data || error) document.getElementById("infotext").innerHTML = "Something went wrong.";
    else document.getElementById("infotext").innerHTML = "Your inventory is empty.";
}