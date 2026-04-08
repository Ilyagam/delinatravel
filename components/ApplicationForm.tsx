"use client";

import { useState } from "react";
import { Tour } from "@/types";

interface ApplicationFormProps {
  tours?: Tour[];
  preselectedTourId?: string;
  preselectedTourTitle?: string;
}

export default function ApplicationForm({
  tours = [],
  preselectedTourId,
  preselectedTourTitle,
}: ApplicationFormProps) {
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
          className="text-6xl font-light text-[#134E6F] mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Отлично!
        </div>
        <p className="text-[#64929E] mb-6">
          Заявка отправлена. Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm underline underline-offset-4 text-[#134E6F]"
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
          className="w-full border-b border-[#134E6F]/30 bg-transparent px-1 py-3 text-[#134E6F] placeholder-[#64929E] outline-none focus:border-[#134E6F] transition-colors"
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
          className="w-full border-b border-[#134E6F]/30 bg-transparent px-1 py-3 text-[#134E6F] placeholder-[#64929E] outline-none focus:border-[#134E6F] transition-colors"
        />
      </div>
      {tours.length > 0 && !preselectedTourId && (
        <div>
          <label htmlFor="app-tour" className="sr-only">Выбрать тур</label>
          <select
            id="app-tour"
            value={form.tour_id}
            onChange={handleTourChange}
            className="w-full border-b border-[#134E6F]/30 bg-transparent px-1 py-3 text-[#134E6F] outline-none focus:border-[#134E6F] transition-colors appearance-none cursor-pointer"
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
        <div className="py-3 text-[#134E6F]/70 text-sm border-b border-[#134E6F]/10">
          Тур: <span className="font-medium text-[#134E6F]">{preselectedTourTitle}</span>
        </div>
      )}

      <label className="flex items-start gap-2 cursor-pointer mt-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-[#134E6F]"
          required
        />
        <span className="text-xs text-[#64929E] leading-relaxed">
          Я согласен(а) на{" "}
          <a href="/privacy" className="underline hover:text-[#134E6F]">
            обработку персональных данных
          </a>
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="text-red-500 text-sm">
          Что-то пошло не так. Попробуйте ещё раз или напишите нам напрямую.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !agreed}
        className="w-full bg-[#134E6F] text-[#F0F7FA] py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 mt-4"
      >
        {status === "loading" ? "Отправляем..." : "Отправить заявку"}
      </button>
    </form>
  );
}
