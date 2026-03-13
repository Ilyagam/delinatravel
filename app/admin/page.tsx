import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { SEED_TOURS } from "@/lib/tours";
import AdminLogout from "./AdminLogout";
import { Tour, Application } from "@/types";
import { getAnalyticsStats } from "@/lib/analytics";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

async function getData(): Promise<{ tours: Tour[]; applications: Application[] }> {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url";

  if (!isSupabaseConfigured) {
    return { tours: SEED_TOURS, applications: [] };
  }

  const supabase = createServiceClient();
  const [{ data: tours }, { data: applications }] = await Promise.all([
    supabase.from("tours").select("*").order("created_at", { ascending: false }),
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    tours: (tours as Tour[]) || [],
    applications: (applications as Application[]) || [],
  };
}

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const [{ tours, applications }, analyticsStats] = await Promise.all([
    getData(),
    getAnalyticsStats(),
  ]);

  return (
    <div className="min-h-screen bg-[#F0F7FA] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              href="/"
              className="text-[#64929E] text-sm mb-2 block hover:text-[#134E6F]"
            >
              ← Сайт
            </Link>
            <h1
              className="text-4xl font-light text-[#134E6F]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Панель управления
            </h1>
          </div>
          <AdminLogout />
        </div>

        {/* Analytics */}
        <AnalyticsDashboard stats={analyticsStats} />

        {/* Tours */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-[#134E6F]">Туры</h2>
            <Link
              href="/admin/tours/new"
              className="bg-[#134E6F] text-[#F0F7FA] px-5 py-2.5 rounded-full text-sm hover:opacity-80 transition-opacity"
            >
              + Добавить тур
            </Link>
          </div>

          <div className="space-y-3">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-[#134E6F] truncate">
                      {tour.title}
                    </span>
                    {!tour.is_active && (
                      <span className="text-xs bg-[#64929E]/20 text-[#64929E] px-2 py-0.5 rounded-full flex-shrink-0">
                        скрыт
                      </span>
                    )}
                  </div>
                  <div className="text-[#64929E] text-sm">
                    {tour.destination} · {tour.dates}
                    {tour.price_from && (
                      <> · от {tour.price_from.toLocaleString("ru-RU")} ₸</>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/tours/${tour.slug}`}
                    target="_blank"
                    className="text-[#64929E] text-sm hover:text-[#134E6F]"
                  >
                    Просмотр
                  </Link>
                  <Link
                    href={`/admin/tours/${tour.id}/edit`}
                    className="text-[#134E6F] text-sm underline underline-offset-4 hover:opacity-60"
                  >
                    Изменить
                  </Link>
                </div>
              </div>
            ))}
            {tours.length === 0 && (
              <div className="text-[#64929E] text-sm text-center py-8">
                Туров пока нет
              </div>
            )}
          </div>
        </section>

        {/* Applications */}
        <section>
          <h2 className="text-xl font-medium text-[#134E6F] mb-6">
            Заявки{" "}
            {applications.length > 0 && (
              <span className="text-[#64929E] font-normal">
                ({applications.length})
              </span>
            )}
          </h2>

          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-[#134E6F] mb-1">
                      {app.name}
                    </div>
                    <div className="text-[#64929E] text-sm space-y-0.5">
                      <div>{app.phone}</div>
                      {app.tour_title && <div>Тур: {app.tour_title}</div>}
                      {app.message && <div className="mt-1">{app.message}</div>}
                    </div>
                  </div>
                  <div className="text-[#64929E] text-xs flex-shrink-0">
                    {new Date(app.created_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="text-[#64929E] text-sm text-center py-8">
                Заявок пока нет
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
