// REASON: серверный компонент — тянет фото из Supabase на этапе ISR (revalidate=60)
// Карусель рендерится клиентским InstagramCarousel

import { supabase, isConfigured } from "@/lib/supabase";
import InstagramCarousel from "./InstagramCarousel";

const INSTAGRAM_URL = "https://www.instagram.com/delina_travel";

export type InstagramPost = {
  image_url: string;
  caption: string;
  permalink: string;
};

async function getInstagramPosts(): Promise<InstagramPost[]> {
  if (!isConfigured() || !supabase) return [];

  const { data, error } = await supabase
    .from("instagram_posts")
    .select("image_url, caption, permalink")
    .order("posted_at", { ascending: false })
    .limit(12);

  if (error || !data?.length) return [];
  return data;
}

export default async function InstagramSection() {
  const posts = await getInstagramPosts();
  const hasPhotos = posts.length > 0;

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
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
      </div>

      {/* Carousel — full width, без ограничения max-w */}
      {hasPhotos ? (
        <InstagramCarousel posts={posts} />
      ) : (
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center py-16 bg-gradient-to-br from-[#1A97B5]/10 to-[#134E6F]/10 rounded-2xl">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A97B5] hover:underline text-lg"
            >
              Подписывайтесь на @delina_travel
            </a>
            <p className="text-[#64929E] text-sm mt-2">
              Фото и видео с наших туров, закулисье подготовки и атмосфера путешествий
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-10">
        <a
          href="/#contact"
          className="inline-flex items-center gap-2 bg-[#1A97B5] hover:bg-[#134E6F] text-white px-8 py-4 rounded-full text-base font-medium transition-colors"
          style={{ scrollBehavior: "smooth" }}
        >
          Хочу в тур!
        </a>
        <p className="text-[#64929E] text-sm mt-4">
          Фото и видео с наших туров, закулисье подготовки и атмосфера путешествий
        </p>
      </div>
    </section>
  );
}
