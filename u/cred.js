async function signUpUser(email, password) {
    const { data, error } = await sb.auth.signUp({
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
    const { data, error } = await sb.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

async function signInWithProvider(provider) {
    try {
        const { data: authData, error: authError } = await sb.auth.signInWithOAuth({
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

        const { data: existingUser, error: userError } = await sb
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (userError) {
            throw new Error("Error checking user in the database: " + userError.message);
        }

        if (existingUser) {
            await sb
                .from("users")
                .update({ provider: provider })
                .eq("email", email);
        } else {
            const { error: insertError } = await sb
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

    const { error } = await sb.auth.resetPasswordForEmail(email);

    if (error) {
        console.log("Error: " + error.message);
        status.innerHTML = error.message;
    } else {
        status.innerHTML = "Password reset link sent! Check your email.";
    }
}

async function handlePostVerification() {
    const { data, error } = await sb.auth.getUser();

    if (error || !data.user) {
        window.location.href = "/u/signup.html?error=oauth_failed";
        return error;
    }

    const { error: dbError } = await sb.from("users").insert([
        {
            id: data.user.id,
            email: data.user.email,
            username: "." + random(100, 29),
            created: data.user.created_at
        }
    ], { onConflict: ['id'] });

    if (dbError) {
        return dbError.code;
    }

    return true;
}

console.log("credentials loaded");