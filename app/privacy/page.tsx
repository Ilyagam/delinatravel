import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  robots: "noindex",
};

// REASON: Заглушка — Деля должна заполнить ИИН, наименование ИП, адрес
// Плейсхолдеры помечены [ЗАПОЛНИТЬ]

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1
            className="text-4xl font-light text-[#134E6F] mb-8"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Политика конфиденциальности
          </h1>

          <p className="text-[#64929E] text-sm mb-8">
            Дата последнего обновления: апрель 2026 г.
          </p>

          <div className="space-y-6 text-[#134E6F]/80 leading-relaxed">
            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">1. Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности определяет порядок обработки
                и защиты персональных данных пользователей сайта delinatravel.kz,
                принадлежащего <strong>[ЗАПОЛНИТЬ: ИП Фамилия Имя Отчество, ИИН]</strong>,
                зарегистрированного по адресу: <strong>[ЗАПОЛНИТЬ: адрес]</strong> (далее — Оператор).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">2. Какие данные мы собираем</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Имя</li>
                <li>Номер телефона / WhatsApp</li>
                <li>Выбранный тур (при заполнении формы)</li>
                <li>Сообщение (при заполнении формы)</li>
                <li>Техническая информация: IP-адрес (в анонимизированном виде), тип устройства, страницы посещения</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">3. Цели обработки</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Связь с пользователем по оставленной заявке</li>
                <li>Информирование о турах и акциях</li>
                <li>Улучшение работы сайта (аналитика посещаемости)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">4. Хранение и защита данных</h2>
              <p>
                Персональные данные хранятся на защищённых серверах (Supabase, AWS).
                Передача данных осуществляется по защищённому протоколу HTTPS.
                Доступ к данным имеет только Оператор.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">5. Права пользователя</h2>
              <p>
                В соответствии с Законом Республики Казахстан «О персональных данных
                и их защите» от 21.05.2013 №94-V, вы имеете право:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Получить информацию об обработке ваших данных</li>
                <li>Потребовать изменения или удаления данных</li>
                <li>Отозвать согласие на обработку</li>
              </ul>
              <p className="mt-2">
                Для этого свяжитесь с нами: WhatsApp{" "}
                <a href="https://wa.me/77779470219" className="text-[#1A97B5] underline">
                  +7 777 947 02 19
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#134E6F] mb-3">6. Согласие</h2>
              <p>
                Отправляя заявку через форму на сайте, вы подтверждаете согласие
                на обработку персональных данных в соответствии с настоящей Политикой.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
