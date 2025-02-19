const SUPABASE_URL = "https://jwpvozanqtemykhdqhvk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cHZvemFucXRlbXlraGRxaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzY3MDgsImV4cCI6MjA1NDk1MjcwOH0.uoNqHwXBalSEoaJgtlmPE8gMr4VmTGmL-XDPFJq1Xr0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchData() {
    let { data, error } = await supabase
        .from("variable")
        .select("*");

    if (error) {
        console.error("Error fetching users:", error);
    } else {
        console.log("Users:", data);
    }
}

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

async function handlePostVerification() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        window.location.href = "/signup.html?error=oauth_failed";
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

console.log("script loaded");

