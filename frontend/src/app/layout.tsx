import type { Metadata } from "next";

import InstagramIcon from "@/../public/assets/images/decorations/instagram_icon.svg"
import TwitterIcon from "@/../public/assets/images/decorations/twitter_icon.svg"
import FacebookIcon from "@/../public/assets/images/decorations/facebook_icon.svg"

import Logo from "@/../public/assets/images/logo.svg"

import Image from "next/image"
import "./globals.css";

export const metadata: Metadata = {
  title: "TerpNotes - All the Notes. None of the Stress",
  description:
    "TerpNotes is a UMD-focused note-sharing and studying platform where students compile, rate, and explore notes across semesters. Build your perfect learning environment with searchable, LaTeX-transcribed content and interactive tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="bg-[#F9F1E5] border-t border-[#e0d7cb] px-6 py-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

            <div className="flex items-center gap-3">
              <Image src={Logo} alt="TerpNotes Logo" width={30} height={30} />
              <span className="text-xl font-semibold text-[#1F1F1F]">
                TerpNotes
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-[#333] text-sm font-medium">
              <a href="/terms-of-service" target="_blank" className="hover:text-[#CD1015] transition flex">
                Terms of Service
                <span className="ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 3H21m0 0v7.5M21 3L10 14M5 5h5m-5 0v14h14v-5"
                    />
                  </svg>
                </span>
              </a>
              <a href="/privacy-policy" target="_blank" className="hover:text-[#CD1015] transition flex">
                Privacy Policy
                <span className="ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 3H21m0 0v7.5M21 3L10 14M5 5h5m-5 0v14h14v-5"
                    />
                  </svg>
                </span>
              </a>
              <a href="/blog/release-day" target="_blank" className="hover:text-[#CD1015] transition flex">
                Blog
                <span className="ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 3H21m0 0v7.5M21 3L10 14M5 5h5m-5 0v14h14v-5"
                    />
                  </svg>
                </span>
              </a>
              <a href="/about" className="hover:text-[#CD1015] transition">About</a>
              <a href="/contact" className="hover:text-[#CD1015] transition">Contact</a>
            </div>

            <div className="flex gap-3">
              <a href="https://www.instagram.com/terpnotesumd/" target="_blank" className="w-[25px] h-[25px] hover:scale-110 transition-transform flex items-center justify-center" aria-label="Instagram">
                <Image src={InstagramIcon} alt="Instagram" width={22.5} height={22.5} />
              </a>
              <a href="https://x.com/terpnotesumd/" target="_blank" className="w-[25px] h-[25px] hover:scale-110 transition-transform flex items-center justify-center" aria-label="Twitter">
                <Image src={TwitterIcon} alt="Twitter" width={25} height={25} />
              </a>
              <a href="#" className="h-[25px] hover:scale-110 transition-transform flex items-center justify-center" aria-label="Facebook">
                <Image src={FacebookIcon} alt="Facebook" width={12} height={12} />
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-[#e0d7cb] pt-6 text-center text-sm text-[#666]">
            © {new Date().getFullYear()} TerpNotes. Built with ❤️ at University of Maryland, College Park.
          </div>
        </footer>
      </body>
    </html>
  );
}
