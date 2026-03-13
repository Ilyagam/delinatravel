import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import TourForm from "@/components/TourForm";

export default async function NewTourPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) redirect("/admin/login");

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
            Новый тур
          </h1>
        </div>

        <TourForm mode="create" />
      </div>
    </div>
  );
}
