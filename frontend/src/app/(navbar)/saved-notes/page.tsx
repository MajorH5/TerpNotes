"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiHeart, FiExternalLink } from "react-icons/fi";

interface Note {
    id: string;
    title: string;
    course: string;
    semester: string;
    savedAt: string;
}

export default function SavedNotes() {
    const auth = getAuth(app);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            } else {
                fetchSavedNotes(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchSavedNotes = async (uid: string) => {
        const mockSavedNotes: Note[] = [
            {
                id: "note1",
                title: "ENGL101 Final Essay Outline",
                course: "ENGL101",
                semester: "Spring 2023",
                savedAt: "2024-04-01",
            },
            {
                id: "note2",
                title: "CMSC216 Pointers Refresher",
                course: "CMSC216",
                semester: "Fall 2023",
                savedAt: "2024-04-05",
            },
        ];

        setNotes(mockSavedNotes);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F1E5]">
                <div className="w-12 h-12 border-4 border-[#CD1015] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#F9F1E5] py-20 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold text-[#1F1F1F] mb-8 text-center" style={{ fontFamily: "sen" }}>
                    ❤️ Saved Notes
                </h1>

                {notes.length === 0 ? (
                    <p className="text-center text-[#555] text-lg">
                        You haven’t saved any notes yet.
                        <Link href="/browse-notes" className="text-[#CD1015] hover:underline ml-1">
                            Browse notes →
                        </Link>
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-white border border-[#e0d7cb] rounded-2xl shadow p-5 flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-[#1F1F1F] mb-1">{note.title}</h2>
                                    <p className="text-sm text-[#555] mb-2">
                                        {note.course} • {note.semester}
                                    </p>
                                    <p className="text-xs text-[#999]">Saved on {note.savedAt}</p>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <Link
                                        href={`/notes/${note.id}`}
                                        className="text-sm text-[#CD1015] hover:underline flex items-center gap-1"
                                    >
                                        View <FiExternalLink size={16} />
                                    </Link>

                                    <button
                                        className="relative group text-[#CD1015] hover:text-[#a60d11] flex items-center gap-1"
                                        onClick={() => console.log("Unsave logic here")}
                                    >
                                        <span className="relative w-5 h-5">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                className="absolute inset-0 w-5 h-5 opacity-100 group-hover:opacity-0 transition-opacity duration-150"
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                                                    5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
                                                    4.5 2.09C13.09 3.81 14.76 3 16.5 
                                                    3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                                                    6.86-8.55 11.54L12 21.35z" />
                                            </svg>

                                            <FiHeart className="absolute inset-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                                        </span>
                                        <span className="text-sm">Unsave</span>
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
