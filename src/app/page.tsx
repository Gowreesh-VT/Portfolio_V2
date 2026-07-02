import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutJourneySection from "./components/AboutJourneySection";
import TechStackSection from "./components/TechStackSection";
import ProjectsSection from "./components/ProjectsSection";
import CertificatesSection from "./components/CertificatesSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Header />
      <HeroSection />
      <AboutJourneySection />
      <TechStackSection />
      <CertificatesSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

