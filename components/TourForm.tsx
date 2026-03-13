"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tour, ProgramDay } from "@/types";

type TourFormData = {
  title: string;
  slug: string;
  destination: string;
  dates: string;
  short_description: string;
  description: string;
  price_from: string;
  what_included: string[];
  what_excluded: string[];
  program: ProgramDay[];
  accommodation: string;
  image_urls: string[];
  is_active: boolean;
};

function toFormData(tour?: Tour | null): TourFormData {
  return {
    title: tour?.title ?? "",
    slug: tour?.slug ?? "",
    destination: tour?.destination ?? "",
    dates: tour?.dates ?? "",
    short_description: tour?.short_description ?? "",
    description: tour?.description ?? "",
    price_from: tour?.price_from?.toString() ?? "",
    what_included: tour?.what_included ?? [""],
    what_excluded: tour?.what_excluded ?? [""],
    program: tour?.program ?? [{ day: 1, title: "", description: "" }],
    accommodation: tour?.accommodation ?? "",
    image_urls: tour?.image_urls ?? [""],
    is_active: tour?.is_active ?? true,
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface Props {
  tour?: Tour | null;
  mode: "create" | "edit";
}

export default function TourForm({ tour, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<TourFormData>(toFormData(tour));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const set = (field: keyof TourFormData, value: TourFormData[keyof TourFormData]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Arrays helpers
  const setArrayItem = (
    field: "what_included" | "what_excluded" | "image_urls",
    index: number,
    value: string
  ) => {
    const arr = [...form[field]];
    arr[index] = value;
    set(field, arr);
  };
  const addArrayItem = (field: "what_included" | "what_excluded" | "image_urls") =>
    set(field, [...form[field], ""]);
  const removeArrayItem = (
    field: "what_included" | "what_excluded" | "image_urls",
    index: number
  ) => set(field, form[field].filter((_, i) => i !== index));

  // Program helpers
  const setProgramItem = (index: number, key: keyof ProgramDay, value: string | number) => {
    const arr = form.program.map((d, i) => (i === index ? { ...d, [key]: value } : d));
    set("program", arr);
  };
  const addProgramDay = () =>
    set("program", [
      ...form.program,
      { day: form.program.length + 1, title: "", description: "" },
    ]);
  const removeProgramDay = (index: number) => {
    const arr = form.program
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    set("program", arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price_from: form.price_from ? parseInt(form.price_from, 10) : null,
      what_included: form.what_included.filter(Boolean),
      what_excluded: form.what_excluded.filter(Boolean),
      image_urls: form.image_urls.filter(Boolean),
      program: form.program.filter((d) => d.title),
    };

    const url =
      mode === "create" ? "/api/admin/tours" : `/api/admin/tours/${tour!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Ошибка сохранения");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить тур? Это необратимо.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/tours/${tour!.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Ошибка удаления");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <section className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="font-medium text-[#134E6F]">Основное</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#64929E] mb-1">Название тура *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (mode === "create") set("slug", slugify(e.target.value));
              }}
              className={inputCls}
              placeholder="Girls Trip на Бали"
            />
          </div>
          <div>
            <label className="block text-sm text-[#64929E] mb-1">Slug (URL) *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className={inputCls}
              placeholder="girls-trip-bali-2026"
            />
          </div>
          <div>
            <label className="block text-sm text-[#64929E] mb-1">Направление *</label>
            <input
              type="text"
              required
              value={form.destination}
              onChange={(e) => set("destination", e.target.value)}
              className={inputCls}
              placeholder="Куала-Лумпур + Бали"
            />
          </div>
          <div>
            <label className="block text-sm text-[#64929E] mb-1">Даты *</label>
            <input
              type="text"
              required
              value={form.dates}
              onChange={(e) => set("dates", e.target.value)}
              className={inputCls}
              placeholder="26 марта – 5 апреля 2026"
            />
          </div>
          <div>
            <label className="block text-sm text-[#64929E] mb-1">Цена от (₸)</label>
            <input
              type="number"
              value={form.price_from}
              onChange={(e) => set("price_from", e.target.value)}
              className={inputCls}
              placeholder="799000"
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              className="w-4 h-4 accent-[#134E6F]"
            />
            <label htmlFor="is_active" className="text-sm text-[#134E6F]">
              Показывать на сайте
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#64929E] mb-1">Краткое описание (для карточки)</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => set("short_description", e.target.value)}
            className={inputCls}
            placeholder="Групповой тур для девушек — виллы, океан, незабываемые эмоции"
          />
        </div>

        <div>
          <label className="block text-sm text-[#64929E] mb-1">Полное описание</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputCls}
            placeholder="10 дней в окружении красивых мест..."
          />
        </div>

        <div>
          <label className="block text-sm text-[#64929E] mb-1">Проживание</label>
          <input
            type="text"
            value={form.accommodation}
            onChange={(e) => set("accommodation", e.target.value)}
            className={inputCls}
            placeholder="Частная вилла с бассейном (2-3 девушки) + отель 4★"
          />
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-[#134E6F]">Фото (URL)</h2>
          <button type="button" onClick={() => addArrayItem("image_urls")} className={addBtnCls}>
            + Добавить
          </button>
        </div>
        {form.image_urls.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setArrayItem("image_urls", i, e.target.value)}
              className={`${inputCls} flex-1`}
              placeholder="/photos/bali.jpg или https://..."
            />
            {form.image_urls.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem("image_urls", i)}
                className={removeBtnCls}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Included / Excluded */}
      <section className="bg-white rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-[#134E6F]">Включено</h2>
            <button type="button" onClick={() => addArrayItem("what_included")} className={addBtnCls}>
              + Добавить
            </button>
          </div>
          {form.what_included.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => setArrayItem("what_included", i, e.target.value)}
                className={`${inputCls} flex-1`}
                placeholder="Международные перелёты"
              />
              {form.what_included.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("what_included", i)}
                  className={removeBtnCls}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-[#134E6F]">Не включено</h2>
            <button type="button" onClick={() => addArrayItem("what_excluded")} className={addBtnCls}>
              + Добавить
            </button>
          </div>
          {form.what_excluded.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => setArrayItem("what_excluded", i, e.target.value)}
                className={`${inputCls} flex-1`}
                placeholder="Личные расходы"
              />
              {form.what_excluded.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("what_excluded", i)}
                  className={removeBtnCls}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Program */}
      <section className="bg-white rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-[#134E6F]">Программа по дням</h2>
          <button type="button" onClick={addProgramDay} className={addBtnCls}>
            + День
          </button>
        </div>
        {form.program.map((day, i) => (
          <div key={i} className="border border-[#D0E8F0] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#134E6F]">День {day.day}</span>
              {form.program.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProgramDay(i)}
                  className="text-[#F0A868] text-sm hover:opacity-70"
                >
                  Удалить
                </button>
              )}
            </div>
            <input
              type="text"
              value={day.title}
              onChange={(e) => setProgramItem(i, "title", e.target.value)}
              className={inputCls}
              placeholder="Название дня: Вылет. Куала-Лумпур"
            />
            <textarea
              rows={2}
              value={day.description}
              onChange={(e) => setProgramItem(i, "description", e.target.value)}
              className={inputCls}
              placeholder="Что происходит в этот день..."
            />
          </div>
        ))}
      </section>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 text-sm hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            {deleting ? "Удаляем..." : "Удалить тур"}
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-5 py-2.5 rounded-full text-sm text-[#64929E] hover:text-[#134E6F] transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#134E6F] text-[#F0F7FA] px-6 py-2.5 rounded-full text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {saving ? "Сохраняем..." : mode === "create" ? "Создать тур" : "Сохранить"}
          </button>
        </div>
      </div>
    </form>
  );
}

const inputCls =
  "w-full bg-[#F0F7FA] border border-[#D0E8F0] rounded-xl px-4 py-2.5 text-[#134E6F] text-sm placeholder-[#64929E] outline-none focus:border-[#38BDF8] transition-colors";

const addBtnCls =
  "text-[#134E6F] text-xs border border-[#134E6F]/30 rounded-full px-3 py-1 hover:bg-[#134E6F] hover:text-[#F0F7FA] transition-colors";

const removeBtnCls =
  "text-[#F0A868] text-lg leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0A868]/10 transition-colors flex-shrink-0";
