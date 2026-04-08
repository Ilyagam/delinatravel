import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Публичная оферта",
  robots: "noindex",
};

// REASON: Заглушка публичной оферты — Деля должна заполнить реквизиты
// Плейсхолдеры помечены [ЗАПОЛНИТЬ]

export default function OfertaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1
            className="text-4xl font-light text-[#134E6F] mb-8"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Публичная оферта
          </h1>

          <p className="text-[#64929E] text-sm mb-8">
            Дата последнего обновления: апрель 2026 г.
          </p>

          <div className="space-y-6 text-[#134E6F]/80 leading-relaxed">
            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">1. Общие положения</h2>
              <p>
                Настоящий документ является публичной офертой{" "}
                <strong>ИП Delina Travel, БИН 791128450113</strong>,
                зарегистрированного по адресу: <strong>г. Астана, ул. Асфендиярова, дом 5</strong>,
                на оказание туристских услуг.
              </p>
              <p>
                Номер в реестре турагентов: <strong>Z1201355</strong>.
                Полис страхования гражданско-правовой ответственности:{" "}
                <strong>[ЗАПОЛНИТЬ: номер полиса, страховая компания]</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">2. Предмет оферты</h2>
              <p>
                Исполнитель обязуется организовать и провести групповой туристский тур
                в соответствии с описанием на сайте delinatravel.kz, а Заказчик обязуется
                оплатить услуги в порядке, установленном настоящей офертой.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">3. Стоимость и порядок оплаты</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Стоимость тура указана на странице каждого тура в тенге (KZT)</li>
                <li>Бронирование подтверждается предоплатой в размере <strong>[ЗАПОЛНИТЬ: %]</strong></li>
                <li>Оставшаяся сумма вносится не позднее чем за <strong>[ЗАПОЛНИТЬ]</strong> дней до начала тура</li>
                <li>Способы оплаты: банковский перевод, Kaspi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">4. Условия отмены и возврата</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Отмена за 30+ дней до начала — возврат 100% предоплаты</li>
                <li>Отмена за 15-30 дней — возврат 50% предоплаты</li>
                <li>Отмена менее чем за 15 дней — предоплата не возвращается</li>
                <li>При отмене тура Исполнителем — полный возврат всех внесённых средств</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">5. Что включено в стоимость</h2>
              <p>
                Состав услуг указан на странице каждого тура в разделе «Включено».
                Услуги, не указанные в разделе «Включено», оплачиваются Заказчиком
                самостоятельно.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">6. Права и обязанности сторон</h2>
              <p>
                Исполнитель обязуется: организовать тур в соответствии с описанием,
                обеспечить сопровождение организатора, предоставить информацию
                о подготовке к поездке.
              </p>
              <p>
                Заказчик обязуется: своевременно оплатить услуги, предоставить
                необходимые документы (паспорт, виза), соблюдать правила поведения
                в группе.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">7. Ответственность</h2>
              <p>
                Исполнитель не несёт ответственности за задержки рейсов,
                действия третьих лиц (отели, авиакомпании), форс-мажорные
                обстоятельства. Медицинская страховка включена в стоимость тура.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">8. Защита прав потребителей</h2>
              <p>
                Споры разрешаются путём переговоров. При невозможности
                урегулирования — в соответствии с законодательством Республики Казахстан.
                Уполномоченный орган: Комитет по защите прав потребителей
                Министерства торговли и интеграции РК.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">9. Контакты</h2>
              <p>
                Телефон:{" "}
                <a href="https://wa.me/77779470219" className="text-[#1A97B5] underline">
                  +7 777 947 02 19
                </a>
                <br />
                Telegram:{" "}
                <a href="https://t.me/dlnvltr" className="text-[#1A97B5] underline">
                  @dlnvltr
                </a>
                <br />
                Instagram:{" "}
                <a href="https://instagram.com/delina_travel" className="text-[#1A97B5] underline">
                  @delina_travel
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
