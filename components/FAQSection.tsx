// REASON: FAQ секция — цитируемые ответы на частые вопросы
// Каждый ответ 30-50 слов — оптимально для AI-цитирования

import JsonLd from "./JsonLd";

const FAQ_ITEMS = [
  {
    question: "Сколько стоит групповой тур?",
    answer:
      "Стоимость туров Delina Travel начинается от 730 000 тенге. В цену входят перелёты, проживание, завтраки, трансферы, экскурсии и сопровождение организатора. Точная стоимость зависит от направления и дат.",
  },
  {
    question: "Можно ли поехать одной, без подруг?",
    answer:
      "Да, большинство участниц приезжают одни и знакомятся в группе. Размер группы — до 12 девушек. За время поездки все становятся подругами. Организатор помогает с расселением и общением.",
  },
  {
    question: "Что включено в стоимость тура?",
    answer:
      "В стоимость включены: международные перелёты, проживание на виллах или в отелях 4 звезды, завтраки, все трансферы внутри страны, экскурсионная программа, медицинская страховка и сопровождение организатора на протяжении всей поездки.",
  },
  {
    question: "Как записаться на тур?",
    answer:
      "Оставьте заявку на сайте или напишите в WhatsApp по номеру +7 777 947 02 19. Организатор свяжется с вами, расскажет о ближайших датах и ответит на вопросы. Бронирование подтверждается предоплатой.",
  },
  {
    question: "Для кого подходят ваши туры?",
    answer:
      "Наши туры рассчитаны на девушек и молодых людей 20-35 лет из Казахстана. Есть форматы: Girls Trip (только для девушек), молодёжный тур (парни и девушки), девичник (для невесты с подругами) и индивидуальный тур.",
  },
  {
    question: "Нужна ли виза для поездки на Бали?",
    answer:
      "Для граждан Казахстана виза на Бали (Индонезия) оформляется по прибытию — бесплатно на срок до 30 дней. Для Малайзии виза также не требуется до 30 дней. Мы помогаем с подготовкой всех документов.",
  },
];

export default function FAQSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 md:py-28 px-6 md:px-10 bg-[#F0F7FA]">
      <JsonLd data={faqSchema} />
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-light text-[#134E6F] mb-12"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Частые вопросы
        </h2>
        <div className="space-y-6">
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-[#134E6F] font-medium hover:bg-[#134E6F]/5 transition-colors">
                <span>{item.question}</span>
                <span className="text-[#38BDF8] text-xl ml-4 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-[#64929E] leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
