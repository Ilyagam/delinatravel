export default function Footer() {
  return (
    <footer className="bg-[#134E6F] text-[#F0F7FA] px-6 md:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Links + contacts — compact row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4 text-xs text-[#F0F7FA]/40">
            <a href="/faq" className="hover:text-[#F0F7FA]/70 transition-colors">
              Частые вопросы
            </a>
            <a href="/privacy" className="hover:text-[#F0F7FA]/70 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/oferta" className="hover:text-[#F0F7FA]/70 transition-colors">
              Публичная оферта
            </a>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <a
              href="https://wa.me/77779470219"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F0F7FA]/40 hover:text-[#F0F7FA]/70 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/dlnvltr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F0F7FA]/40 hover:text-[#F0F7FA]/70 transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://instagram.com/delina_travel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F0F7FA]/40 hover:text-[#F0F7FA]/70 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="border-t border-[#F0F7FA]/10 pt-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <span
              className="text-5xl md:text-7xl font-light text-[#F0F7FA]/10 tracking-widest"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              DELINA
            </span>
            <div className="text-right">
              <span className="text-[#F0F7FA]/30 text-xs block">
                © {new Date().getFullYear()} Delina Travel
              </span>
              <span className="text-[#F0F7FA]/20 text-[10px] block mt-0.5">
                ИП Delina Travel | БИН 791128450113 | Реестр Z1201355
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
