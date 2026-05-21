export default function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-16 px-6 md:px-10 bg-[#134E6F]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span
            className="font-handwritten text-xl block mb-4"
            style={{ fontFamily: "'Caveat', cursive", color: "#38BDF8" }}
          >
            о нас
          </span>
          <h2
            className="text-4xl md:text-5xl font-light text-[#F0F7FA] mb-8 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Путешествия,
            <br />
            где продумано всё
          </h2>
          <div className="space-y-4 text-[#F0F7FA]/75 leading-relaxed">
            <p>
              Delina Travel — travel brand из Астаны, создающий авторские
              путешествия по Азии и Европе для тех, кто хочет не просто отдых,
              а настоящие эмоции, новых людей и воспоминания, к которым хочется
              возвращаться.
            </p>
            <p>
              Girls Trips, social trips, Europe experiences и авторские маршруты,
              где уже продумано всё — от красивых локаций и комфортного
              проживания до атмосферы, ради которой люди летят снова.
            </p>
            <p>
              Большинство участников путешествуют одни — и находят друзей по
              всему миру уже в первой поездке.
            </p>
            <p className="text-[#38BDF8] italic" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem" }}>
              The world is too big to stay in one place 🩵
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "✨", heading: "350+", label: "людей уже путешествовали с нами" },
            { icon: "🌴", heading: "ASIA & EUROPE", label: "авторские маршруты по самым вдохновляющим направлениям" },
            { icon: "🤍", heading: "Комфорт и поддержка", label: "остаёмся на связи и сопровождаем вас на каждом этапе поездки" },
            { icon: "🥂", heading: "Новые знакомства", label: "travel-группы, где легко найти своих друзей" },
          ].map((stat) => (
            <div
              key={stat.heading}
              className="bg-[#F0F7FA]/5 border border-[#F0F7FA]/10 rounded-2xl p-6"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div
                className="text-2xl font-light text-[#38BDF8] mb-2 leading-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {stat.heading}
              </div>
              <div className="text-[#F0F7FA]/60 text-sm leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
