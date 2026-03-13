"use client";

import { useState } from "react";
import { ProgramDay } from "@/types";

interface ProgramAccordionProps {
  program: ProgramDay[];
}

export default function ProgramAccordion({ program }: ProgramAccordionProps) {
  const [openDay, setOpenDay] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {program.map((day, i) => (
        <div
          key={day.day}
          className="border border-[#134E6F]/15 rounded-2xl overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#134E6F]/5 transition-colors"
            onClick={() => setOpenDay(openDay === i ? null : i)}
          >
            <div className="flex items-center gap-4">
              <span
                className="text-2xl font-light text-[#134E6F]/30 w-8"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {String(day.day).padStart(2, "0")}
              </span>
              <span className="font-medium text-[#134E6F] text-sm">
                {day.title}
              </span>
            </div>
            <span
              className={`text-[#134E6F]/50 transition-transform ${openDay === i ? "rotate-45" : ""}`}
            >
              +
            </span>
          </button>
          {openDay === i && (
            <div className="px-6 pb-5 pl-[4.5rem]">
              <p className="text-[#64929E] text-sm leading-relaxed">
                {day.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
