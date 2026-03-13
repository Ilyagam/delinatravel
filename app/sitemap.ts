import { MetadataRoute } from "next";
import { getActiveTours } from "@/lib/tours";

const BASE_URL = "https://delinatravel.kz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await getActiveTours();

  const tourEntries: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${BASE_URL}/tours/${tour.slug}`,
    lastModified: new Date(tour.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...tourEntries,
  ];
}
