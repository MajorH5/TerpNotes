"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiTrash2, FiExternalLink } from "react-icons/fi";

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

export default function MyNotes() {
  const auth = getAuth(app);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        fetchUserNotes(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserNotes = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/database/api/v1/notes/mine?page=1&per_page=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNotes(data.notes);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this note?");
    if (!confirm) return;

    try {
      const token = await user.getIdToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/database/api/v1/notes/delete?note_id=${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to delete note.");
      }

      alert("Note deleted successfully.");
      fetchUserNotes(user); // ✅ re-fetch from the server
    } catch (err: any) {
      console.error(err);
      alert(`Delete failed: ${err.message}`);
    }
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
                key={note.image_id}
                className="bg-white border border-[#e0d7cb] rounded-2xl shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-[#1F1F1F] mb-1">{note.professor_name || "Untitled Note"}</h2>
                  <p className="text-sm text-[#555] mb-2">{note.course_name}</p>
                  <p className="text-xs text-[#999]">Uploaded on {new Date(note.uploaded_at).toLocaleDateString()}</p>

                  {/* Image preview */}
                  <img
                    src={note.s3_url}
                    alt="Uploaded note preview"
                    className="mt-3 w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => setSelectedImage(note.s3_url)}
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={note.s3_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#CD1015] hover:underline flex items-center gap-1"
                  >
                    View <FiExternalLink size={16} />
                  </Link>

                  <button
                    onClick={() => handleDelete(note.note_id)}
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
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full preview"
            className="max-w-[90%] max-h-[90%] rounded-xl border-4 border-white shadow-lg"
          />
        </div>
      )}
    </section>
  );
}
