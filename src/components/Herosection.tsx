"use client";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Login } from "@/components/Login";
import { Carousel } from "@/components/ui/Carousel";
import Image from "next/image";

const slides = [
  {
    src: "/Banners/facility management cleaning.webp",
    title: "Facilities Thrive On Our Skill, Care, Training, Tech",
    buttonLabel: "Facility Management",
    href: "https://urest.in/",
  },
  {
    src: "/Banners/Royal Nest Projects.webp",
    title: "25 Years Of Sustainable Development",
    buttonLabel: "Royal Nest Projects",
    href: "https://www.royalnestgroup.com/",
  },
  {
    src: "/Banners/faci tech.webp",
    title: "Digital Tools For Facility Excellence",
    buttonLabel: "Facility Tech",
    href: "/OurInnovation",
  },
  {
    src: "/Banners/sofware developer.webp",
    title: "Integrated Tech Development & Staffing",
    buttonLabel: "Technical Services",
    href: "/TechnologiesPage",
  },
  {
    src: "/Banners/Real Estate.webp",
    title: "Income-Ready Real Estate Solution",
    buttonLabel: "Real Estate Advisory",
    href: "/Management&advisory",
  },
];

export default function Herosection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Carousel
        slides={slides}
        current={currentSlide}
        onSlideChange={setCurrentSlide}
      />

      <div className="absolute top-1 left-0 w-full z-50">
        <div className="flex items-center justify-between px-4 w-full">
          <Image className="dark:invert mt-9"
            src={"/UFIRM ESTATES LOGO.webp"} alt={"UFIRM ESTATES LOGO"} width={100} height={100} />
        
          <div className="hidden lg:block">
            <NavBar />
          </div>
          <Login />
        </div>
      </div>
    </div>
  );
}
