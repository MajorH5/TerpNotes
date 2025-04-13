"use client";

import Image from "next/image"
import Link from "next/link"

import Logo from "@/../public/assets/images/logo.svg"

import Flower from "@/../public/assets/images/decorations/flower_drawing.svg"
import Notebook from "@/../public/assets/images/decorations/notebook_drawing.svg"
import SmallFlower from "@/../public/assets/images/decorations/small_flower_drawing.svg"
import UMDLogoHandwritten from "@/../public/assets/images/decorations/umd_logo_drawing.svg"

import Equation from "@/../public/assets/images/decorations/equation.svg"
import Hearts from "@/../public/assets/images/decorations/hearts.svg"
import Lightbulb from "@/../public/assets/images/decorations/lightbulb.svg"
import PieChart from "@/../public/assets/images/decorations/pie_chart.svg"

import UMDLogo from "@/../public/assets/images/umd_logo.png"

import { useState, useEffect } from "react"
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

const slides = [
  {
    title: "Discover Quality Notes",
    description: "Browse top-rated notes across hundreds of UMD courses. All content is student-created and curated for clarity and usefulness.",
    graphic: "",
  },
  {
    title: "Easily Share Your Notes",
    description: "Help your fellow Terps by uploading your class notes. Gain recognition and contribute to the UMD community effortlessly.",
    graphic: "",
  },
  {
    title: "Organize Your Study Life",
    description: "Keep all your favorite notes in one place, track what you’ve read, and build your own custom study library.",
    graphic: "",
  },
  {
    title: "Collaborate With Peers",
    description: "Follow classmates, comment on notes, and build study groups all within TerpNotes. Learning is better together.",
    graphic: "",
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showToast, setShowToast] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up listener
  }, [auth]);

  return (
    <div className="overflow-x-hidden">
      <header className="fixed top-0 z-40 justify-center hidden w-full pt-6 select-none md:flex backdrop-blur-md">
        <nav className="w-full max-w-[80%] rounded-2xl border border-[#e0d7cb] bg-[#F9F1E5]/90 px-6 py-1 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src={Logo}
              alt="TerpNotes Logo"
              width={30}
              height={30}
            />
            <h1 className="text-xl text-[#1F1F1F] font-bold">
              TerpNotes
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-gray-800 px-5 py-2 rounded-xl bg-[#dcd1c0]">
                  Welcome, <b>{user.displayName || user.email}</b>!
                </div>

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

            <Link href="/browse-notes" passHref>
              <button className="bg-transparent hover:bg-[#CD1015] text-[#CD1015] border hover:text-white px-5 py-2 rounded-xl border-[#CD1015] transition-all">
                Browse Notes
              </button>
            </Link>
          </div>
        </nav>

        {showToast && (
          <div className="fixed top-[4.5rem] md:top-[5.5rem] w-full z-30 flex justify-center px-4">
            <div className="bg-[#CD1015] text-white px-6 py-3 rounded-xl shadow-lg max-w-3xl flex items-center justify-between gap-4 w-full border border-[#a60d11]">
              <Link href="/blog/release-day" className="text-sm font-medium hover:underline sm:text-base">
                🚀 We just launched! Check out what's new →
              </Link>
              <button
                onClick={() => setShowToast(false)}
                className="text-lg font-bold leading-none text-white hover:text-gray-200"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="md:hidden fixed top-0 left-0 z-50 w-full px-4 py-4 bg-[#F9F1E5] border-b border-[#e0d7cb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="TerpNotes Logo" width={30} height={30} />
          <h1 className="text-lg font-bold text-[#1F1F1F]">TerpNotes</h1>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="text-[#1F1F1F] focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {showToast && (
          <div className="fixed top-[4.5rem] md:top-[5.5rem] w-full z-30 flex justify-center px-4">
            <div className="bg-[#CD1015] text-white px-6 py-3 rounded-xl shadow-lg max-w-3xl flex items-center justify-between gap-4 w-full border border-[#a60d11]">
              <Link href="/blog/release-day" className="text-sm font-medium hover:underline sm:text-base">
                🚀 We just launched! Check out what's new →
              </Link>
              <button
                onClick={() => setShowToast(false)}
                className="text-lg font-bold leading-none text-white hover:text-gray-200"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setSidebarOpen(false)}>
          <div
            className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-[#F9F1E5] border-r border-[#e0d7cb] p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1F1F1F]">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <svg className="w-5 h-5 text-[#1F1F1F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link href="/signup">
                <button className="bg-[#CD1015] text-white px-4 py-2 rounded-lg">Sign Up</button>
              </Link>
              <Link href="/login">
                <button className="bg-[#CD1015] text-white px-4 py-2 rounded-lg">Log In</button>
              </Link>
              <Link href="/browse-notes">
                <button className="border border-[#CD1015] text-[#CD1015] px-4 py-2 rounded-lg">Browse Notes</button>
              </Link>
            </nav>
          </div>
        </div>
      )}

      <section className="min-h-screen flex flex-col items-center justify-center bg-[#F9F1E5] pt-32 relative">
        <div className="relative px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 space-y-2 text-[#1F1F1F]">
            <span className="relative inline-block">
              All the{" "}
              <span className="relative inline-block">
                Notes
                <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-2 left-0 w-full h-[0.6em]" preserveAspectRatio="none">
                  <path d="M2 15C20 5 80 20 98 10" stroke="#CD1015" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              .
            </span>
            <br />
            <span className="relative inline-block">
              None of the{" "}
              <span className="relative inline-block">
                Stress
                <svg viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 w-[120%] h-[0.4em] -translate-y-1/5 -translate-x-1/2" preserveAspectRatio="none">
                  <line x1="10" y1="5" x2="190" y2="5" stroke="#CD1015" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              .
            </span>
          </h2>
          <p className="text-[#333] max-w-xl mx-auto text-lg mt-2">
            TerpNotes is a UMD-focused note-sharing and studying platform where students compile, rate, and explore notes across semesters.
          </p>
          <div className="mt-8">
            <Link href="/browse-notes">
              <button className="bg-[#CD1015] hover:bg-[#a60d11] text-white px-6 py-3 rounded-xl border hover:scale-105 transition-all">
                Browse Notes
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image src={Flower} alt="Flower" className="logo floating-logo" />
          <Image src={Notebook} alt="Notebook" className="logo floating-logo" />
          <Image src={SmallFlower} alt="Small Flower" className="hidden logo floating-logo md:block" />
          <Image src={UMDLogoHandwritten} alt="UMD Logo" className="logo floating-logo" />
          <Image src={Equation} alt="Equation" className="logo floating-logo" />
          <Image src={Hearts} alt="Hearts" className="logo floating-logo" />
          <Image src={Lightbulb} alt="Lightbulb" className="logo floating-logo" />
          <Image src={PieChart} alt="Pie Chart" className="hidden logo floating-logo md:block" />
        </div>

        <div className="relative w-1/2 mt-10 overflow-hidden select-none">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#F9F1E5] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#F9F1E5] to-transparent z-10" />

          <div className="whitespace-nowrap animate-marquee text-[#1F1F1F] font-semibold text-lg flex gap-2 md:gap-16">
            {[
              "CMSC131", "MATH140", "ENES100", "PHYS161", "BSCI170",
              "ECON200", "ARTH200", "PSYC100", "HIST200", "STAT400"
            ].map((course, index) => (
              <span key={index} className="inline-block">
                {course}
              </span>
            ))}

            {[
              "CMSC131", "MATH140", "ENES100", "PHYS161", "BSCI170",
              "ECON200", "ARTH200", "PSYC100", "HIST200", "STAT400"
            ].map((course, index) => (
              <span key={`dup-${index}`} className="inline-block">
                {course}
              </span>
            ))}
          </div>
        </div>
        <Link target="_blank" href="https://www.umd.edu/">
          <Image
            className="mt-10"
            src={UMDLogo}
            alt="University of Maryland Logo"
            width={150}
            height={50}
          />
        </Link>
      </section>

      <section className="bg-[#F9F1E5] py-10 flex flex-col items-center text-center border border-gray">
        <div className="flex items-center gap-3 mb-3">
          <Image src={Hearts} alt="Hearts" width={30} height={30} className="text-red-500" style={{ filter: 'invert(18%) sepia(87%) saturate(6875%) hue-rotate(357deg) brightness(88%) contrast(114%)' }} />
          <p className="text-lg md:text-xl font-semibold text-[#1F1F1F]">
            Loved by students at
          </p>
          <Image src={UMDLogoHandwritten} alt="UMD Logo" width={32} height={32} />
          <Image src={Hearts} alt="Hearts" width={30} height={30} className="text-red-500" style={{ filter: 'invert(18%) sepia(87%) saturate(6875%) hue-rotate(357deg) brightness(88%) contrast(114%)' }} />
        </div>
        <p className="text-[#333] max-w-xl text-sm">
          Terps love to use TerpNotes to crush exams, organize their semesters, and share top-tier class notes!
        </p>
      </section>


      <section className="relative bg-[#F3E8D8] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#cd101533_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

        <svg className="absolute top-24 left-4 w-28 opacity-10 animate-float" viewBox="0 0 100 20" fill="none">
          <path d="M0 10 C30 -10, 70 30, 100 10" stroke="#CD1015" strokeWidth="3" fill="none" />
        </svg>

        <svg className="absolute w-32 bottom-10 left-10 opacity-10 animate-pulse-slow" viewBox="0 0 150 50" fill="none">
          <path d="M10 25 Q30 5, 50 25 Q70 45, 90 25 Q110 5, 130 25" stroke="#CD1015" strokeWidth="2" fill="none" />
        </svg>

        <svg className="absolute w-40 bottom-16 right-10 animate-float opacity-10" viewBox="0 0 150 50" fill="none">
          <path d="M0 30 Q30 10, 60 30 T120 30" stroke="#CD1015" strokeWidth="2" fill="none" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#1F1F1F] mb-4 relative inline-block">
            📚 <span className="relative inline-block">
              Notes
              <svg
                viewBox="0 0 100 20"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-1 left-0 w-full h-[0.6em]"
                preserveAspectRatio="none"
              >
                <path d="M2 15C20 5 80 20 98 10" stroke="#CD1015" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>{" "}
            Library Preview
          </h2>

          <p className="text-[#333] text-lg mb-12 max-w-2xl mx-auto">
            Explore top-rated notes from popular UMD courses — curated and shared by students like you.
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { course: "CMSC131", title: "Intro to Java – Midterm Review", rating: 4.8 },
              { course: "MATH140", title: "Limits, Derivatives & Integrals", rating: 4.7 },
              { course: "PHYS161", title: "Mechanics Concept Summary", rating: 4.5 },
              { course: "BSCI170", title: "Cell Biology Final Guide", rating: 4.9 },
              { course: "ECON200", title: "Supply & Demand Diagrams", rating: 4.6 },
              { course: "PSYC100", title: "Memory & Learning Notes", rating: 4.4 }
            ].map((note, idx) => (
              <div
                key={idx}
                className="bg-[#F9F1E5] border border-[#e0d7cb] rounded-2xl shadow-md p-6 text-left hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-sm text-[#CD1015] font-bold mb-1">
                  {note.course}
                </div>
                <div className="text-xl font-semibold text-[#1F1F1F] mb-2">
                  {note.title}
                </div>
                <div className="text-[#666] text-sm">⭐ {note.rating} rating</div>
                <div className="flex items-end justify-end w-full mt-4">
                  <button className="bg-transparent hover:bg-[#CD1015] text-[#CD1015] border hover:text-white px-5 py-2 rounded-xl border-[#CD1015]">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button className="bg-[#CD1015] hover:bg-[#a60d11] text-white px-6 py-3 rounded-xl border hover:scale-105 transition-all">
              Browse All Notes
            </button>
          </div>
        </div>
      </section>

      <section className="min-h-screen bg-[#F9F1E5] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeIndex === index
                  ? "bg-[#CD1015] text-white shadow-md"
                  : "text-[#CD1015] hover:bg-[#f1dbcb]"
                  }`}

              >
                {slide.title.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center p-5 gap-12 border border-[#F3E8D8] shadow-sm rounded border-gray h-[500px]">
            <div className="w-full text-left lg:w-1/2">
              <h3
                className="text-3xl font-extrabold text-[#1F1F1F] mb-4"

              >
                {slides[activeIndex].title}
              </h3>
              <p className="text-[#333] text-lg leading-relaxed max-w-xl">
                {slides[activeIndex].description}
              </p>
            </div>

            <div className="flex justify-center w-full lg:w-1/2">
              <Image
                src={slides[activeIndex].graphic}
                alt="Slide Graphic"
                className="max-h-[400px] w-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#F3E8D8] py-20 px-6 relative overflow-hidden">
        {/* Heading */}
        <div className="max-w-5xl mx-auto mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-[#1F1F1F] mb-4 relative inline-block" style={{ fontFamily: "sen" }}>
            💬 Student{" "}
            <span className="relative inline-block">
              Reviews
              {/* Red underline SVG */}
              <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-2 left-0 w-full h-[0.6em]" preserveAspectRatio="none">
                <path d="M2 15C20 5 80 20 98 10" stroke="#CD1015" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>{" "}
            & Ratings
          </h2>
          <p className="text-[#333] max-w-xl mx-auto text-lg mt-2">
            Hear what other Terps are saying about the notes that helped them succeed.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Habib A.",
              major: "Computer Science",
              review: "The CMSC131 notes were a lifesaver before the midterm. Super clear and well-organized!",
              rating: 5,
            },
            {
              name: "Olaniyi S.",
              major: "Psychology",
              review: "Loved the layout of the PSYC100 materials — I used them all semester long!",
              rating: 4.8,
            },
            {
              name: "Kevin Y.",
              major: "Biology",
              review: "Honestly better than my own notes. Helped me review fast before finals.",
              rating: 4.7,
            },
          ].map((student, idx) => (
            <div
              key={idx}
              className="bg-[#F9F1E5] border border-[#e0d7cb] rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-[#CD1015] text-sm font-semibold mb-1" style={{ fontFamily: "sen" }}>
                {student.name} • {student.major}
              </div>
              <p className="text-[#1F1F1F] text-base mb-3" style={{ fontFamily: "sen" }}>
                “{student.review}”
              </p>
              <div className="text-[#666] text-sm">⭐ {student.rating} rating</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link href="/login">
            <button className="bg-[#CD1015] hover:bg-[#a60d11] text-white px-6 py-3 rounded-xl border hover:scale-105 transition-all">
              Write a Review
            </button>
          </Link>
        </div>

        <div className="absolute w-64 h-64 pointer-events-none -top-10 -left-10 opacity-10 rotate-12">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="#CD1015" strokeWidth="4" strokeDasharray="4 8" />
          </svg>
        </div>
        <div className="absolute -bottom-16 -right-16 opacity-10 w-64 h-64 pointer-events-none rotate-[25deg]">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 90 C 40 20, 60 80, 90 10" stroke="#CD1015" strokeWidth="2" />
          </svg>
        </div>
      </section>

      <section className="relative bg-[#F9F1E5] py-24 px-6 overflow-hidden">
        <svg className="absolute w-32 top-10 left-8 opacity-10 animate-float" viewBox="0 0 100 20" fill="none">
          <path d="M0 10 C30 -10, 70 30, 100 10" stroke="#CD1015" strokeWidth="3" fill="none" />
        </svg>

        <svg className="absolute w-40 bottom-16 right-10 opacity-10 animate-pulse-slow" viewBox="0 0 120 20" fill="none">
          <path d="M0 15 Q30 5, 60 15 T120 15" stroke="#CD1015" strokeWidth="2" fill="none" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F1F1F] mb-6">
            Ready to{" "}
            <span className="relative inline-block">
              Join
              <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-3 left-0 w-full h-[0.6em]" preserveAspectRatio="none">
                <path d="M2 15C20 5 80 20 98 10" stroke="#CD1015" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>{" "}
            the Study Revolution?
          </h2>
          <p className="text-lg text-[#333] mb-10">
            Sign up today and explore the best UMD notes, study guides, and resources — curated by students, for students.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <button className="bg-[#CD1015] hover:bg-[#a60d11] transition-all text-white px-6 py-3 rounded-xl border hover:scale-105 text-lg">
                Get Started
              </button>
            </Link>
            <Link href="/browse-notes">
              <button className="bg-transparent hover:bg-[#CD1015] text-[#CD1015] border hover:text-white px-6 py-3 rounded-xl border-[#CD1015] text-lg">
                Browse Notes
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
