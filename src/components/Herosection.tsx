"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as ChevronIcon } from "lucide-react";

// Slide Data
const slides = [
  {
    src: "/Assets/carousel_1.webp",
    cardTitle: "Royal Nest Group",
    cardSubtext: "Real-estate and infrastructure development",
    href: "https://www.royalnestgroup.com/",
  },
  {
    src: "/Assets/carousel_2.webp",
    cardTitle: "Firmity",
    cardSubtext: "CMMS and operations management platform",
    href: "https://www.firmity.in",
  },
  {
    src: "/Assets/carousel_3.webp",
    cardTitle: "URest",
    cardSubtext: "Operations and facility management",
    href: "https://urest.in/",
  },
];

export default function Herosection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-slide effect
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 1200); // 1.2s
    return () => clearInterval(interval);
  }, [autoSlide, currentSlide]);

  useEffect(() => {
  // Preload first carousel image
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/Assets/carousel_1.webp';
  document.head.appendChild(link);
}, []);

  return (
    <div
      className="relative w-full h-screen flex flex-col lg:flex-row bg-white overflow-hidden"
      onMouseEnter={() => setAutoSlide(false)}
      onMouseLeave={() => setAutoSlide(true)}
    >

      {/* Mobile: Carousel Background */}
      <div className="absolute inset-0 lg:hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url('${slides[currentSlide].src}')` }}
        >
          <div className="absolute inset-0 bg-white/45" />
        </div>
      </div>

      {/* ================= LEFT SIDE: Content ================= */}
      <div className="relative z-20 w-full lg:w-[60%] h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 lg:bg-white pt-24 lg:pt-0">

        <div className="max-w-xl flex flex-col gap-6 lg:-mt-20">

          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3143] leading-tight bottom-20">
            End-to-End Real Estate performance
          </h1>

          {/* Body Text */}
          <p className="text-[#131720] text-lg leading-relaxed font-medium">
            UFirm integrates URest and Firmity into a single ecosystem—connecting day-to-day operations with intelligent asset management to create lasting value.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-full sm:w-fit mt-2">
            {/* Primary Button */}
            <a
              href="https://calendly.com/demo-firmity/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-full px-8 py-3 rounded-[4px] font-medium transition-all duration-200 text-center
                bg-[#1e3143] text-[#fafbf9]
                hover:bg-[#1f4e7a] hover:shadow-inner hover:shadow-[inset_0_0_0_0.2px_#1e3143]
                active:bg-[#1484bc] active:shadow-inner active:shadow-[inset_0_0_0_0.2px_#1e3143] cursor-pointer
                "
            >
              Request Tech Demo
            </a>

            {/* Secondary Button */}
            <a
              href="https://calendly.com/firmity9/30min?month=2026-01"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-full px-8 py-3 rounded-[4px] font-medium transition-all duration-200 text-center
                bg-[#006990] text-[#fafbf9]
                hover:bg-[#1f4e7a] hover:shadow-inner hover:shadow-[inset_0_0_0_0.2px_#1e3143]
                active:bg-[#1484bc] active:shadow-inner active:shadow-[inset_0_0_0_0.2px_#1e3143] cursor-pointer
                "
            >
              Schedule Facility Survey
            </a>
          </div>

          {/* Mobile: Info Card and Navigation Arrows */}
          <div className="flex flex-col items-center gap-4 mt-6 lg:hidden">
            {/* Floating Info Card */}
            <a
              href={slides[currentSlide].href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[360px] bg-[#1E3143]/70 backdrop-blur-sm text-white p-4 rounded-[8px] shadow-xl hover:bg-[#1e3143] active:bg-[#1f4e7a] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-m text-[#ffffff]">{slides[currentSlide].cardTitle}</h3>
                  <p className="text-sm text-[#ffffff] mt-1">{slides[currentSlide].cardSubtext}</p>
                </div>
                <ChevronIcon className="w-5 h-5 text-white flex-shrink-0" />
              </div>

              {/* Pagination Dots */}
              <div className="flex gap-2 mt-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    className={`h-2 transition-all duration-300 ${idx === currentSlide ? "bg-[#0090d1] w-2" : "bg-slate-300/80 w-2"
                      } rounded-m`}
                  />
                ))}
              </div>
            </a>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-3">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-[#1e3143]/60 hover:bg-[#1e3143] active:bg-[#1484bc] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all backdrop-blur-md cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-white transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-[#1e3143]/60 hover:bg-[#1e3143] active:bg-[#1484bc] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all backdrop-blur-md cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-white transition-colors" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE: Carousel (Desktop Only) ================= */}
      <div className="hidden lg:block relative w-full lg:w-[40%] h-full">

        {/* Background Image */}
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url('${slides[currentSlide].src}')` }}
        >
          {/* White Gradient Fade */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Bottom Overlay Container */}
        <div className="absolute bottom-25 left-8 flex flex-col items-center gap-4 z-20">

          {/* 1. Floating Info Card */}
          <a
            href={slides[currentSlide].href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[360px] bg-[#1E3143]/70 backdrop-blur-sm text-white p-4 rounded-[8px] shadow-xl hover:bg-[#1e3143] active:bg-[#1f4e7a] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-m text-[#ffffff]">{slides[currentSlide].cardTitle}</h3>
                <p className="text-sm text-[#ffffff] mt-1">{slides[currentSlide].cardSubtext}</p>
              </div>
              <ChevronIcon className="w-5 h-5 text-white flex-shrink-0" />
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2 mt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-2 transition-all duration-300 ${idx === currentSlide ? "bg-[#0090d1] w-2" : "bg-slate-300/80 w-2"
                    } rounded-m`}
                />
              ))}
            </div>
          </a>

          {/* 2. Navigation Arrows */}
          <div className="w-[280px] flex justify-center gap-3">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-[#1e3143]/60 hover:bg-[#1e3143] active:bg-[#1484bc] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all backdrop-blur-md cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-[#1e3143]/60 hover:bg-[#1e3143] active:bg-[#1484bc] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all backdrop-blur-md cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white transition-colors" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
