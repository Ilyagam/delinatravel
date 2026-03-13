"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <button
      onClick={logout}
      className="text-[#64929E] text-sm hover:text-[#134E6F] transition-colors"
    >
      Выйти
    </button>
  );
}
