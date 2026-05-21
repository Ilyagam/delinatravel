const advantages = [
  {
    icon: "✈️",
    title: "Не нужно искать компанию",
    description: "Многие участники летят solo и знакомятся уже в поездке",
  },
  {
    icon: "🌍",
    title: "Маршруты без скучного туризма",
    description: "Только красивые локации, живые города и настоящий travel vibe",
  },
  {
    icon: "🤍",
    title: "Спокойно и комфортно",
    description: "Мы берём организацию на себя, чтобы вы просто наслаждались поездкой",
  },
  {
    icon: "📸",
    title: "Путешествия, которые хочется сохранить",
    description: "Новые эмоции, люди и moments, к которым хочется возвращаться",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="py-12 md:py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <span
            className="font-handwritten text-xl block mb-3"
            style={{ fontFamily: "'Caveat', cursive", color: "#F0A868" }}
          >
            почему мы
          </span>
          <h2
            className="text-4xl md:text-5xl font-light text-[#134E6F]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Почему путешествуют с нами
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="border border-[#134E6F]/15 rounded-2xl p-6 hover:border-[#134E6F]/30 transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-medium text-[#134E6F] mb-2">{item.title}</h3>
              <p className="text-[#64929E] text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
