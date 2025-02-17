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
        return;
    }

    console.log("User signed up:", data);
}

async function handlePostVerification() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        console.error("User not logged in:", error?.message);
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
        console.error("Database insert error:", dbError.message);
        return dbError;
    }

    return true;
}

console.log("script loaded");

