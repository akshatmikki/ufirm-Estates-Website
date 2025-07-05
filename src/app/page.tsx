"use client";
import Herosection from "@/components/Herosection";
import Aboutsection from "@/components/Aboutsection";
import OurBusinesses from "@/components/OurBusiness";
import ClientCarousel from "@/components/ClientCarousel";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (aboutRef.current) {
        const top = aboutRef.current.getBoundingClientRect().top;
        setShowButton(top < window.innerHeight / 2);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <main className="min-h-screen">
        <Herosection />
        <div ref={aboutRef}>
          <Aboutsection />
        </div>
        <OurBusinesses />
        <ClientCarousel />

        {showButton && (
          <>
            <button
              className={`fixed bottom-25 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-[#146995] text-white rounded-full shadow-lg 
                }`}
            >
              <span className="font-medium text-sm sm:text-base">
                <Link
                  href="https://calendly.com/bhavesh-singh-ufirm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facility Health Survey 🛠️
                </Link>
              </span>
            </button>
            <button
              className={`fixed bottom-10 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-[#146995] text-white rounded-full shadow-lg 
                }`}
            >
              <span className="font-medium text-sm sm:text-base">
                <Link
                  href="https://calendly.com/bhavesh-singh-ufirm" target="_blank"
                  rel="noopener noreferrer"
                >
                  Facility Tech Demo 📅
                </Link>
              </span>
            </button>
          </>
        )}
      </main>
    </>
  );
}
