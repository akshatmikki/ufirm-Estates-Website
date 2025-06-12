"use client";
import Herosection from "@/components/Herosection";
import Aboutsection from "@/components/Aboutsection";
import OurBusinesses from "@/components/OurBusiness";
import ClientCarousel from "@/components/ClientCarousel";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Herosection />
      <Aboutsection />
      <OurBusinesses />
      <ClientCarousel />
    </main>
  );
}
