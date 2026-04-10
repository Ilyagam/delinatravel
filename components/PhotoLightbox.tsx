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
      {/* Галерея — сетка 2 колонки, вертикальные фото не обрезаются */}
      <section className="px-4 md:px-10 py-6 bg-[#F0F7FA]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className={`relative rounded-xl overflow-hidden bg-[#134E6F]/10 cursor-pointer group ${
                i === 0 && images.length > 1 ? "row-span-2" : ""
              }`}
              onClick={() => setLightboxIndex(i)}
            >
              {/* REASON: aspect-[3/4] для вертикальных фото, первое фото крупнее (row-span-2) */}
              <div className={`relative w-full ${
                i === 0 && images.length > 1 ? "aspect-[3/4]" : "aspect-[3/4]"
              }`}>
                <Image
                  src={url}
                  alt={i === 0 ? tourTitle : `${tourTitle} — фото ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes={i === 0 ? "(max-width: 768px) 50vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                />
              </div>
              {i === 0 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                  📸 {images.length} фото
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

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
