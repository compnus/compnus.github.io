var maindivdata = null;
var dividenddata = null;
var DIV;

async function divMain() {
    const { data: sdata, error: userExistsErrorn } = await sb
        .from("udata")
        .select("invited, dividend_eligible, dividends")
        .eq("user_id", uid)
        .single();
    if (!sdata || userExistsErrorn) console.log("Server error.");
    maindivdata = sdata;
    const { data: ddata, error: dividendsNotFound } = await sb
        .from("dividend")
        .select("dividend_id, power")
        .eq("user_id", uid)
    if (dividendsNotFound) console.log("Server error.");
    dividenddata = ddata;
    DIV = await fetch('../../supabase/functions/_shared/dividend.json').then(response => response.json());
}

function topNav(id) {
    var pages = document.querySelectorAll('.divpage');
    for (let p of pages) p.style.display = 'none';
    var sels = document.querySelectorAll('#topnav > h1');
    for (let p of sels) p.classList.remove('present');
    document.getElementById('divpage' + id).style.display = 'block';
    document.getElementById('topnav' + id).classList.add('present');
}