import Herosection from "@/components/Herosection";
import Aboutsection from "@/components/Aboutsection";
import OurBusinesses from "@/components/OurBusiness";
import CertificationsSection from "@/components/Certifications_section";
import NewsletterSection from "@/components/NewsletterSection";
import FirmityIntroSection from "@/components/Firmity_intro_section";
import Marque from "@/components/Marque";
import { BackToTop } from "@/components/BackToTop";
import { TrackComplaints } from "@/components/TrackComplaints";
import NewsletterPopup from "@/components/NewsletterPopup";

export default function Home() {
  return (
    <main className="min-h-screen relative pt-16">
      <NewsletterPopup />
      <Herosection />
      <Aboutsection />
      <OurBusinesses />
      <CertificationsSection />
      <NewsletterSection />
      <FirmityIntroSection />
      <Marque />
      <BackToTop />
      <TrackComplaints />
    </main>
  );
}