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
  const [classes, setClasses] = useState<string[] | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  const MAX_FILE_SIZE_MB = 10;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && name === "file") {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Only JPG and PNG files are allowed.");
        return;
      }

      if (file.size > maxBytes) {
        alert(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      setFormData((prev) => ({ ...prev, file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uploading) return; // debounce protection
    setUploading(true);

    if (!formData.title || !formData.topic || !formData.course || !formData.file) {
      alert("Please complete all fields.");
      setUploading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in.");
        setUploading(false);
        return;
      }

      const idToken = await user.getIdToken();

      const payload = new FormData();
      payload.append("user_id", user.uid);
      payload.append("course_name", formData.course);
      payload.append("professor_name", formData.topic);
      payload.append("image", formData.file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME!}/database/api/v1/notes/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: payload,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to upload note.");
      }

      router.push("/my-notes");
    } catch (err: any) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
      setUploading(false);
    }
  };



  useEffect(() => {
    fetch("/output.json")
      .then((res) => res.json())
      .then((json) => {
        setClasses(Object.keys(json));
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

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
              <label className="font-semibold text-[#1F1F1F]">
                Title <span className="text-red-600">*</span>
              </label>
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
              disabled={uploading}
              maxLength={100}
              className="w-full border border-[#e0d7cb] px-4 py-2 rounded-xl bg-white text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#CD1015]"
            />
          </div>


          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[#1F1F1F]">
                Topic <span className="text-red-600">*</span>
              </label>
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
              disabled={uploading}
              minLength={4}
              maxLength={100}
              placeholder="e.g., Midterm Review"
              className="w-full border border-[#e0d7cb] px-4 py-2 rounded-xl bg-white text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#CD1015]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#1F1F1F]">
              Course <span className="text-red-600">*</span>
            </label>
            <SearchBar
              items={classes ?? []}
              placeholder="e.g., CMSC131"
              disabled={uploading}
              onSelect={(course) =>
                setFormData((prev) => ({ ...prev, course }))
              }
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1F1F1F] mb-2">
              Choose Your File <span className="text-red-600">*</span>
            </label>
            <div className="relative border border-[#e0d7cb] rounded-xl bg-white px-4 py-3 flex items-center gap-4 hover:shadow-md transition-all">
              <FiUpload className="text-[#CD1015]" size={20} />
              <span className="text-[#1F1F1F] text-sm truncate">
                {formData.file ? formData.file.name : "No file selected"}
              </span>
              <input
                type="file"
                name="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleChange}
                required
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className={`text-xs mt-1 ${formData.file && formData.file.size > MAX_FILE_SIZE_MB * 1024 * 1024 ? "text-red-600" : "text-[#777]"}`}>
              Accepted: JPG, PNG — Max size: {MAX_FILE_SIZE_MB}MB
            </p>
          </div>


          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 rounded-xl font-semibold transition-all flex justify-center items-center gap-2 ${uploading
                ? "bg-[#CD1015]/60 cursor-not-allowed"
                : "bg-[#CD1015] hover:bg-[#a60d11] text-white"
              }`}
          >
            {uploading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {uploading ? "Uploading..." : "Upload Note"}
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
