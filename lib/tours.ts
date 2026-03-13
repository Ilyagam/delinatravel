import { Tour } from "@/types";
import { supabase, isConfigured } from "./supabase";

// REASON: Seed data for development while waiting for client photos/content
export const SEED_TOURS: Tour[] = [
  {
    id: "seed-1",
    slug: "girls-trip-bali-2026",
    title: "Girls Trip на Бали",
    destination: "Куала-Лумпур + остров Бали",
    dates: "26 марта – 5 апреля 2026",
    short_description:
      "Групповой тур для девушек — виллы, океан, незабываемые эмоции",
    description:
      "10 дней в окружении красивых мест, вкусной еды и классных девочек. Куала-Лумпур встретит небоскрёбами, а Бали — рисовыми полями и океанскими закатами.",
    price_from: 799000,
    what_included: [
      "Международные перелёты",
      "Проживание на виллах и в отелях",
      "Завтраки",
      "Трансфер аэропорт – отель – аэропорт",
      "Сопровождение организатора",
      "Расширенная медицинская страховка",
      "Travel-комплимент от Delina Travel",
    ],
    what_excluded: [
      "Обеды и ужины (кроме завтраков)",
      "Личные расходы",
      "Дополнительные экскурсии",
    ],
    program: [
      {
        day: 1,
        title: "Вылет. Куала-Лумпур",
        description:
          "Прилёт в Куала-Лумпур, заселение в отель. Вечерняя прогулка к башням Петронас.",
      },
      {
        day: 2,
        title: "Знакомство с городом",
        description:
          "Завтрак в отеле. Экскурсия по городу: Голубая мечеть, рынок Пасар Сени, смотровая площадка.",
      },
      {
        day: 3,
        title: "Перелёт на Бали",
        description:
          "Утренний перелёт на остров богов. Заселение на виллу. Первый закат на рисовых террасах.",
      },
      {
        day: 4,
        title: "Убуд — сердце Бали",
        description:
          "Лесной парк обезьян, традиционный балийский массаж, закупка специй на местном рынке.",
      },
      {
        day: 5,
        title: "Пляжный день",
        description:
          "Свободный день на океане. Серфинг по желанию, coconut coffee, волшебные закаты.",
      },
    ],
    accommodation:
      "Частная вилла с бассейном (2-3 девушки на виллу) + отель 4★ в Куала-Лумпуре",
    image_urls: ["/photos/snorkel.jpg", "/photos/tour-bali.jpg", "/photos/group.jpg"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export async function getActiveTours(): Promise<Tour[]> {
  if (!isConfigured() || !supabase) {
    return SEED_TOURS;
  }

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return SEED_TOURS;
  return data as Tour[];
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  if (!isConfigured() || !supabase) {
    return SEED_TOURS.find((t) => t.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Tour;
}
