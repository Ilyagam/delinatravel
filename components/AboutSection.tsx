export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 px-6 md:px-10 bg-[#134E6F]">
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
              Delina Travel — это авторские групповые путешествия по самым
              красивым направлениям Азии.
            </p>
            <p>
              Мы создаём поездки, где продумано всё: комфортное проживание,
              интересные маршруты и атмосферная компания. В каждом путешествии
              вас сопровождает организатор, чтобы вы могли полностью
              наслаждаться поездкой.
            </p>
            <p className="text-[#38BDF8] italic" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem" }}>
              Мир слишком большой, чтобы сидеть дома. Поехали смотреть его
              вместе.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { number: "50+", label: "довольных путешественниц" },
            { number: "10+", label: "направлений Азии" },
            { number: "5", label: "форматов туров" },
            { number: "100%", label: "сопровождение организатора" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#F0F7FA]/5 border border-[#F0F7FA]/10 rounded-2xl p-6"
            >
              <div
                className="text-4xl font-light text-[#38BDF8] mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {stat.number}
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
