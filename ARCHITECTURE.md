# ARCHITECTURE.md — Системная архитектура АРТИДА v2

> Все решения основаны на OWNER_VISION.md. Каждый выбор аргументирован требованием собственника.

---

## 1. СТЕК ТЕХНОЛОГИЙ

### Обоснование выбора

| Требование собственника | Решение | Почему |
|------------------------|---------|--------|
| «Высокая скорость загрузки» | Next.js (App Router) + SSG/ISR | Статическая генерация = мгновенная загрузка, CDN-кэш |
| «Хорошая мобильная версия» | Tailwind CSS + mobile-first | Утилитарный CSS, нет лишнего кода, адаптивность из коробки |
| «Хорошая SEO» | Next.js SSR/SSG + structured data | Полный HTML на сервере, метатеги, JSON-LD, sitemap |
| «Простая CMS для обновления» | Supabase (PostgreSQL + Admin UI) | Кастомная панель, собственник сам редактирует продукты/новости |
| «Русский + английский» | next-intl + [locale] routing | Встроенная i18n, SEO-friendly URL-ы (/ru/, /en/) |
| Контрактное производство = главный продукт | Лендинговая архитектура | Секции-блоки с CTA, не простые текстовые страницы |

### Финальный стек

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│  Next.js 15 (App Router) + TypeScript            │
│  Tailwind CSS 4 + IBM Plex Sans                  │
│  next-intl (i18n)                                │
│  Framer Motion (минимальные анимации)            │
│  next/image (оптимизация изображений)            │
└─────────────────────┬───────────────────────────┘
                      │ fetch / Server Components
┌─────────────────────▼───────────────────────────┐
│                    BACKEND                        │
│  Supabase (PostgreSQL + Auth + Storage)           │
│  Row Level Security                               │
│  Edge Functions (для форм обратной связи)         │
│  Supabase Storage (PDF, фото продукции)           │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                  DEPLOY / INFRA                   │
│  Vercel (хостинг + CDN + preview deployments)     │
│  GitHub (репозиторий + CI/CD)                     │
│  Vercel Analytics + GA + Яндекс.Метрика           │
└─────────────────────────────────────────────────┘
```

### Почему именно этот стек

**Next.js 15 (App Router)** — единственный фреймворк, который одновременно даёт:
- SSG (Static Site Generation) для каталога → страницы генерируются при билде, летают
- ISR (Incremental Static Regeneration) для новостей → обновляются без ребилда
- Server Components → нет лишнего JS на клиенте, быстрее загрузка
- Встроенная оптимизация изображений (next/image) → WebP, lazy loading, responsive
- App Router с layouts → общий header/footer без дублирования

**Supabase** — PostgreSQL-as-a-service с UI:
- Собственник получает визуальный редактор таблиц (Table Editor)
- Мы строим поверх него простую CMS-панель (React + Supabase Auth)
- Бесплатный тариф покрывает нужды АРТИДА (500MB БД, 1GB storage)
- Row Level Security → безопасность без дополнительного кода
- Storage для PDF-документации и фото

**Vercel** — хостинг Next.js от его создателей:
- Edge CDN → быстрая загрузка в Беларуси, России, Казахстане
- Preview deployments → каждый PR получает ссылку для проверки
- Бесплатный тариф + свой домен
- Интеграция с GitHub → push = деплой

**Tailwind CSS 4** — утилитарный CSS:
- Нет лишнего CSS в бандле (tree-shaking)
- Mobile-first из коробки
- Кастомизация цветов/шрифтов через конфиг
- Быстрая разработка без написания отдельных CSS-файлов

---

## 2. АРХИТЕКТУРА ПРИЛОЖЕНИЯ

### Монорепо-структура

```
artida-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # i18n: /ru, /en
│   │   │   ├── layout.tsx      # Корневой layout (header + footer)
│   │   │   ├── page.tsx        # Главная страница
│   │   │   ├── production/     # Контрактное производство
│   │   │   ├── catalog/        # Каталог продукции
│   │   │   │   └── [slug]/     # Страница продукта (динамическая)
│   │   │   ├── about/          # О компании
│   │   │   ├── partners/       # Партнёрам / дилерам
│   │   │   ├── dealers/        # Где купить
│   │   │   ├── docs/           # Документация и сертификаты
│   │   │   ├── news/           # Новости / блог
│   │   │   │   └── [slug]/     # Страница новости
│   │   │   └── contacts/       # Контакты
│   │   ├── admin/              # CMS-панель (защищена Supabase Auth)
│   │   │   ├── layout.tsx
│   │   │   ├── products/       # CRUD продуктов
│   │   │   ├── news/           # CRUD новостей
│   │   │   ├── dealers/        # CRUD дилеров
│   │   │   └── docs/           # Управление документами
│   │   └── api/                # API Routes
│   │       ├── revalidate/     # ISR revalidation webhook
│   │       └── contact/        # Форма обратной связи
│   ├── components/
│   │   ├── ui/                 # Базовые UI-компоненты (Button, Card, Input...)
│   │   ├── layout/             # Header, Footer, Navigation, MobileMenu
│   │   ├── sections/           # Секции страниц (Hero, CTA, Features...)
│   │   ├── product/            # Компоненты каталога (ProductCard, SpecsTable...)
│   │   └── admin/              # Компоненты CMS-панели
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Supabase клиент (browser)
│   │   │   ├── server.ts       # Supabase клиент (server)
│   │   │   └── admin.ts        # Supabase клиент (service role)
│   │   ├── types/
│   │   │   └── database.ts     # Авто-сгенерированные типы из Supabase
│   │   ├── utils/
│   │   │   ├── formatting.ts   # Форматирование цен, дат
│   │   │   └── seo.ts          # Генерация метатегов
│   │   └── constants.ts        # Контакты, соцсети, настройки
│   ├── messages/               # i18n переводы
│   │   ├── ru.json
│   │   └── en.json
│   └── styles/
│       └── globals.css         # Tailwind директивы + кастомные стили
├── public/
│   ├── fonts/                  # IBM Plex Sans (self-hosted)
│   ├── images/                 # Статичные изображения (лого, иконки)
│   └── docs/                   # PDF-документация (fallback, основное в Supabase Storage)
├── supabase/
│   ├── migrations/             # SQL-миграции схемы БД
│   └── seed.sql                # Начальные данные (продукты, дилеры из SITE_CONTENT.md)
├── tailwind.config.ts          # Настройка дизайн-системы
├── next.config.ts              # Next.js конфиг
├── i18n.config.ts              # Настройка next-intl
└── package.json
```

### Принцип Server Components First

```
Компонент получает данные?
  ├── ДА → Server Component (по умолчанию)
  │         → fetch() прямо в компоненте
  │         → Нет JS на клиенте
  │         → Быстрее загрузка
  └── НЕТ, но нужна интерактивность? (клик, hover, форма)
      └── Client Component ('use client')
          → Минимум: только то, что действительно интерактивно
```

**Правило:** если компонент может быть Server Component — он ДОЛЖЕН быть Server Component. Это напрямую влияет на скорость (требование собственника #1).

---

## 3. СТРАТЕГИЯ РЕНДЕРИНГА

| Страница | Стратегия | Причина | Revalidation |
|----------|-----------|---------|--------------|
| Главная | SSG | Редко меняется, максимальная скорость | ISR: 1 час |
| Контрактное производство | SSG | Статический контент | ISR: 24 часа |
| Каталог (список) | SSG | 7 продуктов, меняются редко | ISR: 1 час |
| Страница продукта | SSG + generateStaticParams | Предгенерация всех 7 страниц | ISR: 1 час |
| О компании | SSG | Статический контент | ISR: 24 часа |
| Партнёрам | SSG | Статический контент | ISR: 24 часа |
| Где купить | SSG | 3 дилера, редко меняется | ISR: 1 час |
| Документация | SSG | Список документов из Supabase | ISR: 1 час |
| Новости (список) | ISR | Добавляются новые | ISR: 30 мин |
| Новость (страница) | ISR + generateStaticParams | Динамический контент | ISR: 1 час |
| Контакты | SSG | Статический контент | ISR: 24 часа |
| CMS-панель (/admin) | CSR | Интерактивное приложение | Без кэша |

**ISR (Incremental Static Regeneration)** = страницы статические, но обновляются в фоне при запросе через N секунд. Собственник добавил новый продукт в CMS → через час он появится на сайте без ребилда.

**Webhook revalidation** = для мгновенных обновлений: Supabase trigger → вызов /api/revalidate → страница пересобирается немедленно.

---

## 4. PERFORMANCE BUDGET

Собственник: «высокая скорость загрузки» — это приоритет #1.

### Целевые метрики (Core Web Vitals)

| Метрика | Цель | Как достигаем |
|---------|------|---------------|
| LCP (Largest Contentful Paint) | < 1.5s | SSG + CDN + оптимизированные изображения |
| FID (First Input Delay) | < 50ms | Минимум клиентского JS, Server Components |
| CLS (Cumulative Layout Shift) | < 0.05 | Зарезервированные размеры для изображений, шрифт self-hosted |
| TTFB (Time to First Byte) | < 200ms | Vercel Edge CDN |
| Total Bundle Size (JS) | < 100KB gzipped | Tree-shaking, Server Components |
| Lighthouse Score | ≥ 95 | По всем категориям |

### Правила оптимизации

1. **Изображения:** только WebP/AVIF через next/image. Максимум 200KB на фото продукта.
2. **Шрифты:** IBM Plex Sans self-hosted, preload, font-display: swap.
3. **CSS:** Tailwind с purge → только используемые классы.
4. **JS:** Server Components по умолчанию. Client Components — только для интерактива.
5. **Canvas-анимация из v1:** НЕ ИСПОЛЬЗУЕМ. 242 фрейма × 80KB = 19MB. Прямое противоречие требованию скорости.
6. **PDF-документы:** lazy loading, скачивание по клику (не встраивание в страницу).
7. **Карта (Где купить):** lazy load, загружается только при скролле до секции.

---

## 5. SEO-АРХИТЕКТУРА

Собственник: «хорошая поисковая оптимизация» + «сайт почти не приводит клиентов» (текущий).

### URL-структура

```
artida.by/                              → Главная
artida.by/production/                   → Контрактное производство
artida.by/catalog/                      → Каталог продукции
artida.by/catalog/magiya-3/             → Страница продукта
artida.by/about/                        → О компании
artida.by/partners/                     → Партнёрам / дилерам
artida.by/dealers/                      → Где купить
artida.by/docs/                         → Документация
artida.by/news/                         → Новости
artida.by/news/2026-partnership/        → Страница новости
artida.by/contacts/                     → Контакты

# Английская версия (в будущем)
artida.by/en/                           → Home
artida.by/en/production/                → Contract Manufacturing
artida.by/en/catalog/magiya-3/          → Product Page
```

### SEO-стратегия по страницам

| Страница | Семантическое ядро (RU) | Title шаблон |
|----------|------------------------|-------------|
| Главная | артида, производство электроники минск, контрактное производство | АРТИДА — Производство электроники и контрактный монтаж печатных плат |
| Контрактное пр-во | контрактный монтаж печатных плат, smd монтаж заказ, пайка плат минск | Контрактное производство электроники — SMD/DIP монтаж \| АРТИДА |
| Каталог | бесконтактные кнопки скуд, считыватели ключей, кнопка выхода | Каталог продукции АРТИДА — СКУД, считыватели, кнопки выхода |
| Продукт | магия-3 кнопка бесконтактная, кнопка выхода ик сенсор | МАГИЯ-3 — Бесконтактная кнопка выхода с ИК-сенсором \| АРТИДА |
| О компании | артида минск, производитель электроники беларусь | О компании АРТИДА — Производитель электроники с 2015 года |

### Технические SEO-решения

- **JSON-LD** на каждой странице (Organization, Product, BreadcrumbList)
- **Sitemap.xml** — автогенерация из маршрутов Next.js
- **robots.txt** — индексация всех публичных страниц, блок /admin/
- **Open Graph + Twitter Cards** — превью при шаринге
- **Canonical URLs** — предотвращение дублей
- **Hreflang** — для RU/EN версий (когда будет EN)
- **Structured Data: Product** — цены, наличие, характеристики в выдаче Google

---

## 6. БЕЗОПАСНОСТЬ

| Уровень | Решение |
|---------|---------|
| Аутентификация CMS | Supabase Auth (email + password). Только собственник и Лекс. |
| Авторизация | RLS (Row Level Security): публичные данные читают все, пишут только authenticated |
| API | Все мутации через Supabase RLS, не через открытые API routes |
| Форма обратной связи | Rate limiting (Vercel Edge Middleware) + honeypot field |
| CORS | Только artida.by и localhost (dev) |
| Заголовки | CSP, X-Frame-Options, X-Content-Type-Options через next.config.ts |
| Секреты | .env.local (dev), Vercel Environment Variables (prod) |

---

## 7. МОНИТОРИНГ И АНАЛИТИКА

| Инструмент | Назначение | Интеграция |
|-----------|-----------|------------|
| Google Analytics 4 | Трафик, конверсии, поведение | next/script с strategy="afterInteractive" |
| Яндекс.Метрика | Трафик из РФ/BY, вебвизор, карта кликов | next/script с strategy="afterInteractive" |
| Vercel Analytics | Core Web Vitals, скорость | Встроенный @vercel/analytics |
| Vercel Speed Insights | Real User Metrics | Встроенный @vercel/speed-insights |

### Цели конверсии (настроить в GA/Метрике)

1. **Клик по телефону** — основная конверсия (собственник: «позвонить»)
2. **Клик по email** — вторая конверсия (собственник: «написать на почту»)
3. **Отправка формы обратной связи** — дополнительная
4. **Клик по мессенджеру** (WhatsApp/Telegram/Viber)
5. **Скачивание PDF** (даташиты, сертификаты)
6. **Посещение страницы «Контрактное производство»** — ключевой раздел

---

## 8. ДЕПЛОЙ И CI/CD

### Пайплайн

```
git push → GitHub Actions → Vercel Build → Preview/Production
    │                │
    │                ├── ESLint + TypeScript check
    │                ├── Build Next.js
    │                └── Lighthouse CI (score ≥ 95)
    │
    ├── push to main → Production deploy (artida.by)
    └── push to PR branch → Preview deploy (unique URL)
```

### Environments

| Среда | URL | Supabase | Назначение |
|-------|-----|----------|-----------|
| Development | localhost:3000 | Supabase local (docker) | Разработка |
| Preview | *.vercel.app | Supabase staging | Ревью PR |
| Production | artida.by | Supabase production | Продакшн |

### Домен

Текущий домен artida.by → подключить к Vercel через DNS. GitHub Pages → отключить после переключения.
