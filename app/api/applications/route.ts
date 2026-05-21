import { NextRequest, NextResponse } from "next/server";
import { ApplicationFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: ApplicationFormData = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    // Save to Supabase (admin-панель сайта читает заявки отсюда)
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url"
    ) {
      const { createServiceClient } = await import("@/lib/supabase");
      const supabase = createServiceClient();
      await supabase.from("applications").insert({
        name: body.name,
        phone: body.phone,
        tour_id: body.tour_id || null,
        tour_title: body.tour_title || null,
        message: body.message || null,
      });
    }

    // REASON: основное назначение заявки — лид в Flick CRM (тенант delina-travel).
    // Не блокирует ответ пользователю — если CRM недоступна, заявка всё равно сохранена в Supabase.
    if (process.env.CRM_WEBHOOK_URL) {
      try {
        const notes = [
          body.tour_title ? `Тур: ${body.tour_title}` : null,
          body.message || null,
        ].filter(Boolean).join("\n");
        const res = await fetch(process.env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.CRM_WEBHOOK_API_KEY || "",
          },
          body: JSON.stringify({
            name: body.name,
            phone: body.phone,
            source: "website",
            notes: notes || null,
          }),
        });
        if (!res.ok) {
          console.error("CRM webhook non-OK:", res.status, await res.text().catch(() => ""));
        }
      } catch (e) {
        console.error("CRM webhook failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submit error:", error);
    return NextResponse.json(
      { error: "Ошибка при отправке заявки" },
      { status: 500 }
    );
  }
}
