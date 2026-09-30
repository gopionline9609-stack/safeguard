const SUPABASE_URL =
    "https://bseomxjdvmjweikyapsf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XeUz0F_lvY0emxyp6Vd2qg_oRXGIXa5";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// Check login state
async function checkUser() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    const session = data.session;

    // Dashboard page
    if (window.location.pathname.endsWith("dashboard.html")) {

        if (!session) {
            window.location.href = "index.html";
            return;
        }

        const user = session.user;

        const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "SafeGuard User";

        const email =
            user.email || "";

        const picture =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            "";

        document.getElementById("userName").textContent = name;
        document.getElementById("userEmail").textContent = email;

        if (picture) {
            document.getElementById("profilePhoto").src = picture;
        }
    }
}


// Google Login
let selectedRole = "child";

const roles = document.querySelectorAll(".role");

roles.forEach(role => {

    role.addEventListener("click", () => {

        roles.forEach(r => {
            r.classList.remove("active");
        });

        role.classList.add("active");

        selectedRole = role.dataset.role;

    });

});


document
.getElementById("googleLogin")
.addEventListener("click", async () => {

    const button =
        document.getElementById("googleLogin");

    const status =
        document.getElementById("loginStatus");

    try {

        if (!window.supabaseClient) {

            status.textContent =
                "Supabase is not ready. Please refresh the page.";

            status.style.color =
                "#ff7088";

            return;
        }

        button.disabled = true;

        button.innerHTML =
            "Connecting securely...";

        /*
         * Save selected role before
         * Google redirects the browser.
         */

        localStorage.setItem(
            "safeguard_role",
            selectedRole
        );

        const redirectPage =
            selectedRole === "parent"
                ? "parent.html"
                : "dashboard.html";

        const redirectURL =
            window.location.origin +
            "/" +
            redirectPage;

        const { error } =
            await window.supabaseClient.auth.signInWithOAuth({

                provider: "google",

                options: {
                    redirectTo: redirectURL
                }

            });

        if (error) {
            throw error;
        }

    }

    catch (error) {

        console.error(
            "Google Login Error:",
            error
        );

        status.textContent =
            error.message ||
            "Google sign-in could not start.";

        status.style.color =
            "#ff7088";

        button.disabled = false;

        button.innerHTML =
            `
            <span class="google-icon">G</span>
            <span>Continue with Google</span>
            `;
    }

});


// Sign out
const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await supabaseClient.auth.signOut();

        window.location.href = "index.html";
    });
}


// Emergency button
const sosButton =
    document.getElementById("sosButton");

if (sosButton) {

    sosButton.addEventListener("click", () => {

        alert(
            "Emergency mode will be connected in the next step."
        );

    });
}


checkUser();