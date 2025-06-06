"use client";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import Image from "next/image";
import { HamBurger } from "@/components/HamBurger";
import { Carousel } from "@/components/ui/Carousel";

const slides = [
  {
    src: "/Banners/Banner1.jpg",
    title: "A Real Estate Platform driven by an entrepreneurial spirit",
    buttonLabel: "Urest",
    href: "https://urest.in/",
  },
  {
    src: "/Banners/Banner2.webp",
    title: "Celebrating the past & developing the future",
    buttonLabel: "Royal Nest",
    href: "https://royalnestdharamshala.com/",
  },
  {
    src: "/Banners/Banner3.jpg",
    title: "The engine driving progress and competitive advantage in Real Estate",
    buttonLabel: "Tech",
    href: "/tech",
  },
  {
    src: "/Banners/Banner4.jpg",
    title: "Serving as the backbone of successful Real Estate operations",
    buttonLabel: "Estates",
    href: "/estates",
  },
];

export default function Herosection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative w-full h-[550px] overflow-hidden">
      <Carousel
        slides={slides}
        current={currentSlide}
        onSlideChange={setCurrentSlide}
      />

      <div className="absolute top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <Image
            src="/UFIRM ESTATES LOGO.png"
            alt="logo"
            width={100}
            height={50}
            priority
          />
          <div className="flex-grow px-4">
            <NavBar current={currentSlide} onNavClick={setCurrentSlide} />
          </div>
          <HamBurger />
        </div>
      </div>
    </div>
  );
}
