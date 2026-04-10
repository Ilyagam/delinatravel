"use client";

import { useState } from "react";
import { Tour } from "@/types";

interface ApplicationFormProps {
  tours?: Tour[];
  preselectedTourId?: string;
  preselectedTourTitle?: string;
  variant?: "light" | "dark";
}

export default function ApplicationForm({
  tours = [],
  preselectedTourId,
  preselectedTourTitle,
  variant = "light",
}: ApplicationFormProps) {
  const isDark = variant === "dark";
  const inputClass = isDark
    ? "w-full border-b border-[#F0F7FA]/30 bg-transparent px-1 py-3 text-[#F0F7FA] placeholder-[#F0F7FA]/50 outline-none focus:border-[#38BDF8] transition-colors"
    : "w-full border-b border-[#134E6F]/30 bg-transparent px-1 py-3 text-[#134E6F] placeholder-[#64929E] outline-none focus:border-[#134E6F] transition-colors";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    tour_id: preselectedTourId || "",
    tour_title: preselectedTourTitle || "",
    message: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Network error");
      setStatus("success");
      setForm({ name: "", phone: "", tour_id: "", tour_title: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const handleTourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tours.find((t) => t.id === e.target.value);
    setForm((f) => ({
      ...f,
      tour_id: e.target.value,
      tour_title: selected?.title || "",
    }));
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div
          className={`text-6xl font-light mb-4 ${isDark ? "text-[#F0F7FA]" : "text-[#134E6F]"}`}
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Отлично!
        </div>
        <p className={isDark ? "text-[#F0F7FA]/70 mb-6" : "text-[#64929E] mb-6"}>
          Заявка отправлена. Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className={`text-sm underline underline-offset-4 ${isDark ? "text-[#38BDF8]" : "text-[#134E6F]"}`}
        >
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto md:mx-0">
      <div>
        <label htmlFor="app-name" className="sr-only">Ваше имя</label>
        <input
          id="app-name"
          type="text"
          placeholder="Ваше имя"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="app-phone" className="sr-only">Номер телефона</label>
        <input
          id="app-phone"
          type="tel"
          placeholder="Номер телефона / WhatsApp"
          required
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className={inputClass}
        />
      </div>
      {tours.length > 0 && !preselectedTourId && (
        <div>
          <label htmlFor="app-tour" className="sr-only">Выбрать тур</label>
          <select
            id="app-tour"
            value={form.tour_id}
            onChange={handleTourChange}
            className={isDark
              ? "w-full border-b border-[#F0F7FA]/30 bg-transparent px-1 py-3 text-[#F0F7FA] outline-none focus:border-[#38BDF8] transition-colors appearance-none cursor-pointer"
              : "w-full border-b border-[#134E6F]/30 bg-transparent px-1 py-3 text-[#134E6F] outline-none focus:border-[#134E6F] transition-colors appearance-none cursor-pointer"
            }
          >
            <option value="">Выбрать тур (необязательно)</option>
            {tours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}
      {preselectedTourTitle && (
        <div className={isDark
          ? "py-3 text-[#F0F7FA]/70 text-sm border-b border-[#F0F7FA]/10"
          : "py-3 text-[#134E6F]/70 text-sm border-b border-[#134E6F]/10"
        }>
          Тур: <span className={isDark ? "font-medium text-[#F0F7FA]" : "font-medium text-[#134E6F]"}>{preselectedTourTitle}</span>
        </div>
      )}

      <label className="flex items-start gap-2 cursor-pointer mt-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className={isDark ? "mt-1 accent-[#38BDF8]" : "mt-1 accent-[#134E6F]"}
          required
        />
        <span className={isDark ? "text-xs text-[#F0F7FA]/60 leading-relaxed" : "text-xs text-[#64929E] leading-relaxed"}>
          Я согласен(а) на{" "}
          <a href="/privacy" className={isDark ? "underline hover:text-[#F0F7FA]" : "underline hover:text-[#134E6F]"}>
            обработку персональных данных
          </a>
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="text-red-400 text-sm">
          Что-то пошло не так. Попробуйте ещё раз или напишите нам напрямую.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !agreed}
        className={isDark
          ? "w-full bg-[#38BDF8] text-[#134E6F] py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 mt-4"
          : "w-full bg-[#134E6F] text-[#F0F7FA] py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 mt-4"
        }
      >
        {status === "loading" ? "Отправляем..." : "Отправить заявку"}
      </button>
    </form>
  );
}
