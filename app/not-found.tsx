import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#134E6F] flex items-center justify-center px-6">
      <div className="text-center">
        <div
          className="text-[180px] font-light text-[#F0F7FA]/10 leading-none mb-0"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          404
        </div>
        <h1
          className="text-4xl md:text-5xl font-light text-[#F0F7FA] -mt-8 mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Страница не найдена
        </h1>
        <p className="text-[#F0F7FA]/50 mb-10 max-w-sm mx-auto">
          Возможно, тур уже завершён или ссылка устарела.
        </p>
        <Link
          href="/"
          className="bg-[#F0F7FA] text-[#134E6F] px-8 py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
