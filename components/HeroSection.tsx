import Image from "next/image";
import { existsSync } from "fs";
import path from "path";

// REASON: If /public/videos/hero-loop.mp4 exists → show video loop.
// Otherwise → fallback to static hero.jpg.
// Drop the video file in place and the hero upgrades automatically.
function hasHeroVideo() {
  try {
    return existsSync(path.join(process.cwd(), "public/videos/hero-loop.mp4"));
  } catch {
    return false;
  }
}

function hasMobileVideo() {
  try {
    return existsSync(path.join(process.cwd(), "public/videos/hero-mobile.mp4"));
  } catch {
    return false;
  }
}

export default function HeroSection() {
  const showVideo = hasHeroVideo();
  const showMobileVideo = hasMobileVideo();

  return (
    <section className="relative h-screen flex overflow-hidden">

      {/* Background: desktop video */}
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/photos/hero.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 hidden md:block"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
      )}

      {/* Background: mobile video (9:16 vertical) */}
      {showMobileVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/photos/hero-mobile-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 md:hidden"
        >
          <source src="/videos/hero-mobile.mp4" type="video/mp4" />
        </video>
      ) : !showVideo ? (
        <Image
          src="/photos/hero.jpg"
          alt="Путешествие с Delina Travel"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center z-0"
        />
      ) : null}

      {/* Fallback image for mobile if no mobile video but desktop video exists */}
      {showVideo && !showMobileVideo && (
        <Image
          src="/photos/hero.jpg"
          alt="Путешествие с Delina Travel"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center z-0 md:hidden"
        />
      )}

      {/* Gradient overlay — stronger to ensure text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      {/* Content — mobile: title top + buttons bottom; desktop: upper-left */}
      <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 flex flex-col md:justify-center h-full pt-24 md:pt-28 pb-8 md:pb-0">

        {/* Title block */}
        <div className="max-w-2xl">
          <span
            className="font-handwritten text-2xl md:text-xl mb-2 block"
            style={{ fontFamily: "'Caveat', cursive", color: "#38BDF8" }}
          >
            авторские путешествия
          </span>

          <h1
            className="text-5xl md:text-6xl xl:text-7xl font-light text-[#F0F7FA] leading-[0.9] mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Delina
            <br />
            Travel
          </h1>
        </div>

        {/* Mobile spacer — pushes slogan+buttons to bottom */}
        <div className="flex-1 md:hidden" />

        {/* Slogan + buttons */}
        <div className="max-w-2xl">
          <p className="text-[#F0F7FA]/85 text-base md:text-base max-w-md mb-5 leading-relaxed">
            Мир слишком большой, чтобы сидеть дома.
            <br />
            Поехали смотреть его вместе.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/#tours"
              className="bg-[#F0F7FA] text-[#134E6F] px-8 py-3.5 rounded-full text-sm md:text-base font-medium text-center hover:bg-white transition-colors shadow-lg"
            >
              Посмотреть туры
            </a>
            <a
              href="/#contact"
              className="border-2 border-[#F0F7FA]/60 text-[#F0F7FA] px-8 py-3.5 rounded-full text-sm md:text-base font-medium text-center hover:bg-[#F0F7FA]/15 transition-colors"
            >
              Оставить заявку
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 opacity-40">
        <span className="text-[#F0F7FA] text-xs tracking-widest uppercase">
          scroll
        </span>
        <div className="w-px h-8 bg-[#F0F7FA] animate-pulse" />
      </div>
    </section>
  );
}
