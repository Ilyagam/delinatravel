import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramAccordion from "@/components/ProgramAccordion";
import ApplicationForm from "@/components/ApplicationForm";
import JsonLd from "@/components/JsonLd";
import PhotoLightbox from "@/components/PhotoLightbox";
import { getTourBySlug, getActiveTours } from "@/lib/tours";

const BASE_URL = "https://delinatravel.kz";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};

  const title = `${tour.title} — ${tour.destination}`;
  const description =
    tour.short_description ||
    tour.description ||
    `Авторский групповой тур ${tour.title}. ${tour.destination}, ${tour.dates}.`;
  const image = tour.image_urls?.[0]
    ? tour.image_urls[0].startsWith("http")
      ? tour.image_urls[0]
      : `${BASE_URL}${tour.image_urls[0]}`
    : `${BASE_URL}/photos/hero.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/tours/${slug}`,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    alternates: { canonical: `${BASE_URL}/tours/${slug}` },
  };
}

export async function generateStaticParams() {
  const tours = await getActiveTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) notFound();

  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    url: `${BASE_URL}/tours/${slug}`,
    description: tour.description || tour.short_description,
    inLanguage: "ru",
    touristType: {
      "@type": "Audience",
      audienceType: "Groups",
    },
    ...(tour.price_from && {
      offers: {
        "@type": "Offer",
        price: tour.price_from,
        priceCurrency: "KZT",
        availability: "https://schema.org/InStock",
        url: `${BASE_URL}/tours/${slug}`,
        seller: {
          "@type": "TravelAgency",
          name: "Delina Travel",
          url: BASE_URL,
        },
      },
    }),
    image: (tour.image_urls ?? []).map((url) =>
      url.startsWith("http") ? url : `${BASE_URL}${url}`
    ),
    provider: {
      "@type": "TravelAgency",
      name: "Delina Travel",
      url: BASE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Туры", item: `${BASE_URL}/#tours` },
      { "@type": "ListItem", position: 3, name: tour.title, item: `${BASE_URL}/tours/${slug}` },
    ],
  };

  return (
    <>
      <Navbar />
      <JsonLd data={tourSchema} />
      <JsonLd data={breadcrumbSchema} />
      <main>
        {/* Hero with title overlay */}
        <section className="relative">
          {/* Title bar */}
          <div className="bg-[#134E6F] pt-24 pb-8 px-6 md:px-10">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/#tours"
                className="text-[#F0F7FA]/60 text-sm mb-6 block hover:text-[#F0F7FA] transition-colors"
              >
                ← Все туры
              </Link>
              <span className="text-[#38BDF8] text-sm tracking-widest uppercase mb-3 block">
                {tour.destination}
              </span>
              <h1
                className="text-5xl md:text-6xl font-light text-[#F0F7FA] mb-4 leading-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {tour.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-[#F0F7FA]/70 text-sm">
                <span>📅 {tour.dates}</span>
                {tour.price_from && (
                  <span>
                    💰 от {tour.price_from.toLocaleString("ru-RU")} ₸
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Full-width hero photo + mosaic gallery + lightbox */}
          {tour.image_urls && tour.image_urls.length > 0 && (
            <PhotoLightbox images={tour.image_urls} tourTitle={tour.title} />
          )}
        </section>

        {/* Content */}
        <section className="py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {tour.description && (
                <div>
                  <h2
                    className="text-3xl font-light text-[#134E6F] mb-4"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    О поездке
                  </h2>
                  <p className="text-[#64929E] leading-relaxed">
                    {tour.description}
                  </p>
                </div>
              )}

              {/* What's included / excluded */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {tour.what_included && tour.what_included.length > 0 && (
                  <div>
                    <h3 className="font-medium text-[#134E6F] mb-4 text-sm tracking-wide uppercase">
                      Включено
                    </h3>
                    <ul className="space-y-2">
                      {tour.what_included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#64929E]">
                          <span className="text-[#1A97B5] mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.what_excluded && tour.what_excluded.length > 0 && (
                  <div>
                    <h3 className="font-medium text-[#134E6F] mb-4 text-sm tracking-wide uppercase">
                      Не включено
                    </h3>
                    <ul className="space-y-2">
                      {tour.what_excluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#64929E]">
                          <span className="text-[#64929E]/60 mt-0.5">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {tour.program && tour.program.length > 0 && (
                <div>
                  <h2
                    className="text-3xl font-light text-[#134E6F] mb-6"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Программа
                  </h2>
                  <ProgramAccordion program={tour.program} />
                </div>
              )}

              {tour.accommodation && (
                <div>
                  <h2
                    className="text-3xl font-light text-[#134E6F] mb-4"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Проживание
                  </h2>
                  <p className="text-[#64929E]">{tour.accommodation}</p>
                </div>
              )}
            </div>

            {/* Sidebar — booking form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-[#134E6F] rounded-3xl p-8">
                <div
                  className="text-2xl font-light text-[#F0F7FA] mb-2"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Забронировать
                </div>
                {tour.price_from && (
                  <div className="text-[#38BDF8] mb-6">
                    от {tour.price_from.toLocaleString("ru-RU")} ₸
                  </div>
                )}
                <ApplicationForm
                  preselectedTourId={tour.id}
                  preselectedTourTitle={tour.title}
                  variant="dark"
                />

                <div className="mt-6 pt-6 border-t border-[#F0F7FA]/10 flex flex-col gap-3">
                  <a
                    href="https://wa.me/77779470219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F0F7FA]/60 text-sm hover:text-[#F0F7FA] transition-colors text-center"
                  >
                    Написать в WhatsApp →
                  </a>
                  <a
                    href="https://t.me/dlnvltr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F0F7FA]/60 text-sm hover:text-[#F0F7FA] transition-colors text-center"
                  >
                    Написать в Telegram →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
