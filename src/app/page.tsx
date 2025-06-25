"use client";
import Herosection from "@/components/Herosection";
import Aboutsection from "@/components/Aboutsection";
import OurBusinesses from "@/components/OurBusiness";
import ClientCarousel from "@/components/ClientCarousel";
import Link from "next/link";
import { useEffect, useState } from "react";

const phrases = ["Book a Demo 🚀", "Live Preview 🧪", "See it in Action 🔥", "Get in Touch 📞"];

export default function Home() {
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="min-h-screen">
        <Herosection />
        <Aboutsection />
        <OurBusinesses />
        <ClientCarousel />
        <Link
          href="https://calendly.com/bhavesh-singh-ufirm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-[#146995] text-white rounded-full shadow-lg animate-bounce`}
          >
            <span className="font-medium text-sm sm:text-base">{phrases[labelIndex]}</span>
          </div>
        </Link>
      </main>
    </>
  );
}
