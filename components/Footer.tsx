export default function Footer() {
  return (
    <footer className="bg-[#134E6F] text-[#F0F7FA] px-6 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <div
              className="text-3xl font-light mb-2"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Delina Travel
            </div>
            <p className="text-[#F0F7FA]/50 text-sm max-w-xs">
              Авторские групповые путешествия по Азии
            </p>
            <div className="text-[#F0F7FA]/30 text-xs mt-3 space-y-0.5">
              <p>ИП Delina Travel | БИН 791128450113</p>
              <p>г. Астана, ул. Асфендиярова, дом 5</p>
              <p>Реестр турагентов: Z1201355</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/77779470219"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F0F7FA]/70 hover:text-[#F0F7FA] text-sm transition-colors"
            >
              WhatsApp: +7 777 947 02 19
            </a>
            <a
              href="https://t.me/dlnvltr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F0F7FA]/70 hover:text-[#F0F7FA] text-sm transition-colors"
            >
              Telegram: @dlnvltr
            </a>
            <a
              href="https://instagram.com/delina_travel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F0F7FA]/70 hover:text-[#F0F7FA] text-sm transition-colors"
            >
              Instagram: @delina_travel
            </a>
          </div>
        </div>

        <div className="border-t border-[#F0F7FA]/10 pt-6">
          <div className="flex flex-wrap gap-4 mb-4 text-xs text-[#F0F7FA]/40">
            <a href="/privacy" className="hover:text-[#F0F7FA]/70 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/oferta" className="hover:text-[#F0F7FA]/70 transition-colors">
              Публичная оферта
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span
              className="text-5xl md:text-7xl font-light text-[#F0F7FA]/10 tracking-widest"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              DELINA
            </span>
            <span className="text-[#F0F7FA]/30 text-xs">
              © {new Date().getFullYear()} Delina Travel. Алматы, Казахстан
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
