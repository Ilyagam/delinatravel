const formats = [
  {
    title: "Молодёжные туры",
    description:
      "Яркие приключения для тех, кто хочет увидеть мир в компании близких по духу людей",
    icon: "✈️",
  },
  {
    title: "Девичники",
    description:
      "Незабываемые поездки для девушек — виллы, шоппинг, спа и лучшие воспоминания",
    icon: "🌸",
  },
  {
    title: "Групповые путешествия",
    description:
      "Авторские маршруты для небольших групп с личным сопровождением организатора",
    icon: "🗺️",
  },
  {
    title: "Сопровождение групп",
    description:
      "Организуем путешествие для вашей компании под ключ — от билетов до программы",
    icon: "🤝",
  },
];

export default function TourFormats() {
  return (
    <section id="formats" className="py-20 md:py-28 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <span
            className="font-handwritten text-xl block mb-3"
            style={{ fontFamily: "'Caveat', cursive", color: "#F0A868" }}
          >
            для каждой
          </span>
          <h2
            className="text-4xl md:text-5xl font-light text-[#134E6F]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Форматы путешествий
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((format) => (
            <div
              key={format.title}
              className="bg-[#134E6F] text-[#F0F7FA] rounded-2xl p-8 flex flex-col gap-4"
            >
              <span className="text-3xl">{format.icon}</span>
              <h3
                className="text-2xl font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {format.title}
              </h3>
              <p className="text-[#F0F7FA]/70 text-sm leading-relaxed">
                {format.description}
              </p>
              <a
                href="/#contact"
                className="mt-auto inline-flex items-center gap-2 text-[#38BDF8] text-sm hover:gap-3 transition-all"
              >
                Узнать подробнее →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
