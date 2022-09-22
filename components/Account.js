import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Avatar from "./Avatar";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [website, setWebsite] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);

    useEffect(() => {
        getProfile();
    }, [session]);

    async function getCurrentUser() {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) {
            throw error;
        }

        if (!session?.user) {
            throw new Error("User not logged in");
        }

        return session.user;
    }

    async function getProfile() {
        try {
            setLoading(true);
            const user = await getCurrentUser();

            let { data, error, status } = await supabase
                .from("profiles")
                .select(`username, website, avatar_url`)
                .eq("id", user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({ username, website, avatar_url }) {
        try {
            setLoading(true);
            const user = await getCurrentUser();

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            };

            let { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[100vh] flex flex-col gap-20 md:flex-row justify-center items-center p-10 lg:p-20">
            <section className="flex justify-center items-center lg:w-1/2">
                <h1 className="interHeader text-center">
                    {!username ? "Welcome back." : `Welcome back, ${username}.`}
                </h1>
            </section>
            <section className="flex flex-col w-full lg:flex-row gap-10 justify-center items-center md:w-1/2">
                <Avatar
                    url={avatar_url}
                    size={150}
                    onUpload={(url) => {
                        setAvatarUrl(url);
                        updateProfile({ username, website, avatar_url: url });
                    }}
                />
                <div className="flex flex-col gap-4 w-full sm:w-60">
                    <div>
                        <label
                            htmlFor="email"
                            className="interBody block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="text"
                                name="email"
                                className="interBody block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                value={session.user.email}
                                disabled
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="username"
                            className="interBody block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                id="username"
                                type="text"
                                className="interBody block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                value={username || ""}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="website"
                            className="interBody block text-sm font-medium text-gray-700"
                        >
                            Website
                        </label>
                        <div className="mt-1">
                            <input
                                id="website"
                                type="url"
                                className="interBody block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                value={website || ""}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={() =>
                                updateProfile({ username, website, avatar_url })
                            }
                            disabled={loading}
                        >
                            {loading ? "Loading ..." : "Update"}
                        </button>
                    </div>

                    <div>
                        <button
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => supabase.auth.signOut()}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
