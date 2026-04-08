"use client";

// REASON: Интерактивный виджет Instagram — показывает что у Delina Travel живой контент
// Без API (Instagram API требует токен) — красивая CSS-сетка с ссылками на профиль

import { useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/delina_travel";

// REASON: Превью постов — статичные данные, обновляются вручную или через бот
// Каждый элемент — описание поста для hover эффекта
const POSTS = [
  { emoji: "🌴", label: "Бали", color: "from-[#1A97B5] to-[#134E6F]" },
  { emoji: "🏙", label: "Куала-Лумпур", color: "from-[#F0A868] to-[#E8734A]" },
  { emoji: "🌊", label: "Океан", color: "from-[#38BDF8] to-[#1A97B5]" },
  { emoji: "🍜", label: "Стрит-фуд", color: "from-[#E8734A] to-[#F0A868]" },
  { emoji: "🏖", label: "Пляж", color: "from-[#134E6F] to-[#1A97B5]" },
  { emoji: "🐒", label: "Джунгли", color: "from-[#1A97B5] to-[#38BDF8]" },
  { emoji: "🌅", label: "Закаты", color: "from-[#F0A868] to-[#134E6F]" },
  { emoji: "✈️", label: "Перелёт", color: "from-[#38BDF8] to-[#134E6F]" },
];

export default function InstagramSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <span
              className="font-handwritten text-xl block mb-3"
              style={{ fontFamily: "'Caveat', cursive", color: "#F0A868" }}
            >
              следите за нами
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-[#134E6F]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Instagram
            </h2>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity self-start md:self-auto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @delina_travel
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {POSTS.map((post, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${post.color} transition-transform duration-500 group-hover:scale-110`}
              />

              {/* Emoji */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-6xl md:text-7xl transition-all duration-300 ${
                    hoveredIndex === i ? "scale-125 opacity-30" : "opacity-20"
                  }`}
                >
                  {post.emoji}
                </span>
              </div>

              {/* Hover overlay */}
              <div
                className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredIndex === i ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="text-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="mx-auto mb-2"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-white text-sm font-medium">
                    {post.label}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-[#64929E] text-sm">
            Фото и видео с наших туров, закулисье подготовки и атмосфера путешествий
          </p>
        </div>
      </div>
    </section>
  );
}
