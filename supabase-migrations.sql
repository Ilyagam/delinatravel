-- =========================================
-- Delina Travel — Supabase миграции
-- Запустить в Supabase Dashboard → SQL Editor
-- =========================================

-- 1. Туры
create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  destination text not null,
  dates text not null,
  short_description text,
  description text,
  price_from integer,
  what_included text[],
  what_excluded text[],
  program jsonb,
  accommodation text,
  image_urls text[],
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. Заявки
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  tour_id uuid references tours(id) on delete set null,
  tour_title text,
  message text,
  created_at timestamptz default now()
);

-- 3. Аналитика (просмотры страниц)
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  referrer text,
  ip_hash text,
  device text,
  created_at timestamptz default now()
);

-- Индекс для быстрых выборок по дате
create index if not exists page_views_created_at_idx on page_views(created_at);

-- 4. RLS политики — разрешить анонимную вставку (для трекинга и заявок)
alter table page_views enable row level security;
alter table applications enable row level security;
alter table tours enable row level security;

-- page_views: INSERT открыт для всех (анонимный трекинг)
create policy "allow_insert_page_views"
  on page_views for insert
  to anon, authenticated
  with check (true);

-- applications: INSERT открыт (форма заявки)
create policy "allow_insert_applications"
  on applications for insert
  to anon, authenticated
  with check (true);

-- tours: SELECT открыт (показывать туры на сайте)
create policy "allow_select_active_tours"
  on tours for select
  to anon, authenticated
  using (is_active = true);

-- 5. Сессии Telegram-бота (состояние пошаговых диалогов)
create table if not exists bot_sessions (
  chat_id bigint primary key,
  action text,
  step text,
  data jsonb default '{}',
  updated_at timestamptz default now()
);

-- ПРИМЕЧАНИЕ: SELECT/INSERT/UPDATE/DELETE для page_views, applications, tours, bot_sessions
-- в admin-панели и боте идёт через service_role ключ (SUPABASE_SERVICE_ROLE_KEY),
-- который обходит RLS — дополнительных политик для admin не нужно.
