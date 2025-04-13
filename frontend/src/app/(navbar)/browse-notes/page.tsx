"use client";

import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function BrowseNotes() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState(["CMSC131", "Fall 2023"]);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const courses = [
        {
            course: "CMSC131",
            semester: "Fall 2023",
            tags: ["Introductory", "Java", "Project-based"],
            professors: [
                { name: "Dr. Lee", notes: 5 },
                { name: "Prof. Smith", notes: 3 },
            ],
        },
        {
            course: "MATH140",
            semester: "Spring 2024",
            tags: ["Core", "Calculus", "Popular"],
            professors: [{ name: "Dr. Johnson", notes: 4 }],
        },
        {
            course: "CMSC131",
            semester: "Fall 2023",
            tags: ["Introductory", "Java", "Project-based"],
            professors: [
                { name: "Dr. Lee", notes: 5 },
                { name: "Prof. Smith", notes: 3 },
            ],
        },
        {
            course: "MATH140",
            semester: "Spring 2024",
            tags: ["Core", "Calculus", "Popular"],
            professors: [{ name: "Dr. Johnson", notes: 4 }],
        },
        {
            course: "PHYS161",
            semester: "Fall 2022",
            tags: ["Physics", "Lab", "STEM"],
            professors: [
                { name: "Dr. Nguyen", notes: 6 },
                { name: "Prof. Patel", notes: 2 },
            ],
        },
        {
            course: "ENGL101",
            semester: "Spring 2023",
            tags: ["Writing", "Core", "Essays"],
            professors: [{ name: "Dr. Anderson", notes: 7 }],
        },
        {
            course: "CMSC216",
            semester: "Fall 2023",
            tags: ["Systems", "C Programming", "Intermediate"],
            professors: [
                { name: "Dr. Kim", notes: 9 },
                { name: "Prof. Rao", notes: 4 },
            ],
        },
        {
            course: "HIST200",
            semester: "Spring 2024",
            tags: ["History", "Essays", "Discussion"],
            professors: [{ name: "Dr. Baker", notes: 5 }],
        },
        {
            course: "ECON200",
            semester: "Fall 2022",
            tags: ["Economics", "Graphs", "Micro"],
            professors: [{ name: "Prof. Williams", notes: 3 }],
        },
        {
            course: "CHEM135",
            semester: "Fall 2023",
            tags: ["Chemistry", "STEM", "Lab"],
            professors: [
                { name: "Dr. Garcia", notes: 8 },
                { name: "Dr. Young", notes: 2 },
            ],
        },
        {
            course: "ARTH200",
            semester: "Spring 2024",
            tags: ["Art", "History", "Visual"],
            professors: [{ name: "Prof. Thompson", notes: 6 }],
        },
        {
            course: "PSYC100",
            semester: "Fall 2023",
            tags: ["Psychology", "Intro", "Behavior"],
            professors: [
                { name: "Dr. Martinez", notes: 5 },
                { name: "Dr. Taylor", notes: 1 },
            ],
        },
        {
            course: "CMSC351",
            semester: "Spring 2024",
            tags: ["Algorithms", "Theory", "Hard"],
            professors: [
                { name: "Dr. Chen", notes: 10 },
                { name: "Prof. Singh", notes: 7 },
            ],
        },
        {
            course: "STAT400",
            semester: "Fall 2022",
            tags: ["Statistics", "Data", "Math"],
            professors: [{ name: "Dr. Evans", notes: 4 }],
        },
        {
            course: "GEOG202",
            semester: "Spring 2023",
            tags: ["Maps", "Geography", "Environment"],
            professors: [{ name: "Prof. White", notes: 3 }],
        },
        {
            course: "BIO120",
            semester: "Fall 2023",
            tags: ["Biology", "Cells", "Lab"],
            professors: [
                { name: "Dr. Perez", notes: 6 },
                { name: "Dr. Wright", notes: 2 },
            ],
        },
        {
            course: "SPAN103",
            semester: "Spring 2024",
            tags: ["Language", "Spanish", "Beginner"],
            professors: [{ name: "Prof. Hernandez", notes: 5 }],
        },
    ];

    const removeFilter = (filter: string) =>
        setFilters(filters.filter((f) => f !== filter));

    return (
        <section className="min-h-screen bg-[#F9F1E5] px-4 sm:px-6 py-20 relative">
            {/* Background overlay for mobile */}
            {detailsOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 md:hidden"
                    onClick={() => setDetailsOpen(false)}
                />
            )}

            {/* Main layout */}
            <div className={`max-w-6xl mx-auto transition-all duration-300 ${detailsOpen ? "md:mr-[75%]" : ""}`}>
                <h1
                    className="text-4xl font-extrabold text-[#1F1F1F] mb-8 text-center"
                    style={{ fontFamily: "sen" }}
                >
                    Search notes
                </h1>

                <div className="flex items-center gap-3 bg-white border border-[#e0d7cb] rounded-xl px-5 py-3 shadow-md mb-4">
                    <FiSearch className="text-[#CD1015]" size={20} />
                    <input
                        type="text"
                        placeholder="Search for courses, professors, topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full focus:outline-none bg-transparent text-[#1F1F1F]"
                        style={{ fontFamily: "sen" }}
                    />
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                    {filters.map((filter, index) => (
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
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {courses.map((course, idx) => (
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
                                            onClick={() => setDetailsOpen(true)}
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
            </div>

            {/* Details Panel */}
            <div
                className={`fixed top-[52px] pt-3 right-0 h-[calc(100%-72px)] w-full md:w-[75%] bg-white z-40 shadow-xl transition-transform duration-300 ease-in-out ${detailsOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-full overflow-y-auto relative px-6 py-6 max-w-[80%] mx-auto">
                    <button
                        onClick={() => setDetailsOpen(false)}
                        className="absolute top-4 right-4 text-[#CD1015] hover:text-[#a60d11]"
                    >
                        <FiX size={28} />
                    </button>

                    <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">CMSC131 Notes</h2>

                    <p className="text-sm text-[#555] mb-4">
                        Shared by: <span className="font-semibold">Dr. Lee</span> | Fall 2023
                    </p>

                    {/* Mock contents */}
                    <div className="mb-6 space-y-4">
                        <div className="bg-[#F9F1E5] p-4 rounded-xl border border-[#e0d7cb]">
                            <p className="text-sm text-[#1F1F1F]">
                                <strong>OCR Preview:</strong> "In Java, all classes inherit from the Object class. This allows..."
                            </p>
                        </div>

                        <div className="bg-[#F3E8D8] p-4 rounded-xl border border-[#e0d7cb]">
                            <p className="text-sm text-[#1F1F1F]">
                                <strong>Comments:</strong>
                            </p>
                            <ul className="pl-4 mt-2 list-disc text-sm text-[#333] space-y-1">
                                <li>Really helped me prep for exam 1!</li>
                                <li>Wish it had some diagrams.</li>
                            </ul>
                        </div>

                        <div className="bg-[#F9F1E5] p-4 rounded-xl border border-[#e0d7cb]">
                            <p className="text-sm text-[#1F1F1F]">
                                <strong>Attached Images:</strong> [Preview or thumbnails go here]
                            </p>
                        </div>
                    </div>

                    <button className="bg-[#CD1015] text-white px-6 py-3 rounded-xl hover:bg-[#a60d11] transition-all">
                        Open Full Note
                    </button>
                </div>
            </div>

        </section >
    );
}
