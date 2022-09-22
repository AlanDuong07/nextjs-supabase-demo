import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleLogin = async (email) => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            alert("Check your email for the login link!");
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100vh] flex flex-col lg:flex-row justify-center items-center gap-20 p-20">
            <h1 className="interHeader text-center">
                A minimal Next.js and Supabase demo.
            </h1>
            <section className="flex flex-col gap-4 justify-center items-center">
                <h2 className="interSubheader text-center">
                    Sign in via magic link with your email below
                </h2>
                <div className="flex justify-center items-center gap-2 lg:gap-4 flex-wrap">
                    <input
                        className="interBody text-black/90 rounded-md border border-gray-300 px-4 py-2 focus:border-gray-400 focus:ring-0"
                        type="email"
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogin(email);
                        }}
                        className=""
                        disabled={loading}
                    >
                        <span className="interBody text-blue-600">{loading ? "Loading" : "Send magic link"}</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
