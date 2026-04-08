"use client";

// REASON: Полноэкранный просмотр фото с листалкой
// Фото — 80% продажи тура, люди должны видеть WOW и хотеть так же

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

interface PhotoLightboxProps {
  images: string[];
  tourTitle: string;
}

export default function PhotoLightbox({ images, tourTitle }: PhotoLightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);
  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Hero — первое фото на весь экран */}
      <section className="relative w-full">
        <div
          className="relative w-full aspect-[16/9] md:aspect-[21/9] cursor-pointer group"
          onClick={() => setLightboxIndex(0)}
        >
          <Image
            src={images[0]}
            alt={tourTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
            📸 {images.length} фото
          </div>
        </div>
      </section>

      {/* Мозаика — остальные фото */}
      {images.length > 1 && (
        <section className="px-6 md:px-10 py-6 bg-[#F0F7FA]">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.slice(1).map((url, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1A97B5] cursor-pointer group"
                onClick={() => setLightboxIndex(i + 1)}
              >
                <Image
                  src={url}
                  alt={`${tourTitle} — фото ${i + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox — полноэкранный просмотр */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white text-4xl leading-none p-2"
          >
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 text-white/50 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 md:left-6 z-10 text-white/50 hover:text-white text-5xl leading-none p-4"
          >
            ‹
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-[90vw] max-h-[85vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${tourTitle} — фото ${lightboxIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 md:right-6 z-10 text-white/50 hover:text-white text-5xl leading-none p-4"
          >
            ›
          </button>

          {/* Swipe area for mobile — tap left/right halves */}
          <div className="absolute inset-0 z-[5] flex md:hidden">
            <div className="w-1/2 h-full" onClick={(e) => { e.stopPropagation(); prev(); }} />
            <div className="w-1/2 h-full" onClick={(e) => { e.stopPropagation(); next(); }} />
          </div>
        </div>
      )}
    </>
  );
}
