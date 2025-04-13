"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiTrash2, FiExternalLink } from "react-icons/fi";

interface Note {
  id: string;
  title: string;
  course: string;
  semester: string;
  createdAt: string;
}

export default function MyNotes() {
  const auth = getAuth(app);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserEmail(user.email || null);
        fetchUserNotes(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserNotes = async (uid: string) => {
    // Replace this with real API call
    const mockNotes: Note[] = [
    //   {
    //     id: "1",
    //     title: "CMSC131 Midterm Review",
    //     course: "CMSC131",
    //     semester: "Fall 2023",
    //     createdAt: "2024-03-01",
    //   },
    //   {
    //     id: "2",
    //     title: "MATH140 Derivatives Sheet",
    //     course: "MATH140",
    //     semester: "Spring 2024",
    //     createdAt: "2024-03-20",
    //   },
    ];

    setNotes(mockNotes); // swap with actual data from Firestore or API
    setLoading(false);
  };

  const handleDelete = (noteId: string) => {
    // Add deletion logic here
    alert(`Delete note with ID: ${noteId}`);
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
          🗂️ My Notes
        </h1>

        {notes.length === 0 ? (
          <p className="text-center text-[#555] text-lg">
            You haven’t uploaded any notes yet.
            <Link href="/upload-note" className="text-[#CD1015] hover:underline ml-1">
              Upload one now →
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
                  <p className="text-xs text-[#999]">Uploaded on {note.createdAt}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/notes/${note.id}`}
                    className="text-sm text-[#CD1015] hover:underline flex items-center gap-1"
                  >
                    View <FiExternalLink size={16} />
                  </Link>

                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-[#CD1015] hover:text-[#a60d11] flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
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
