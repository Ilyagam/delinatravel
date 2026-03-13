import { AnalyticsStats } from "@/lib/analytics";

interface Props {
  stats: AnalyticsStats | null;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        accent ? "bg-[#134E6F] text-[#F0F7FA]" : "bg-white"
      }`}
    >
      <div
        className={`text-3xl font-light mb-1 ${
          accent ? "text-[#F0F7FA]" : "text-[#134E6F]"
        }`}
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        {value}
      </div>
      <div
        className={`text-sm ${accent ? "text-[#F0F7FA]/70" : "text-[#64929E]"}`}
      >
        {label}
      </div>
      {sub && (
        <div
          className={`text-xs mt-1 ${
            accent ? "text-[#38BDF8]" : "text-[#38BDF8]"
          }`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function BarChart({
  data,
}: {
  data: { date: string; views: number; unique: number }[];
}) {
  const maxViews = Math.max(...data.map((d) => d.views), 1);

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-sm font-medium text-[#134E6F] mb-4">
        Посетители — последние 14 дней
      </h3>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((d) => {
          const height = Math.max((d.views / maxViews) * 100, d.views > 0 ? 4 : 0);
          const uHeight = Math.max((d.unique / maxViews) * 100, d.unique > 0 ? 4 : 0);
          const label = new Date(d.date + "T00:00:00").toLocaleDateString(
            "ru-RU",
            { day: "numeric", month: "numeric" }
          );
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center gap-0.5 group"
              title={`${label}: ${d.views} просм., ${d.unique} уник.`}
            >
              <div className="w-full flex items-end gap-0.5 h-24">
                <div
                  className="flex-1 bg-[#134E6F]/20 rounded-t transition-all group-hover:bg-[#134E6F]/30"
                  style={{ height: `${height}%` }}
                />
                <div
                  className="flex-1 bg-[#38BDF8] rounded-t transition-all group-hover:bg-[#1A97B5]"
                  style={{ height: `${uHeight}%` }}
                />
              </div>
              <span className="text-[9px] text-[#64929E] rotate-0 leading-none">
                {label.split(".")[0]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-xs text-[#64929E]">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#134E6F]/20" />
          Просмотры
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#64929E]">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
          Уникальные
        </div>
      </div>
    </div>
  );
}

function TopList({
  title,
  items,
  labelKey,
  formatLabel,
}: {
  title: string;
  items: { views: number }[];
  labelKey: string;
  formatLabel?: (val: string) => string;
}) {
  const maxViews = Math.max(...items.map((i) => i.views), 1);

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-sm font-medium text-[#134E6F] mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-[#64929E] text-sm">Нет данных</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => {
            const label = (item as unknown as Record<string, string>)[labelKey];
            const displayLabel = formatLabel ? formatLabel(label) : label;
            const pct = Math.round((item.views / maxViews) * 100);
            return (
              <li key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span
                    className="text-[#134E6F] truncate max-w-[200px]"
                    title={label}
                  >
                    {displayLabel}
                  </span>
                  <span className="text-[#64929E] ml-2 flex-shrink-0">
                    {item.views}
                  </span>
                </div>
                <div className="h-1 bg-[#F0F7FA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#134E6F]/30 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DevicePie({
  breakdown,
}: {
  breakdown: { device: string; views: number }[];
}) {
  const total = breakdown.reduce((s, d) => s + d.views, 0) || 1;
  const DEVICE_LABELS: Record<string, string> = {
    mobile: "Мобильные",
    tablet: "Планшеты",
    desktop: "Десктоп",
    unknown: "Другие",
  };
  const COLORS: Record<string, string> = {
    mobile: "#38BDF8",
    tablet: "#64929E",
    desktop: "#134E6F",
    unknown: "#B8D8E8",
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-sm font-medium text-[#134E6F] mb-4">Устройства</h3>
      <div className="space-y-3">
        {breakdown.map((d) => {
          const pct = Math.round((d.views / total) * 100);
          return (
            <div key={d.device}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#134E6F]">
                  {DEVICE_LABELS[d.device] ?? d.device}
                </span>
                <span className="text-[#64929E]">{pct}%</span>
              </div>
              <div className="h-2 bg-[#F0F7FA] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: COLORS[d.device] ?? "#64929E",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard({ stats }: Props) {
  if (!stats) {
    return (
      <section className="mb-12 bg-white rounded-2xl p-8 text-center">
        <p className="text-[#64929E] text-sm mb-2">
          Аналитика недоступна
        </p>
        <p className="text-[#64929E] text-xs">
          Подключите Supabase и запустите миграцию таблицы{" "}
          <code className="bg-[#F0F7FA] px-1 rounded">page_views</code>
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-medium text-[#134E6F] mb-6">Аналитика</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard
          label="Сегодня"
          value={stats.viewsToday}
          sub="просмотров"
        />
        <StatCard
          label="За 7 дней"
          value={stats.views7d}
          sub={`${stats.uniqueVisitors7d} уникальных`}
        />
        <StatCard
          label="За 30 дней"
          value={stats.views30d}
          sub={`${stats.uniqueVisitors30d} уникальных`}
        />
        <StatCard
          label="Конверсия"
          value={`${stats.conversionRate}%`}
          sub={`${stats.applications30d} заявок за 30 дн.`}
          accent
        />
      </div>

      {/* Chart */}
      <div className="mb-4">
        <BarChart data={stats.dailyChart} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopList
          title="Топ страниц (30 дней)"
          items={stats.topPages}
          labelKey="page"
          formatLabel={(p) => (p === "/" ? "Главная" : p)}
        />
        <TopList
          title="Источники трафика"
          items={stats.topReferrers}
          labelKey="referrer"
        />
        <DevicePie breakdown={stats.deviceBreakdown} />
      </div>
    </section>
  );
}
