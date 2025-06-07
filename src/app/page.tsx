"use client";
import Herosection from "@/components/Herosection";
import Aboutsection from "@/components/Aboutsection";
import OurBusiness from "@/components/OurBusiness";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Herosection />
      <Aboutsection />
      <OurBusiness />
    </main>
  );
}
