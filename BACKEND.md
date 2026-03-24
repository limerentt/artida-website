# BACKEND.md — Бэкенд и CMS-архитектура АРТИДА v2

> Supabase (PostgreSQL) как бэкенд. Кастомная CMS-панель на React.
> Требование собственника: «нужна простая панель управления (CMS)» для самостоятельного обновления контента.
> Архитектура: см. ARCHITECTURE.md. Фронтенд: см. FRONTEND.md.

---

## 1. ПРИНЦИП: SUPABASE КАК BACKEND-AS-A-SERVICE

Supabase даёт:
- PostgreSQL с полной мощью SQL
- Table Editor (визуальный редактор) — собственник может редактировать данные через UI Supabase даже без нашей CMS
- Row Level Security (RLS) — безопасность на уровне БД
- Auth — аутентификация (email/password)
- Storage — файлы (PDF, фото)
- Realtime — не нужен для этого проекта
- Edge Functions — для серверной логики (формы, вебхуки)

Мы НЕ пишем свой бэкенд. Вся логика — в PostgreSQL (функции, триггеры, RLS) + Next.js API routes для специфичных вещей (revalidation, contact form).

---

## 2. СХЕМА БАЗЫ ДАННЫХ

### 2.1 products — Продукты

```sql
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,         -- URL: /catalog/magiya-3
  name        TEXT NOT NULL,                -- «МАГИЯ-3»
  series      TEXT,                         -- «Магия», «КЕ», «КТМ-УД»
  category    TEXT NOT NULL,                -- «Контроль доступа», «Охранная сигнализация»
  short_desc  TEXT NOT NULL,                -- Краткое для каталога
  description TEXT,                         -- Полное описание (markdown)

  -- Цены (РРЦ в 3 валютах, собственник: «Только рекомендованные розничные цены»)
  price_byn   DECIMAL(10,2),
  price_rub   DECIMAL(10,2),
  price_usd   DECIMAL(10,2),

  -- Технические характеристики
  sensor_type     TEXT,                     -- «ИК-сенсор», «Ёмкостный сенсор»
  body_material   TEXT,                     -- «Нержавеющая сталь», «Пластик»
  body_size       TEXT,                     -- «85×45×20 мм»
  protection      TEXT,                     -- «IP54»
  voltage         TEXT,                     -- «12В DC»
  interface       TEXT,                     -- «Wiegand-26/34», «1-Wire»
  output_type     TEXT,                     -- «Реле (NO/NC)»
  temperature     TEXT,                     -- «-40...+50°C»

  -- Медиа
  image_main      TEXT,                     -- URL основного фото (Supabase Storage)
  images          TEXT[],                   -- Массив URL доп. фото
  connection_scheme TEXT,                   -- URL схемы подключения
  video_url       TEXT,                     -- YouTube или Supabase Storage

  -- SEO
  seo_title       TEXT,
  seo_description TEXT,

  -- Мета
  sort_order      INTEGER DEFAULT 0,
  is_published    BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Индексы
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_published ON products(is_published) WHERE is_published = true;
```

### 2.2 product_documents — Документы продуктов

```sql
CREATE TABLE product_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,                -- «Технический паспорт»
  doc_type    TEXT NOT NULL,                -- «passport», «declaration», «manual», «certificate»
  file_url    TEXT NOT NULL,                -- Supabase Storage URL
  file_size   INTEGER,                      -- Размер в байтах
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_product_docs_product ON product_documents(product_id);
```

### 2.3 dealers — Дилеры (для раздела «Где купить»)

```sql
CREATE TABLE dealers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,                -- «ООО «Артида»»
  city        TEXT NOT NULL,                -- «Минск»
  country     TEXT NOT NULL DEFAULT 'BY',   -- ISO 3166-1 alpha-2
  address     TEXT,
  phone       TEXT,
  email       TEXT,
  website     TEXT,
  latitude    DECIMAL(9,6),                 -- Для карты
  longitude   DECIMAL(9,6),
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 2.4 news — Новости / блог

```sql
CREATE TABLE news (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,                          -- Краткое для списка
  content     TEXT NOT NULL,                 -- Полный текст (markdown)
  cover_image TEXT,                          -- URL обложки

  -- SEO
  seo_title       TEXT,
  seo_description TEXT,

  -- Мета
  is_published    BOOLEAN DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published ON news(is_published, published_at DESC) WHERE is_published = true;
```

### 2.5 documents — Общие документы (раздел «Документация»)

```sql
CREATE TABLE documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,                 -- «Декларация ТР ТС 020/2011 серия МАГИЯ»
  doc_type    TEXT NOT NULL,                 -- «certificate», «declaration», «passport», «letter»
  description TEXT,
  file_url    TEXT NOT NULL,
  file_size   INTEGER,
  sort_order  INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 2.6 page_content — Контент статических страниц (CMS-управляемый)

```sql
CREATE TABLE page_content (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key    TEXT UNIQUE NOT NULL,          -- 'home_hero', 'about_history', 'production_intro'
  title       TEXT,
  content     TEXT,                           -- Markdown
  metadata    JSONB DEFAULT '{}',            -- Доп. данные (цифры для метрик и т.д.)
  locale      TEXT NOT NULL DEFAULT 'ru',    -- 'ru', 'en'
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_page_content_key_locale ON page_content(page_key, locale);
```

### 2.7 contact_submissions — Заявки с формы обратной связи

```sql
CREATE TABLE contact_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  company     TEXT,
  message     TEXT NOT NULL,
  source_page TEXT,                           -- Откуда отправлена форма
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contact_unread ON contact_submissions(is_read) WHERE is_read = false;
```

---

## 3. ROW LEVEL SECURITY (RLS)

### Принцип: публичные данные — всем, запись — только авторизованным

```sql
-- Включить RLS на всех таблицах
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ЧТЕНИЕ: все публичные данные доступны анонимным пользователям
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read news"
  ON news FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read dealers"
  ON dealers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read documents"
  ON documents FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read page_content"
  ON page_content FOR SELECT
  USING (true);

CREATE POLICY "Public read product_documents"
  ON product_documents FOR SELECT
  USING (true);

-- ЗАПИСЬ: только авторизованные (authenticated) пользователи
CREATE POLICY "Admin write products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- (аналогично для всех таблиц)

-- CONTACT_SUBMISSIONS: любой может INSERT, только admin читает
CREATE POLICY "Anyone can submit contact"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin read submissions"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');
```

---

## 4. SUPABASE STORAGE

### Бакеты

| Бакет | Доступ | Содержимое |
|-------|--------|-----------|
| `products` | public read | Фото продукции, схемы подключения |
| `documents` | public read | PDF: паспорта, сертификаты, декларации |
| `news` | public read | Обложки новостей |
| `uploads` | authenticated | Временные загрузки из CMS |

### Правила Storage

```sql
-- Публичное чтение для products, documents, news
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('products', 'documents', 'news'));

-- Загрузка только авторизованным
CREATE POLICY "Admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### Структура файлов в Storage

```
products/
  magiya-3/
    main.webp
    angle-1.webp
    angle-2.webp
    scheme.svg
  magiya-2/
    main.webp
    ...

documents/
  passports/
    passport-ktm-ud.pdf
  declarations/
    declaration-magic.pdf
  certificates/
    belgiss-ktm-ud.pdf

news/
  2026-partnership/
    cover.webp
```

---

## 5. АУТЕНТИФИКАЦИЯ

### Supabase Auth — email/password

Только 2 пользователя: собственник + Лекс. Регистрация закрыта.

```typescript
// lib/supabase/server.ts
import { createServerClient as create } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  return create(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
```

### Middleware для /admin

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Проверить сессию
    // Если нет — редирект на /admin/login
  }
  // ... i18n routing
}
```

---

## 6. API ROUTES

### 6.1 /api/revalidate — ISR Webhook

Supabase Database Webhook → вызывает этот эндпоинт → Next.js пересобирает страницу.

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { table, record } = body

  // Маппинг таблица → путь для revalidation
  const pathMap: Record<string, string[]> = {
    products: ['/catalog', `/catalog/${record.slug}`],
    news: ['/news', `/news/${record.slug}`],
    dealers: ['/dealers'],
    documents: ['/docs'],
    page_content: ['/'],
  }

  const paths = pathMap[table] || ['/']
  for (const path of paths) {
    revalidatePath(`/ru${path}`)
    revalidatePath(`/en${path}`)
  }

  return NextResponse.json({ revalidated: true, paths })
}
```

### 6.2 /api/contact — Форма обратной связи

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  // 1. Rate limiting (через Vercel Edge или simple in-memory)
  // 2. Honeypot field check
  // 3. Валидация
  // 4. Сохранение в contact_submissions
  // 5. (Опционально) отправка email-уведомления собственнику

  const body = await request.json()
  const { name, email, phone, company, message, sourcePage, _honey } = body

  // Honeypot: если заполнено — это бот
  if (_honey) {
    return NextResponse.json({ success: true }) // тихо игнорируем
  }

  // Валидация
  if (!name || !message) {
    return NextResponse.json({ error: 'Name and message required' }, { status: 400 })
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name,
      email,
      phone,
      company,
      message,
      source_page: sourcePage,
    })

  if (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

---

## 7. CMS-ПАНЕЛЬ (/admin)

### Минимальная CMS для собственника

Это НЕ полноценная CMS типа WordPress. Это простой CRUD-интерфейс для:

| Раздел | Что редактирует |
|--------|----------------|
| Продукты | Название, описание, цены, фото, документы, ТТХ |
| Новости | Заголовок, текст (markdown), обложка |
| Дилеры | Название, город, контакты, координаты |
| Документы | Название, тип, файл |
| Заявки | Просмотр заявок с формы обратной связи (read-only) |

### UX для собственника

- Простой список → клик → форма редактирования.
- Кнопка «Опубликовать/Скрыть» (is_published).
- Drag-and-drop для сортировки (sort_order).
- Загрузка файлов прямо в форме (Supabase Storage).
- Превью: ссылка «Посмотреть на сайте» рядом с каждым элементом.
- Минимум полей — только то, что реально нужно.

### Стек CMS-панели

- Next.js (App Router, `/admin` route group)
- React (Client Components — форма = интерактив)
- Supabase Auth (защита)
- Supabase JS Client (CRUD)
- Tailwind CSS (стилизация, переиспользование дизайн-токенов)

---

## 8. SEED DATA

Начальные данные из SITE_CONTENT.md загружаются через `supabase/seed.sql`:

```sql
-- 7 продуктов
INSERT INTO products (slug, name, series, category, short_desc, price_byn, price_rub, price_usd, ...)
VALUES
  ('magiya-3', 'МАГИЯ-3', 'Магия', 'Контроль доступа', 'Бесконтактная кнопка выхода с ИК-сенсором', 22.00, 528.00, 9.02, ...),
  ('magiya-2', 'МАГИЯ-2', 'Магия', 'Контроль доступа', ...),
  -- ...все 7 продуктов

-- 3 дилера
INSERT INTO dealers (name, city, country, phone, email, website)
VALUES
  ('ООО «Артида»', 'Минск', 'BY', '+375 (29) 305-62-41', 'info@artida.by', 'artida.by'),
  ('ООО «СпецКомИнтегРо»', 'Москва', 'RU', '+7 (495) 181-92-58', 'info@spec-com.ru', 'spec-com.ru'),
  ('ТД ТИНКО', 'Москва', 'RU', '+7 (495) 363-57-13', 'info@tinko.net', 'tinko.net');

-- Документы
INSERT INTO documents (title, doc_type, file_url)
VALUES
  ('Руководство по эксплуатации серия «Магия»', 'manual', '...'),
  ('Паспорт КТМ-УД', 'passport', '...'),
  -- ...все документы из SITE_CONTENT.md
```

---

## 9. DATABASE TRIGGERS

### updated_at автоматически

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Аналогично для news, page_content
```

### Webhook на изменения (для ISR revalidation)

```sql
-- Supabase Database Webhook (настраивается через Dashboard):
-- Таблица: products, news, dealers, documents, page_content
-- Событие: INSERT, UPDATE, DELETE
-- URL: https://artida.by/api/revalidate
-- Header: x-revalidate-secret: <SECRET>
```

---

## 10. МИГРАЦИИ

### Структура

```
supabase/
├── migrations/
│   ├── 20260324000001_create_products.sql
│   ├── 20260324000002_create_product_documents.sql
│   ├── 20260324000003_create_dealers.sql
│   ├── 20260324000004_create_news.sql
│   ├── 20260324000005_create_documents.sql
│   ├── 20260324000006_create_page_content.sql
│   ├── 20260324000007_create_contact_submissions.sql
│   ├── 20260324000008_setup_rls.sql
│   ├── 20260324000009_setup_storage.sql
│   └── 20260324000010_setup_triggers.sql
└── seed.sql
```

### Правила миграций

- Каждая миграция — отдельный файл, одна ответственность.
- Именование: `YYYYMMDD<seq>_<description>.sql`.
- Миграции идемпотентны (IF NOT EXISTS).
- Никогда не редактировать уже применённую миграцию — только новая.
- Seed data — отдельно от схемы.

---

## 11. ГЕНЕРАЦИЯ ТИПОВ

```bash
# Генерация TypeScript-типов из схемы Supabase
npx supabase gen types typescript --project-id <PROJECT_ID> > src/lib/types/database.ts
```

Типы генерируются автоматически и отражают схему БД. Используются во всех queries/ и компонентах.

```typescript
// lib/types/index.ts
import type { Database } from './database'

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type News = Database['public']['Tables']['news']['Row']
export type Dealer = Database['public']['Tables']['dealers']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
```

---

## 12. ENVIRONMENT VARIABLES

```env
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
REVALIDATE_SECRET=<random-secret>

# Vercel Environment Variables (production)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<prod-service-role-key>
REVALIDATE_SECRET=<prod-random-secret>
```

**Правило:** SUPABASE_SERVICE_ROLE_KEY НИКОГДА не попадает в клиентский код. Используется только в API routes и server-side.
