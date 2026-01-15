"use client";

import FirmityIntroSection from "@/components/Firmity_intro_section";
import dynamic from "next/dynamic";
import Image from "next/image";

const Herosection = dynamic(() => import("@/components/Herosection"), {
  ssr: false,
});
const Aboutsection = dynamic(() => import("@/components/Aboutsection"), {
  ssr: false,
});
const OurBusinesses = dynamic(() => import("@/components/OurBusiness"), {
  ssr: false,
});
const CertificationsSection = dynamic(() => import("@/components/Certifications_section"), {
  ssr: false,
});
const FirmityIntroSection = dynamic(() => import("@/components/Firmity_intro_section"), {
  ssr: false,
});
const ClientCarousel = dynamic(() => import("@/components/ClientCarousel"), {
  ssr: false,
});
const Marque = dynamic(
  () => import("@/components/Marque"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen relative pt-16">
      <Herosection />
      <Aboutsection />

      <OurBusinesses />
      <CertificationsSection />
      <FirmityIntroSection />
      <Marque />

    </main>
  );
}