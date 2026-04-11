import { Tour } from "@/types";
import ApplicationForm from "./ApplicationForm";

interface ContactSectionProps {
  tours: Tour[];
}

export default function ContactSection({ tours }: ContactSectionProps) {
  return (
    <section id="contact" className="py-12 md:py-16 px-6 md:px-10 bg-[#F0F7FA]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <span
            className="font-handwritten text-xl block mb-3"
            style={{ fontFamily: "'Caveat', cursive", color: "#F0A868" }}
          >
            напишите нам
          </span>
          <h2
            className="text-4xl md:text-5xl font-light text-[#134E6F] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Оставьте заявку
          </h2>
          <p className="text-[#64929E] leading-relaxed mb-8">
            Расскажите нам о себе, и мы подберём идеальный тур или ответим на
            все вопросы.
          </p>

          {/* Contact buttons */}
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/77779470219"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-[#134E6F]/20 rounded-full px-6 py-3 text-sm text-[#134E6F] hover:bg-[#134E6F] hover:text-[#F0F7FA] transition-colors w-fit"
            >
              <span>WhatsApp</span>
              <span className="text-xs opacity-60">+7 777 947 02 19</span>
            </a>
            <a
              href="https://t.me/dlnvltr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-[#134E6F]/20 rounded-full px-6 py-3 text-sm text-[#134E6F] hover:bg-[#134E6F] hover:text-[#F0F7FA] transition-colors w-fit"
            >
              <span>Telegram</span>
              <span className="text-xs opacity-60">@dlnvltr</span>
            </a>
          </div>
        </div>

        <div>
          <ApplicationForm tours={tours} />
        </div>
      </div>
    </section>
  );
}
