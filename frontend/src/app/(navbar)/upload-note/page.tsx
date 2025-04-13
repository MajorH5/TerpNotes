"use client";

import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUpload } from "react-icons/fi";

import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth"

import Notebook from "@/../public/assets/images/decorations/notebook_drawing.svg";
import Flower from "@/../public/assets/images/decorations/flower_drawing.svg";
import Lightbulb from "@/../public/assets/images/decorations/lightbulb.svg";

import SearchBar from "@/components/search-bar";
import { setMaxListeners } from "events";

interface FormData {
  title: string;
  topic: string;
  course: string;
  file: File | null;
}

export default function UploadNote() {
  const auth = getAuth(app);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    course: "",
    topic: "",
    file: null,
  });
  const [loading, setLoading] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Note uploaded successfully!");
  };

  const courseList = [
    "CMSC131",
    "CMSC216",
    "CMSC351",
    "MATH140",
    "PHYS161",
    "ENES100",
    "ECON200",
    "ARTH200",
    "PSYC100",
    "HIST200",
    "STAT400",
    "BSCI170",
    "CHEM135",
    "GEOG202",
    "BIO120",
    "SPAN103",
  ];

  const router = useRouter(); // Add this line inside the component

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user === null) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F1E5]">
        <div className="w-12 h-12 border-4 border-[#CD1015] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F9F1E5] py-20 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-left mb-6">
          <Link href="/browse-notes" className="text-[#CD1015] hover:underline text-sm font-medium">
            ← Back to Notes
          </Link>
        </div>
        <h2 className="text-4xl font-extrabold text-[#1F1F1F] mb-6">
          Upload a <span className="relative inline-block">Note</span>
        </h2>
        <p className="text-[#333] max-w-xl mx-auto text-lg mb-10">
          Help your fellow Terps by sharing your notes for any UMD course. Gain recognition and help others succeed!
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-[#fff9f1] border border-[#e0d7cb] rounded-2xl shadow-md p-8 text-left space-y-6"
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[#1F1F1F]">Title</label>
              <span className="text-xs text-[#888]">
                {formData.title.length}/100
              </span>
            </div>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={4}
              maxLength={100}
              className="w-full border border-[#e0d7cb] px-4 py-2 rounded-xl bg-white text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#CD1015]"
            />
          </div>


          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[#1F1F1F]">Topic</label>
              <span className="text-xs text-[#888]">
                {formData.topic.length}/100
              </span>
            </div>
            <input
              name="topic"
              type="text"
              value={formData.topic}
              onChange={handleChange}
              required
              minLength={4}
              maxLength={100}
              placeholder="e.g., Midterm Review"
              className="w-full border border-[#e0d7cb] px-4 py-2 rounded-xl bg-white text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#CD1015]"
            />
          </div>



          <div>
            <label className="block font-semibold text-[#1F1F1F] mb-2">Course</label>
            <SearchBar
              items={courseList}
              placeholder="e.g., CMSC131"
              onSelect={(course) =>
                setFormData((prev) => ({ ...prev, course }))
              }
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1F1F1F] mb-2">Choose Your File</label>
            <div className="relative border border-[#e0d7cb] rounded-xl bg-white px-4 py-3 flex items-center gap-4 hover:shadow-md transition-all">
              <FiUpload className="text-[#CD1015]" size={20} />
              <span className="text-[#1F1F1F] text-sm">
                {formData.file !== null ? formData.file?.name : "No file selected"}
              </span>
              <input
                type="file"
                name="file"
                accept="application/pdf,image/*"
                onChange={handleChange}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-[#777] mt-1">Accepted: PDF, JPG, PNG, etc.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#CD1015] hover:bg-[#a60d11] text-white py-3 rounded-xl font-semibold transition-all"
          >
            Upload Note
          </button>
        </form>

        <div className="flex justify-center gap-6 mt-12 opacity-80">
          <Image src={Notebook} alt="Notebook" className="w-16 h-16 animate-float" />
          <Image src={Flower} alt="Flower" className="w-14 h-14 animate-float delay-100" />
          <Image src={Lightbulb} alt="Lightbulb" className="w-12 h-12 animate-float delay-200" />
        </div>
      </div>
    </section>
  );
}
