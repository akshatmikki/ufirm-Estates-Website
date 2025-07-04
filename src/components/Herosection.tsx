"use client";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Login } from "@/components/Login";
import { Carousel } from "@/components/ui/Carousel";
import SVGComponent from "@/components/Ufirm_estates";

const slides = [
  {
    src: "/Banners/Banner1.png",
    title: "Reimagining Facility Management through innovation, agility, and entrepreneurial drive",
    buttonLabel: "Facility Management",
    href: "https://urest.in/",
    extraButtonLabel: "Smart Facility",
    extraButtonHref: "/OurInnovation",
  },
  {
    src: "/Banners/Banner2.webp",
    title: "Celebrating the past & developing the future",
    buttonLabel: "Royal Nest Projects",
    href: "/RoyalNestPage",
  },
  {
    src: "/Banners/Banner3.jpg",
    title: "The engine behind intelligent, data-driven maintenance operations",
    buttonLabel: "Facility Tech",
    href: "/OurInnovation",
  },
  {
    src: "/Banners/Banner 4.jpg",
    title: "The engine powering innovation and transformation in technology",
    buttonLabel: "Technical Services",
    href: "/TechnologiesPage",
  },
  {
    src: "/Banners/Banner5.webp",
    title: "Serving as the backbone of successful Real Estate operations",
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
        <div className="flex items-center justify-between px-4  w-full">
          <SVGComponent className="w-28 h-27" />
          <NavBar />
          <Login />
        </div>
      </div>
    </div>
  );
}
