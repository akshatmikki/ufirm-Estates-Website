"use client";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Login } from "@/components/Login";
import { Carousel } from "@/components/ui/Carousel";
import SVGComponent from "@/components/Ufirm_estates";
import { HamburgerMenu } from "./Hamburger";

const slides = [
  {
    src: "/Banners/facility management cleaning.svg",
    title: "Facilities Thrive On Our Skill, Care, Training, Tech",
    buttonLabel: "Facility Management",
    href: "https://urest.in/",
  },
  {
    src: "/Banners/Royal Nest Projects.svg",
    title: "25 Years Of Sustainable Development",
    buttonLabel: "Royal Nest Projects",
    href: "/RoyalNestPage",
  },
  {
    src: "/Banners/faci tech.svg",
    title: "Digital Tools For Facility Excellence",
    buttonLabel: "Facility Tech",
    href: "/OurInnovation",
  },
  {
    src: "/Banners/sofware developer.svg",
    title: "Integrated Tech Development & Staffing",
    buttonLabel: "Technical Services",
    href: "/TechnologiesPage",
  },
  {
    src: "/Banners/Real Estate.svg",
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
          <SVGComponent
            className="w-16 h-16 sm:w-23 sm:h-23 md:w-26 md:h-26 lg:w-28 lg:h-28"
          />

          <div className="block lg:hidden">
            <HamburgerMenu />
          </div>

          <div className="hidden lg:block">
            <NavBar />
          </div>

          <Login />
        </div>
      </div>
    </div>
  );
}
