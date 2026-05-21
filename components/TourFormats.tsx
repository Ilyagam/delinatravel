const formats = [
  {
    title: "SOCIAL TRIPS",
    description:
      "Для тех, кто хочет путешествовать, знакомиться и проживать лучшие моменты не в одиночку. Новые страны, новые люди, rooftop-вечера, спонтанные приключения и поездки, после которых остаются друзья и воспоминания на всю жизнь.",
    icon: "✈️",
    cta: "Explore trips →",
  },
  {
    title: "GIRLS TRIPS",
    description:
      "Эстетичные путешествия для девушек — виллы, шопинг, красивые локации и атмосфера как в Pinterest. Бали, Корея, Дубай, brunch spots, spa, фотоконтент, sunset moments и поездки, которые хочется сохранить навсегда.",
    icon: "🌸",
    cta: "See the vibe →",
  },
  {
    title: "EUROPE EXPERIENCES",
    description:
      "Авторские путешествия по Европе с продуманными маршрутами и настоящим travel experience. Парижские улочки, Италия на рассвете, красивые города, локальные места и атмосфера свободы, ради которой хочется снова собирать чемодан.",
    icon: "🗺️",
    cta: "View routes →",
  },
  {
    title: "PRIVATE GROUPS",
    description:
      "Организуем путешествие для вашей компании — от билетов до полного сопровождения. Подберём направление, отели, программу и сделаем всё, чтобы ваша поездка была лёгкой, красивой и без лишнего стресса.",
    icon: "🥂",
    cta: "Plan your trip →",
  },
];

export default function TourFormats() {
  return (
    <section id="formats" className="py-12 md:py-16 px-6 md:px-10">
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
                {format.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
