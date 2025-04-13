"use client";

import Image from "next/image";
import Link from "next/link";

import Logo from "@/../public/assets/images/logo.svg";
import { usePathname } from "next/navigation";

import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";

export default function BrowseLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // Clean up listener
    }, [auth]);

    return (
        <>
            <header className="sticky top-0 z-50 bg-[#F9F1E5]/90 backdrop-blur-md border-b border-[#e0d7cb] shadow-sm">
                <nav className="max-w-[80%] mx-auto px-6 py-3 flex justify-between items-center rounded-b-2xl">
                    <Link href="/" className="flex items-center gap-3 select-none">
                        <Image src={Logo} alt="TerpNotes Logo" width={30} height={30} />
                        <h1 className="text-xl font-bold text-[#1F1F1F]">
                            TerpNotes
                        </h1>
                    </Link>

                    <div className="items-center hidden gap-4 md:flex">
                        {/* Nav Buttons */}
                        <div className="items-center hidden gap-4 md:flex">

                            {user ? (
                                <>
                                    <div className="text-gray-800 px-5 py-2 rounded-xl bg-[#dcd1c0]">
                                        Welcome, <b>{user.displayName || user.email}</b>!
                                    </div>

                                    <Link href="/my-notes">
                                        <button className="bg-white border border-[#CD1015] text-[#CD1015] px-5 py-2 rounded-xl hover:bg-[#CD1015] hover:text-white transition-all shadow-md whitespace-nowrap">
                                            🎓 My Notes
                                        </button>
                                    </Link>

                                    <Link href="/saved-notes">
                                        <button className="bg-white border border-[#CD1015] text-[#CD1015] px-5 py-2 rounded-xl hover:bg-[#CD1015] hover:text-white transition-all shadow-md whitespace-nowrap">
                                            📚 Saved Notes
                                        </button>
                                    </Link>

                                    <Link href="/upload-note">
                                        <button className="bg-[#CD1015] text-white px-5 py-2 rounded-xl hover:bg-[#a60d11] transition-all shadow-md whitespace-nowrap">
                                            <FiUpload className="text-white" size={20} />
                                        </button>
                                    </Link>

                                    {pathname !== "/browse-notes" &&
                                        <Link href="/browse-notes" passHref>
                                            <button className="bg-transparent hover:bg-[#CD1015] text-[#CD1015] border hover:text-white px-5 py-2 rounded-xl border-[#CD1015] transition-all">
                                                Browse Notes
                                            </button>
                                        </Link>
                                    }

                                    <button
                                        onClick={() => getAuth(app).signOut()}
                                        className="px-5 py-2 text-black transition-all cursor-pointer hover:scale-105"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" passHref>
                                        <button className="bg-[#CD1015] hover:bg-[#a60d11] transition-all text-white px-5 py-2 rounded-xl border hover:scale-105">
                                            Log In / Sign Up!
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
            {children}
        </>
    );
}