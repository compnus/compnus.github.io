const SUPABASE_URL = "https://jwpvozanqtemykhdqhvk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cHZvemFucXRlbXlraGRxaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzY3MDgsImV4cCI6MjA1NDk1MjcwOH0.uoNqHwXBalSEoaJgtlmPE8gMr4VmTGmL-XDPFJq1Xr0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var popupid = 0;

async function signUpUser(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error("Sign-up error:", error.message);
        return { data, error };
    }

    return { data, error };
}

async function logInUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

async function logOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
}

async function signInWithProvider(provider) {
    try {
        const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: "https://compnus.github.io/u/verify.html"
            }
        });

        if (authError) {
            throw new Error(authError.message);
        }

        const user = authData.user;
        const email = user.email;

        const { data: existingUser, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (userError) {
            throw new Error("Error checking user in the database: " + userError.message);
        }

        if (existingUser) {
            await supabase
                .from("users")
                .update({ provider: provider })
                .eq("email", email);
        } else {
            const { error: insertError } = await supabase
                .from("users")
                .insert({ id: user.id, email, provider: provider });

            if (insertError) {
                throw new Error("Error inserting new user: " + insertError.message);
            }
        }

    } catch (error) {
        console.error("Error during login/signup with provider:", error.message);
    }
}

async function resetPassword() {
    const email = document.getElementById("email").value;
    const status = document.getElementById("status");

    status.innerHTML = "Please wait...";

    if (!email) {
        status.innerHTML = "Please enter your email.";
        return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
        console.log("Error: " + error.message);
        status.innerHTML = error.message;
    } else {
        status.innerHTML = "Password reset link sent! Check your email.";
    }
}

async function handlePostVerification() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        window.location.href = "/u/signup.html?error=oauth_failed";
        return error;
    }

    const { error: dbError } = await supabase.from("users").insert([
        {
            id: data.user.id,
            email: data.user.email,
            username: data.user.email.split("@")[0],
            created: data.user.created_at
        }
    ], { onConflict: ['id'] });

    if (dbError) {
        return dbError.code;
    }

    return true;
}

async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        return { user:false, data:error };
    }

    return { user: true, data: data.user };
}

function popup(title, message, close = true) {
    var x = document.createElement("div");
    x.style.opacity = 0;
    x.style.transition = '0.1s';
    x.id = "popup" + popupid++;
    x.className = "popup";
    x.innerHTML = `
    <div onclick="e = window.event; e.stopPropagation()">
    <div class="inside">
    <h1>${title}</h1>
    <h2 onclick="document.getElementById('${x.id}').style.opacity = 0; window.setTimeout(() => document.body.removeChild(document.getElementById('${x.id}')), 201)">X</h2>
    </div>
    <p>
    ${message}
    </p>
    </div>
    `;
    if (close) {
        x.onclick = () => {
            x.style.opacity = 0;
            window.setTimeout(() => document.body.removeChild(document.getElementById(x.id)), 201);
        }
    }

    document.body.appendChild(x);
    window.setTimeout(() => x.style.opacity = 1, 1);
}

async function getBalance(uid) {
    const { data: balance, error: userExistsErrorn } = await supabase
        .from("udata")
        .select("balance_nus, balance_noca, balance_sats")
        .eq("user_id", uid)
        .single();

    if (!balance || userExistsErrorn) return false;

    return [balance.balance_nus, balance.balance_noca, balance.balance_sats];
}

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

async function getVariable(vars) {
    const { data, error } = await supabase
        .from("variable")
        .select("value")
        .eq("key", vars)
        .single();

    if (!data || error) return null;
    else return data.value;
}

console.log("script loaded");

