// SafeGuard Supabase Configuration

(function () {

    const SUPABASE_URL =
        "https://bseomxjdvmjweikyapsf.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_XeUz0F_lvY0emxyp6Vd2qg_oRXGIXa5";

    function initSupabase() {

        if (!window.supabase) {
            console.error(
                "SafeGuard: Supabase JS library failed to load."
            );
            return;
        }

        window.supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

        console.log(
            "SafeGuard: Supabase connected successfully."
        );
    }

    if (window.supabase) {
        initSupabase();
    } else {

        const check = setInterval(() => {

            if (window.supabase) {
                clearInterval(check);
                initSupabase();
            }

        }, 100);

        setTimeout(() => {
            clearInterval(check);

            if (!window.supabase) {
                console.error(
                    "SafeGuard: Supabase CDN could not be loaded."
                );
            }

        }, 10000);
    }

})();