import Herosection from "@/components/Herosection";
import Aboutsection from "@/components/Aboutsection";
import OurBusinesses from "@/components/OurBusiness";
import CertificationsSection from "@/components/Certifications_section";
import FirmityIntroSection from "@/components/Firmity_intro_section";
import Marque from "@/components/Marque";
import { BackToTop } from "@/components/BackToTop";
import { TrackComplaints } from "@/components/TrackComplaints";

export default function Home() {
  return (
    <main className="min-h-screen relative pt-16">
      <Herosection />
      <Aboutsection />
      <OurBusinesses />
      <CertificationsSection />
      <FirmityIntroSection />
      <Marque />
      <BackToTop />
      <TrackComplaints />
    </main>
  );
}