"use client";

import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "@/lib/firebase";
import Image from "next/image";
import Logo from "@/../public/assets/images/logo.svg";
import { useRouter } from "next/navigation";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function AuthPage() {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [stage, setStage] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const router = useRouter();
  const db = getFirestore(app);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    return null;
  };

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/browse-notes");
    } catch (err) {
      setError("Incorrect Email or Password.");
    }
  };

  const handleSignup = async () => {
    setError("");
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optional: update displayName
      await updateProfile(user, {
        displayName: name,
      });

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: name,
        email: user.email,
        createdAt: new Date(),
      });

      router.push("/browse-notes");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else {
        setError("Error creating account.");
      }
    }
  };


  const handleGoogleSignin = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "",
          email: user.email,
          createdAt: new Date(),
          provider: "google",
        });
      }

      router.push("/browse-notes");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F9F1E5]">
      {/* Left Info Section */}
      <div className="hidden md:flex w-full lg:w-1/2 p-10 bg-[#F3E8D8] flex-col justify-center items-center space-y-6 gap-5">
        <div className="flex items-center justify-center gap-6 mb-0 select-none">
          <Image src={Logo} alt="TerpNotes Logo" width={64} height={64} />
          <h1 className="text-6xl font-bold text-[#1F1F1F] font-sans tracking-tight">
            TerpNotes
          </h1>
        </div>
        <p className="text-3xl font-semibold text-[#1F1F1F] mb-0">Why TerpNotes?</p>
        <ul className="list-disc list-inside space-y-2 text-[#333] text-xl leading-relaxed">
          <li>Access peer-created notes anytime.</li>
          <li>Rate and review for better quality.</li>
          <li>Share and contribute to your classes.</li>
          <li>Organized by courses and semesters.</li>
        </ul>
      </div>

      {/* Right Login/Signup Section */}
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-3 p-10 lg:w-1/2">
        <span className="flex items-center justify-center gap-4 text-4xl font-bold text-[#1F1F1F] font-sans md:hidden">
          <Image src={Logo} alt="TerpNotes Logo" width={48} height={48} /> 
          TerpNotes
        </span>
        <div className="w-full max-w-md p-6 space-y-6 bg-white shadow rounded-2xl">
          <h1 className="text-2xl font-semibold text-center">Welcome</h1>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          {stage === "login" && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-[#CD1015] text-white py-2 rounded-lg hover:bg-[#a60d11]"
              >
                Log In
              </button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <button onClick={() => setStage("signup")} className="text-blue-500 hover:underline">
                  Sign Up!
                </button>
              </p>
            </>
          )}

          {stage === "signup" && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={handleSignup}
                className="w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Sign Up
              </button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <button onClick={() => setStage("login")} className="text-blue-500 hover:underline">
                  Log in
                </button>
              </p>
            </>
          )}

          {(stage === "login" || stage === "signup") && (
            <>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <hr className="flex-grow border-t border-black" />
                <span>or</span>
                <hr className="flex-grow border-t border-black" />
              </div>
              <button
                onClick={handleGoogleSignin}
                className="flex items-center justify-center w-full gap-3 py-2 transition border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.24 0 6.15 1.12 8.45 2.95l6.3-6.3C34.94 2.64 29.79 0 24 0 14.64 0 6.67 5.95 2.96 14.55l7.9 6.14C12.56 13.8 17.87 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24c0-1.64-.15-3.21-.43-4.74H24v9h12.7c-.55 2.92-2.2 5.38-4.7 7.05l7.5 5.85C44.56 37.24 46.5 30.96 46.5 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.86 28.41c-.62-1.84-.98-3.8-.98-5.91s.36-4.07.98-5.91L2.96 10.45A23.93 23.93 0 000 24c0 3.88.92 7.54 2.96 10.91l7.9-6.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.14 15.9-5.8l-7.5-5.85c-2.1 1.42-4.8 2.25-8.4 2.25-6.13 0-11.44-4.3-13.14-10.19l-7.9 6.14C6.67 42.05 14.64 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Sign in with Google
                </span>
              </button>
            </>
          )}
        </div>
        <div className="text-gray-400 ext-xs bottom-5 md:hidden">
          ⏰ Save time, study smarter.
        </div>
      </div>
    </div>
  );
}
