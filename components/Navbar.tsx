"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 xl:px-14 py-3 md:py-3.5 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <Link
        href="/"
        className={`font-serif text-xl md:text-2xl font-semibold tracking-wide transition-colors duration-300 ${
          scrolled ? "text-[#134E6F]" : "text-white drop-shadow-md"
        }`}
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Delina Travel
      </Link>

      {/* Desktop */}
      <div
        className={`hidden md:flex items-center gap-6 xl:gap-8 text-sm xl:text-base transition-colors duration-300 ${
          scrolled ? "text-[#134E6F]" : "text-white"
        }`}
      >
        <a href="#tours" className={`hover:opacity-70 transition-opacity ${scrolled ? "" : "drop-shadow-sm"}`}>
          Туры
        </a>
        <a href="#formats" className={`hover:opacity-70 transition-opacity ${scrolled ? "" : "drop-shadow-sm"}`}>
          Форматы
        </a>
        <a href="#about" className={`hover:opacity-70 transition-opacity ${scrolled ? "" : "drop-shadow-sm"}`}>
          О нас
        </a>
        <a
          href="#contact"
          className={`px-5 xl:px-6 py-2 xl:py-2.5 rounded-full text-sm xl:text-base transition-colors ${
            scrolled
              ? "bg-[#134E6F] text-white hover:bg-[#134E6F]/90"
              : "bg-white/20 backdrop-blur-sm text-white border border-white/40 hover:bg-white/30"
          }`}
        >
          Оставить заявку
        </a>
      </div>

      {/* Mobile burger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setOpen(!open)}
        aria-label="Меню"
      >
        <span
          className={`block w-7 h-0.5 transition-all ${
            scrolled ? "bg-[#134E6F]" : "bg-white drop-shadow-md"
          } ${open ? "rotate-45 translate-y-2" : ""}`}
        />
        <span
          className={`block w-7 h-0.5 transition-all ${
            scrolled ? "bg-[#134E6F]" : "bg-white drop-shadow-md"
          } ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-7 h-0.5 transition-all ${
            scrolled ? "bg-[#134E6F]" : "bg-white drop-shadow-md"
          } ${open ? "-rotate-45 -translate-y-2" : ""}`}
        />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#F0F7FA] border-t border-[#134E6F]/10 px-6 py-6 flex flex-col gap-4 md:hidden shadow-lg">
          <a
            href="#tours"
            onClick={() => setOpen(false)}
            className="text-lg text-[#134E6F]"
          >
            Туры
          </a>
          <a
            href="#formats"
            onClick={() => setOpen(false)}
            className="text-lg text-[#134E6F]"
          >
            Форматы
          </a>
          <a
            href="#about"
            onClick={() => setOpen(false)}
            className="text-lg text-[#134E6F]"
          >
            О нас
          </a>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="bg-[#134E6F] text-[#F0F7FA] px-5 py-3 rounded-full text-center"
          >
            Оставить заявку
          </a>
        </div>
      )}
    </nav>
  );
}
