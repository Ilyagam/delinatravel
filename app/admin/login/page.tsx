"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Неверный пароль");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#134E6F] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1
          className="text-4xl font-light text-[#F0F7FA] mb-2 text-center"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Delina Travel
        </h1>
        <p className="text-[#F0F7FA]/50 text-sm text-center mb-10">
          Панель управления
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#F0F7FA]/10 border border-[#F0F7FA]/20 rounded-2xl px-5 py-4 text-[#F0F7FA] placeholder-[#F0F7FA]/30 outline-none focus:border-[#38BDF8] transition-colors"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F0F7FA] text-[#134E6F] py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
