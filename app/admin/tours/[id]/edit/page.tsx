import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { SEED_TOURS } from "@/lib/tours";
import TourForm from "@/components/TourForm";
import { Tour } from "@/types";

async function getTour(id: string): Promise<Tour | null> {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url";

  if (!isSupabaseConfigured) {
    return SEED_TOURS.find((t) => t.id === id) ?? null;
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Tour;
}

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) notFound();

  return (
    <div className="min-h-screen bg-[#F0F7FA] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-[#64929E] text-sm mb-2 block hover:text-[#134E6F]"
          >
            ← Панель управления
          </Link>
          <h1
            className="text-4xl font-light text-[#134E6F]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Редактировать тур
          </h1>
          <p className="text-[#64929E] text-sm mt-1">{tour.title}</p>
        </div>

        <TourForm mode="edit" tour={tour} />
      </div>
    </div>
  );
}
