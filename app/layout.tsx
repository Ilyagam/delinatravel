import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SiteAnalytics from "@/components/SiteAnalytics";
import JsonLd from "@/components/JsonLd";
import FloatingCTA from "@/components/FloatingCTA";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const BASE_URL = "https://delinatravel.kz";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Delina Travel — авторские групповые путешествия по Азии",
    template: "%s | Delina Travel",
  },
  description:
    "Авторские групповые туры по Азии из Казахстана — Girls Trip, девичники, молодёжные путешествия. Бали, Таиланд, Куала-Лумпур. Организатор сопровождает на каждом туре.",
  keywords: [
    "групповые туры из Казахстана",
    "авторские туры Азия",
    "Girls Trip Бали",
    "туры для девушек",
    "девичник за границей",
    "групповые путешествия Алматы",
    "туроператор Казахстан",
    "Delina Travel",
    "туры Бали из Алматы",
    "молодёжные туры Азия",
  ],
  authors: [{ name: "Delina Travel", url: BASE_URL }],
  creator: "Delina Travel",
  publisher: "Delina Travel",
  category: "travel",
  openGraph: {
    title: "Delina Travel — авторские групповые путешествия",
    description:
      "Мир слишком большой, чтобы сидеть дома. Авторские групповые туры по Азии из Казахстана.",
    url: BASE_URL,
    siteName: "Delina Travel",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/photos/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Delina Travel — авторские групповые путешествия",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delina Travel — авторские групповые путешествия",
    description: "Авторские групповые туры по Азии из Казахстана",
    images: ["/photos/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

// JSON-LD: TravelAgency — глобальная разметка для всего сайта
const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "LocalBusiness"],
  name: "Delina Travel",
  description:
    "Авторские групповые путешествия по Азии из Казахстана. Girls Trip, девичники, молодёжные туры. Группы до 12 человек с сопровождением организатора.",
  url: BASE_URL,
  telephone: "+77779470219",
  image: `${BASE_URL}/photos/hero.jpg`,
  inLanguage: "ru",
  priceRange: "730000-2000000 KZT",
  sameAs: [
    "https://www.instagram.com/delina_travel",
    "https://t.me/dlnvltr",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "KZ",
    addressLocality: "Алматы",
  },
  areaServed: {
    "@type": "Country",
    name: "Kazakhstan",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+77779470219",
    contactType: "customer service",
    availableLanguage: ["Russian"],
  },
};

// JSON-LD: WebSite — для Sitelinks Search Box в Google
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Delina Travel",
  url: BASE_URL,
  inLanguage: "ru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* GEO мета-теги для локального SEO */}
        <meta name="geo.region" content="KZ" />
        <meta name="geo.placename" content="Алматы, Казахстан" />
        <meta name="geo.position" content="43.2220;76.8512" />
        <meta name="ICBM" content="43.2220, 76.8512" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={travelAgencySchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <SiteAnalytics />
        {children}
        <FloatingCTA />
      </body>
    </html>
  );
}
