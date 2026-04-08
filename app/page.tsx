import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToursGrid from "@/components/ToursGrid";
import TourFormats from "@/components/TourFormats";
import AboutSection from "@/components/AboutSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import { getActiveTours } from "@/lib/tours";

export const revalidate = 60;

export default async function HomePage() {
  const tours = await getActiveTours();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Tours section */}
        <section id="tours" className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <span
                className="font-handwritten text-xl block mb-3"
                style={{ fontFamily: "'Caveat', cursive", color: "#F0A868" }}
              >
                ближайшие
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#134E6F]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Туры
              </h2>
            </div>
            <ToursGrid tours={tours} />
          </div>
        </section>

        <TourFormats />
        <AboutSection />
        <AdvantagesSection />
        <InstagramSection />
        <FAQSection />
        <ContactSection tours={tours} />
      </main>
      <Footer />
    </>
  );
}
