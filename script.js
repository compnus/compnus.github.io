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
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider
    });

    if (error) {
        console.error("OAuth Sign-in error:", error.message);
        return;
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN") {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (!userError && userData?.user) {
                const userId = userData.user.id;
                const userEmail = userData.user.email;

                // Check if user exists in DB
                const { data: existingUser, error: fetchError } = await supabase
                    .from("users")
                    .select("id")
                    .eq("id", userId)
                    .single();

                if (fetchError) {
                    console.log("User does not exist in DB. Inserting...");

                    // Insert new user into DB
                    const { error: insertError } = await supabase.from("users").insert([
                        {
                            id: userId,
                            email: userEmail,
                            username: userEmail.split("@")[0] // Default username
                        }
                    ]);

                    if (insertError) {
                        console.error("User insert error:", insertError.message);
                        return;
                    }
                }

                // Redirect to setup page
                window.location.href = "/u/setup.html";
            }
        }
    });
}


async function handlePostVerification() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
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

