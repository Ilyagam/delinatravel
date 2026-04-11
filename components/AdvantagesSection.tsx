const advantages = [
  {
    title: "Маленькие группы",
    description: "До 12 человек — каждая чувствует заботу и внимание",
  },
  {
    title: "Продуманная программа",
    description: "Маршрут, отели, трансферы — всё организовано заранее",
  },
  {
    title: "Сопровождение",
    description: "Организатор едет вместе с группой от и до",
  },
  {
    title: "Необычные локации",
    description: "Не туристические тропы, а места, где живёт настоящая жизнь",
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
            Преимущества
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, i) => (
            <div
              key={item.title}
              className="border border-[#134E6F]/15 rounded-2xl p-6 hover:border-[#134E6F]/30 transition-colors"
            >
              <div
                className="text-5xl font-light text-[#134E6F]/25 mb-4"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                0{i + 1}
              </div>
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
