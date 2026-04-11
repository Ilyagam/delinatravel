"use client";

import { useState, useRef, useEffect } from "react";
import ScrollCarousel from "./ScrollCarousel";
import type { InstagramPost } from "./InstagramSection";

/**
 * Клиентский компонент: карусель Instagram фото с lightbox.
 * REASON: карусель требует requestAnimationFrame + drag — только client-side.
 *
 * КОНТРАКТ:
 * - posts: массив {image_url, caption, permalink} из Supabase
 * - Бесконечная автопрокрутка (speed 0.4), пауза на hover/touch
 * - Клик на фото → lightbox с навигацией
 * - Drag не открывает lightbox (защита от случайного клика)
 */

const CARD_WIDTH = 300;
const CARD_HEIGHT = 300;
const CARD_GAP = 12;

export default function InstagramCarousel({ posts }: { posts: InstagramPost[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Запоминаем начало клика для определения drag vs click
  const handlePointerDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePhotoClick = (index: number, e: React.MouseEvent) => {
    // Не открывать lightbox если пользователь тащил (drag)
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);
    if (dx > 5 || dy > 5) return;
    setLightbox(index);
  };

  const closeLightbox = () => setLightbox(null);

  const prevPhoto = () =>
    setLightbox((i) => (i !== null ? (i - 1 + posts.length) % posts.length : null));

  const nextPhoto = () =>
    setLightbox((i) => (i !== null ? (i + 1) % posts.length : null));

  // Keyboard навигация в lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <>
      <ScrollCarousel speed={0.8} className="py-2">
        {posts.map((post, i) => (
          <div
            key={`post-${i}`}
            style={{
              flexShrink: 0,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              marginRight: CARD_GAP,
              borderRadius: 16,
              overflow: "hidden",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseDown={handlePointerDown}
            onClick={(e) => handlePhotoClick(i, e)}
          >
            <img
              src={post.image_url}
              alt={post.caption || "Delina Travel — Instagram"}
              loading="lazy"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 400ms ease",
                display: "block",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLImageElement).style.transform = "scale(1.06)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLImageElement).style.transform = "scale(1)";
              }}
            />

            {/* Instagram overlay при hover */}
            <div
              className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" opacity={0.9}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
          </div>
        ))}
      </ScrollCarousel>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "none", border: "none", color: "#fff",
              fontSize: 32, cursor: "pointer", zIndex: 10,
            }}
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            style={{
              position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              fontSize: 28, cursor: "pointer", padding: "16px 20px", borderRadius: 8,
            }}
          >
            &#8249;
          </button>

          {/* Image */}
          <img
            src={posts[lightbox].image_url}
            alt={posts[lightbox].caption || `Фото ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            style={{
              position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              fontSize: 28, cursor: "pointer", padding: "16px 20px", borderRadius: 8,
            }}
          >
            &#8250;
          </button>

          {/* Caption + Counter */}
          <div
            style={{
              position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
              textAlign: "center", maxWidth: "80vw",
            }}
          >
            {posts[lightbox].caption && (
              <p style={{ color: "#ccc", fontSize: 14, marginBottom: 8 }}>
                {posts[lightbox].caption}
              </p>
            )}
            <span style={{ color: "#888", fontSize: 13 }}>
              {lightbox + 1} / {posts.length}
            </span>
            <a
              href={posts[lightbox].permalink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#F0A868", fontSize: 13, marginLeft: 16 }}
            >
              Открыть в Instagram →
            </a>
          </div>
        </div>
      )}
    </>
  );
}
