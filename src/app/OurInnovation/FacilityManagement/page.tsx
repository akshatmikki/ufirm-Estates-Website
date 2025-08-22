"use client";

import ClientCarousel from "@/components/ClientCarousel";
import { NavBar } from "@/components/NavBar";
import { HamburgerMenu } from "@/components/Hamburger";
import { Login } from "@/components/Login";
import Image from "next/image";
import Link from "next/link";
import StylishFeaturesBenefits from "@/components/FacilityManagement/StylishFeaturesBenefits";
import MindBlowingStylishPricingSection from "@/components/FacilityManagement/MindBlowingStylishPricingSection";
import HeroSection from "@/components/FacilityManagement/HeroSection";

export default function FacilityManagement() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="absolute top-1 left-0 w-full z-50">
        <div className="flex items-center justify-between px-4 mt-1">
          <Link href="/">
            <Image
              className="dark:invert mt-9"
              src={"/UFIRM ESTATES LOGO.webp"}
              alt={"UFIRM ESTATES LOGO"}
              width={100}
              height={100}
            />
          </Link>
          <div className="block lg:hidden">
            <HamburgerMenu />
          </div>
          <div className="hidden lg:block">
            <NavBar />
          </div>
          <Login />
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <HeroSection />

      {/* --- MAIN CONTENT --- */}
      

      {/* --- FEATURES & BENEFITS --- */}
      <StylishFeaturesBenefits />

      {/* --- PRICING SECTION --- */}
      <MindBlowingStylishPricingSection />

      {/* --- CLIENT CAROUSEL --- */}
      <ClientCarousel />
    </div>
  );
}
