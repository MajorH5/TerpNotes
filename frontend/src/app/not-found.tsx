import Link from "next/link";
import Image from "next/image";
import UMDLogo from "@/../public/assets/images/decorations/umd_logo_drawing.svg";
import Hearts from "@/../public/assets/images/decorations/hearts.svg";

export default function NotFound() {
  return (
    <div className="bg-[#F9F1E5] min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="max-w-xl text-center text-[#1F1F1F] z-10">
        <h1 className="text-6xl font-extrabold mb-4" style={{ fontFamily: "sen" }}>
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4 relative inline-block" style={{ fontFamily: "sen" }}>
          Page Not Found
          <svg
            viewBox="0 0 100 20"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-0 -bottom-3 w-full h-[0.6em]"
            preserveAspectRatio="none"
          >
            <path
              d="M2 15C20 5 80 20 98 10"
              stroke="#CD1015"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </h2>
        <p className="text-[#333] mt-4 mb-8">
          Uh oh! We couldn’t find the page you were looking for. It might have been moved or deleted.
        </p>

        <Link href="/" passHref>
          <button className="bg-[#CD1015] hover:bg-[#a60d11] text-white px-6 py-3 rounded-xl border hover:scale-105 transition-all">
            Return Home
          </button>
        </Link>
      </div>

      <Image
        src={UMDLogo}
        alt="UMD Logo"
        className="absolute bottom-10 left-10 w-20 opacity-20 rotate-12"
      />
      <Image
        src={Hearts}
        alt="Hearts"
        className="absolute top-12 right-10 w-24 opacity-30 animate-pulse"
      />

      <div className="absolute inset-0 bg-[radial-gradient(#e0d7cb_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0" />
    </div>
  );
}
