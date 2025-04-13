"use client";

import { useEffect, useState, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import Link from "next/link";
import SearchBar from "@/components/search-bar";
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth"
interface Class {
    course: string;
    semester: string;
    tags: string[];
    professors: {
        name: string;
        notes: number;
    }[];
}

interface Note {
    note_id: string;
    user_uid: string;
    course_name: string;
    professor_name: string;
    image_id: string;
    s3_url: string;
    ocr_markdown: string;
    uploaded_at: string;
}

export default function BrowseNotes() {
    const auth = getAuth(app);
    const [filters, setFilters] = useState(["CMSC131", "Fall 2023"]);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<string[] | null>(null);
    const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    const [courses, setCourses] = useState<Class[]>([]);

    const [visibleCourses, setVisibleCourses] = useState<Class[]>(courses);

    const removeFilter = (filter: string) =>
        setFilters(filters.filter((f) => f !== filter));

    const setDetails = (detailsOpen: boolean) => {
        setDetailsOpen(detailsOpen);
        setTimeout(() => {
            document.body.scrollTo({ top: 0 });
        }, 1000);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const user = getAuth(app).currentUser;
                if (!user) return;

                const token = await user.getIdToken();

                const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/database/api/v1/notes/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error(data.error);
                    return;
                }

                // Convert backend shape to your expected `Class[]`
                const grouped: Record<string, Class> = {};

                data.notes.forEach((note: any) => {
                    const key = `${note.course_name}_${note.professor_name}_${note.uploaded_at}`;
                    if (!grouped[key]) {
                        grouped[key] = {
                            course: note.course_name,
                            semester: new Date(note.uploaded_at).getFullYear().toString(),
                            tags: [],
                            professors: [],
                        };
                    }

                    grouped[key].professors.push({
                        name: note.professor_name,
                        notes: 1,
                    });
                });

                const result = Object.values(grouped);
                setCourses(result);
                setVisibleCourses(result);
            } catch (err) {
                console.error("Failed to fetch notes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F1E5]">
                <div className="w-12 h-12 border-4 border-[#CD1015] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section className={`min-h-screen bg-[#F9F1E5] px-4 sm:px-6 relative ${detailsOpen ? "py-20 sm:py-9" : "py-20"}`}>
            {detailsOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 md:hidden"
                    onClick={() => setDetails(false)}
                />
            )}

            <div className="flex gap-1">
                <div className={`max-w-6xl mx-auto transition-all duration-300 ${detailsOpen ? "md:w-[25%] md:left-0 max-h-screen -h-[30px] overflow-y-scroll" : ""}`}>
                    <h1
                        className="text-4xl font-extrabold text-[#1F1F1F] mb-8 text-center"
                        style={{ fontFamily: "sen" }}
                    >
                        Search notes
                    </h1>
                    <div className="flex justify-center gap-3 overflow-x-hidden mb-6 px-4 no-scrollbar">
                        <Link href="/request-note">
                            <button className="bg-white border border-[#CD1015] text-[#CD1015] px-5 py-2 rounded-xl hover:bg-[#CD1015] hover:text-white transition-all shadow-md whitespace-nowrap">
                                📝 Request Notes
                            </button>
                        </Link>

                        <Link href="/upload-note">
                            <button className="bg-[#CD1015] text-white px-5 py-2 rounded-xl hover:bg-[#a60d11] transition-all shadow-md whitespace-nowrap">
                                + Upload Note
                            </button>
                        </Link>

                        <Link href="/top-notes">
                            <button className="bg-white border border-[#CD1015] text-[#CD1015] px-5 py-2 rounded-xl hover:bg-[#CD1015] hover:text-white transition-all shadow-md whitespace-nowrap">
                                🌟 Popular
                            </button>
                        </Link>
                    </div>


                    <div className={`z-20 bg-[#F9F1E5] ${detailsOpen ? "sticky top-0 pb-2" : ""}`}>
                        <div className="flex items-center gap-3 bg-white border border-[#e0d7cb] rounded-xl px-5 py-3 shadow-md mb-4">
                            <SearchBar
                                items={classes !== null ? classes : []}
                                placeholder="Search for courses, professors, topics..."
                                onSelect={() => void 0}
                                resultLimit={500}
                                onChange={(results, text) => {
                                    const matches = text.length === 0
                                        ? courses
                                        : courses.filter((course: Class) => results.includes(course.course));

                                    setVisibleCourses((prev) => {
                                        // prevent unnecessary state updates
                                        if (JSON.stringify(prev) === JSON.stringify(matches)) return prev;
                                        return matches;
                                    });
                                }}

                            />

                        </div>

                        <div className="flex flex-wrap gap-3 mb-4">
                            {/* {filters.map((filter, index) => (
                                <span
                                    key={index}
                                    className="bg-[#CD1015] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm"
                                >
                                    {filter}
                                    <FiX
                                        className="cursor-pointer"
                                        onClick={() => removeFilter(filter)}
                                    />
                                </span>
                            ))} */}
                        </div>
                    </div>


                    <div className={`grid grid-cols-1 gap-8 px-4 ${detailsOpen ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
                        {visibleCourses.map((course, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-[#e0d7cb] rounded-2xl shadow p-6"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3
                                        className="text-xl font-bold text-[#1F1F1F]"
                                        style={{ fontFamily: "sen" }}
                                    >
                                        {course.course}
                                    </h3>
                                    <span className="bg-[#EAD8C0] text-[#1F1F1F] text-sm px-3 py-1 rounded-full font-medium">
                                        {course.semester}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-[#F3E8D8] text-[#1F1F1F] px-2.5 py-1 rounded-full border border-[#e0d7cb]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-4 space-y-4">
                                    {course.professors.map((prof, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-grid justify-between items-center border border-[#e0d7cb] rounded-xl px-4 py-3 bg-[#F9F1E5]"
                                        >
                                            <div>
                                                <div className="font-semibold text-[#1F1F1F]">
                                                    {prof.name}
                                                </div>
                                                <div className="text-sm text-[#555]">
                                                    {prof.notes} notes available
                                                </div>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    setDetailsOpen(true);
                                                    setSelectedCourse(course.course);

                                                    try {
                                                        const user = auth.currentUser;
                                                        if (!user) return;

                                                        const token = await user.getIdToken();
                                                        const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/database/api/v1/notes/get?course_name=${course.course}&page=1&per_page=50`, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                            },
                                                        });

                                                        const data = await res.json();
                                                        if (res.ok) {
                                                            setSelectedNotes(data.notes);
                                                        } else {
                                                            console.error("Error fetching notes:", data.error);
                                                        }
                                                    } catch (err) {
                                                        console.error("Failed to fetch course notes:", err);
                                                    }
                                                }}
                                                className="cursor-pointer bg-transparent hover:bg-[#CD1015] text-[#CD1015] border hover:text-white px-4 py-2 rounded-xl border-[#CD1015] transition-all whitespace-nowrap"
                                            >
                                                View Notes
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {visibleCourses.length === 0 && (
                        <div className="px-4 text-center text-[#555] text-sm mt-8 opacity-70 transition-opacity duration-300">
                            No results found. Try a different search.
                        </div>
                    )}
                </div>

                <div
                    className={`pt-3 h-screen w-full md:w-[75%] bg-white shadow-xl transition-transform duration-300 ease-in-out ${detailsOpen ? "" : "hidden"}`}
                >
                    <div className="h-full overflow-y-auto relative px-6 py-6 max-w-[80%] mx-auto">
                        <button
                            onClick={() => setDetailsOpen(false)}
                            className="absolute top-4 right-4 text-[#CD1015] hover:text-[#a60d11]"
                        >
                            <FiX size={28} />
                        </button>

                        <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">{selectedCourse} Notes</h2>

                        {selectedNotes.length === 0 ? (
                            <p className="text-[#555] text-sm">No notes found for this course.</p>
                        ) : (
                            <div className="space-y-6">
                                {selectedNotes.map((note, idx) => (
                                    <div key={idx} className="border border-[#e0d7cb] rounded-2xl bg-[#fff9f1] p-4 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-[#1F1F1F]">{note.professor_name || "Unknown Uploader"}</p>
                                                <p className="text-sm text-[#555] mb-2">Uploaded {new Date(note.uploaded_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-[#1F1F1F] whitespace-pre-wrap mb-3">
                                            <strong>OCR:</strong> {note.ocr_markdown || "No OCR data."}
                                        </p>

                                        {note.s3_url && (
                                            <a href={note.s3_url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={note.s3_url}
                                                    alt="Note preview"
                                                    className="rounded-lg border border-[#e0d7cb] shadow-md w-full max-h-64 object-contain transition hover:scale-105"
                                                />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </section >
    );
}
