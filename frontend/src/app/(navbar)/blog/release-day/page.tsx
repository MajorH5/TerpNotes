import Link from "next/link"
import "../blog-styles.css"


export default function ReleaseDayBlog() {
    return (
        <div className="blog-container bg-[#F9F1E5] py-20 px-6">
            {/* Main Container */}
            <div className="max-w-4xl mx-auto text-[#1F1F1F] space-y-2">

                {/* Back Link */}
                <div className="text-[#CD1015] text-md font-semibold">
                    <a href="/" className="hover:underline">⟵ Back to Home</a>
                </div>

                {/* Blog Title */}
                <h1 className="text-4xl font-extrabold mb-6 text-[#1F1F1F]" style={{ fontFamily: "sen" }}>
                    🎉 TerpNotes Launches: A New Way to Study and Share Notes!
                </h1>

                {/* Author and Date */}
                <div className="flex items-center gap text-[#333] text-md opacity-70">
                    <span>By: TerpNotes Team</span>
                    <span className="text-[#1F1F1F] text-xl mx-2">•</span>
                    <span>April 12, 2025</span>
                </div>

                {/* Blog Content */}
                <div className="text-xl text-[#1F1F1F] space-y-6">

                    {/* Introduction */}
                    <section>
                        <h3 className="text-2xl font-semibold mb-4">Introduction</h3>
                        <p className="text-md text-justify indent-12">
                            We’re thrilled to announce the launch of TerpNotes, a note-sharing platform built by students, for students. Our goal is simple: make studying easier by giving you access to shared notes across various courses, professors, and semesters. Whether you’re looking to get ahead in your studies or catch up on missed content, TerpNotes is your go-to resource.
                        </p>
                    </section>

                    {/* Story Section */}
                    <section>
                        <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
                        <p className="text-md text-justify indent-12">
                            The idea behind TerpNotes originated from the frustrations of students trying to find reliable and high-quality notes. Our team, made up of UMD students, understood that note-sharing could be more efficient, which led us to build this platform. With TerpNotes, you can contribute to the community by sharing your notes and help others succeed in their studies.
                        </p>
                    </section>

                    {/* Features of TerpNotes */}
                    <section>
                        <h3 className="text-2xl font-semibold mb-4">What’s New in Version 1.0?</h3>
                        <p className="text-md text-justify indent-12">
                            In this first version, we’ve focused on providing students with a clean and intuitive interface for browsing notes. Our platform is designed to help you quickly find notes based on courses, professors, and topics. Plus, each note is categorized, allowing you to filter and search for specific subjects with ease. You’ll also find a comment section under each note for peer discussions.
                        </p>
                    </section>

                    {/* Future Vision */}
                    <section>
                        <h3 className="text-2xl font-semibold mb-4">The Future of TerpNotes</h3>
                        <p className="text-md text-justify indent-12">
                            TerpNotes is just the beginning! Our future plans include adding more advanced features such as peer reviews, collaborative note-taking, and even an AI-powered search tool to help you find the most relevant notes. We are committed to continuously improving the platform based on your feedback. Join us as we evolve and help make studying easier for everyone.
                        </p>
                    </section>

                    {/* Call to Action */}
                    <section className="mt-12 text-center">
                        <p className="text-2xl font-semibold text-[#CD1015] mb-4">
                            Ready to get started? Join the TerpNotes community today!
                        </p>
                        <Link href="/signup">
                            <button className="cursor-pointer bg-[#CD1015] hover:bg-[#a60d11] text-white px-6 py-3 rounded-xl border hover:scale-105 transition-all">
                                Sign Up Now
                            </button>
                        </Link>
                    </section>

                </div>
            </div>

            {/* Optional Decorative SVG */}
            <div className="absolute -top-16 -left-16 opacity-10 w-64 h-64 pointer-events-none rotate-12">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" stroke="#CD1015" strokeWidth="4" strokeDasharray="4 8" />
                </svg>
            </div>
            <div className="absolute -bottom-16 -right-16 opacity-10 w-64 h-64 pointer-events-none rotate-[25deg]">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 90 C 40 20, 60 80, 90 10" stroke="#CD1015" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
}
