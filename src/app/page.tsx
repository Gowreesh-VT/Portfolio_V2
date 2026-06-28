import HeroSection from "./components/HeroSection";
import TechStackSection from "./components/TechStackSection";
import ProjectsSection from "./components/ProjectsSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSection />
      <TechStackSection />
      <ProjectsSection />
      <Footer />
    </main>
  );
}

