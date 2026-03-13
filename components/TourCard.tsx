import Link from "next/link";
import Image from "next/image";
import { Tour } from "@/types";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 bg-[#1A97B5]">
        {tour.image_urls && tour.image_urls.length > 0 ? (
          <Image
            src={tour.image_urls[0]}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-6"
            style={{
              background:
                "linear-gradient(160deg, #1A97B5 0%, #134E6F 100%)",
            }}
          >
            <span
              className="text-[#38BDF8] text-5xl font-light leading-none"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {tour.destination}
            </span>
          </div>
        )}
        {/* Overlay with destination */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#134E6F]/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[#38BDF8] text-xs tracking-widest uppercase">
            {tour.destination}
          </span>
        </div>
      </div>

      <div>
        <h3
          className="text-2xl font-light text-[#134E6F] mb-1 group-hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {tour.title}
        </h3>
        <p className="text-[#64929E] text-sm mb-3">{tour.dates}</p>
        {tour.short_description && (
          <p className="text-[#134E6F]/70 text-sm leading-relaxed line-clamp-2">
            {tour.short_description}
          </p>
        )}
        {tour.price_from && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[#134E6F] font-medium">
              от {tour.price_from.toLocaleString("ru-RU")} ₸
            </span>
            <span className="text-[#134E6F] text-sm underline underline-offset-4">
              Подробнее →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
