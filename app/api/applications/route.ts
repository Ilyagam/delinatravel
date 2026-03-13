import { NextRequest, NextResponse } from "next/server";
import { sendApplicationToTelegram } from "@/lib/telegram";
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

    // Send to Telegram (primary notification channel)
    await sendApplicationToTelegram(body);

    // Save to Supabase if configured
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submit error:", error);
    return NextResponse.json(
      { error: "Ошибка при отправке заявки" },
      { status: 500 }
    );
  }
}
