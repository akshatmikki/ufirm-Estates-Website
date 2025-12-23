"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { HamburgerMenu } from "@/components/Hamburger";

const Herosection = dynamic(() => import("@/components/Herosection"), {
  ssr: false,
});
const Aboutsection = dynamic(() => import("@/components/Aboutsection"), {
  ssr: false,
});
const OurBusinesses = dynamic(() => import("@/components/OurBusiness"), {
  ssr: false,
});
const ClientCarousel = dynamic(() => import("@/components/ClientCarousel"), {
  ssr: false,
});

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current) return;
      const top = aboutRef.current.getBoundingClientRect().top;
      const isHalfVisible = top < window.innerHeight / 2;
      if (isHalfVisible !== showButton) setShowButton(isHalfVisible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showButton]);

  return (
    <main className="min-h-screen relative">
      <div className="block lg:hidden z-[9999] fixed top-0 right-0">
        <HamburgerMenu />
      </div>
      <Herosection />
      <div ref={aboutRef}>
        <Aboutsection />
      </div>
      <OurBusinesses />
      <ClientCarousel />

      {showButton && (
        <div className="fixed right-5 z-50 space-y-3 bottom-10 sm:bottom-12">
          <Link
            href="https://calendly.com/demo-firmity/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 bg-[#146995] text-white rounded-full shadow-lg text-center text-sm sm:text-base font-medium hover:bg-[#125b81] transition"
          >
            Facility Tech Demo 📅
          </Link>
          <Link
            href="https://calendly.com/firmity9/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 bg-[#146995] text-white rounded-full shadow-lg text-center text-sm sm:text-base font-medium hover:bg-[#125b81] transition"
          >
            Facility Health Survey 🛠️
          </Link>
          <Link
            href="https://admin.urest.in:8092/" // 👈 Update with your complaint tracking page route
            className="block px-4 py-2 bg-[#146995] text-white rounded-full shadow-lg text-center text-sm sm:text-base font-medium hover:bg-[#125b81] transition"
          >
            Complaint Tracking 📋
          </Link>
        </div>
      )}
    </main>
  );
}
