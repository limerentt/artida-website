# FRONTEND.md — Фронтенд-конвенции АРТИДА v2

> Как мы пишем фронтенд. Конвенции именования, структура компонентов, роутинг, i18n, работа с данными.
> Стек: Next.js 15 (App Router) + TypeScript + Tailwind CSS 4.
> Дизайн-система: см. DESIGN.md. Архитектура: см. ARCHITECTURE.md.

---

## 1. СТРУКТУРА ФАЙЛОВ

### Правило: feature-first, не type-first

```
src/
├── app/                          # Next.js App Router — ТОЛЬКО роуты и layouts
│   ├── [locale]/                 # i18n сегмент
│   │   ├── layout.tsx            # Root layout (Header + Footer + провайдеры)
│   │   ├── page.tsx              # Главная
│   │   ├── production/page.tsx   # Контрактное производство
│   │   ├── catalog/
│   │   │   ├── page.tsx          # Каталог (список)
│   │   │   └── [slug]/page.tsx   # Страница продукта
│   │   ├── about/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── dealers/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── news/
│   │   │   ├── page.tsx          # Список новостей
│   │   │   └── [slug]/page.tsx   # Страница новости
│   │   └── contacts/page.tsx
│   ├── admin/                    # CMS-панель (без [locale], только RU)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── products/
│   │   ├── news/
│   │   ├── dealers/
│   │   └── docs/
│   └── api/
│       ├── revalidate/route.ts   # ISR webhook
│       └── contact/route.ts      # Форма обратной связи
├── components/
│   ├── ui/                       # Атомарные UI-компоненты
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Table.tsx
│   │   ├── Accordion.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts              # barrel export
│   ├── layout/                   # Layout-компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Section.tsx           # Обёртка для секций (padding, чередование фонов)
│   │   └── Container.tsx         # max-width 1200px обёртка
│   ├── sections/                 # Композитные секции страниц
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Stats.tsx             # Цифры-метрики
│   │   ├── CTABlock.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ContactInfo.tsx
│   │   └── CertificatesBar.tsx
│   ├── product/                  # Компоненты каталога
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── SpecsTable.tsx
│   │   ├── DocumentsList.tsx
│   │   └── ConnectionScheme.tsx
│   └── admin/                    # Компоненты CMS
│       ├── AdminLayout.tsx
│       ├── ProductForm.tsx
│       ├── NewsForm.tsx
│       ├── ImageUpload.tsx
│       └── DataTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # createBrowserClient
│   │   ├── server.ts             # createServerClient
│   │   └── admin.ts              # createClient с service_role
│   ├── types/
│   │   ├── database.ts           # Авто-сгенерированные Supabase типы
│   │   └── index.ts              # Общие TypeScript типы
│   ├── utils/
│   │   ├── formatting.ts         # formatPrice, formatDate, etc.
│   │   ├── seo.ts                # generateMetadata хелперы
│   │   └── cn.ts                 # clsx + twMerge обёртка
│   ├── queries/                  # Supabase-запросы (data access layer)
│   │   ├── products.ts           # getProducts, getProductBySlug
│   │   ├── news.ts               # getNews, getNewsBySlug
│   │   ├── dealers.ts            # getDealers
│   │   └── documents.ts          # getDocuments
│   └── constants.ts              # Контакты, мессенджеры, мета
├── messages/                     # i18n переводы
│   ├── ru.json
│   └── en.json
└── styles/
    └── globals.css               # @tailwind directives + custom CSS
```

---

## 2. КОНВЕНЦИИ ИМЕНОВАНИЯ

### Файлы и папки

| Тип | Формат | Пример |
|-----|--------|--------|
| Компоненты | PascalCase.tsx | `ProductCard.tsx` |
| Утилиты | camelCase.ts | `formatting.ts` |
| Типы | camelCase.ts | `database.ts` |
| Роуты (app/) | kebab-case папки | `catalog/[slug]/page.tsx` |
| Стили | kebab-case.css | `globals.css` |
| Константы | camelCase.ts | `constants.ts` |
| Переводы | lowercase.json | `ru.json` |

### Компоненты

```typescript
// Именование: PascalCase, описательное
// ✅ ProductCard, CTABlock, SpecsTable
// ❌ Card1, Block, Table

// Именование пропсов: ComponentNameProps
interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}
```

### Переменные и функции

```typescript
// camelCase для переменных и функций
const productList = await getProducts()
const formattedPrice = formatPrice(product.price_byn)

// SCREAMING_SNAKE_CASE для true-констант
const MAX_PRODUCTS_PER_PAGE = 12
const REVALIDATION_INTERVAL = 3600 // секунды

// Булевы переменные: is/has/should prefix
const isLoading = true
const hasDocuments = product.documents.length > 0
```

### Supabase-таблицы (snake_case, см. BACKEND.md)

```typescript
// В коде: camelCase (маппинг через типы)
// В БД: snake_case
product.priceByn  // в коде
price_byn         // в БД
```

---

## 3. КОМПОНЕНТЫ: ПРАВИЛА

### Server Components по умолчанию

```typescript
// ✅ Server Component — НОРМА
// Нет 'use client', получает данные прямо в компоненте
export default async function CatalogPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}

// ✅ Client Component — только когда НУЖНА интерактивность
'use client'
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  // ...
}
```

### Когда 'use client'

- useState, useEffect, useRef
- onClick, onChange, onSubmit
- browser API (window, localStorage)
- Сторонние клиентские библиотеки (Framer Motion)

### Когда Server Component

- Всё остальное. По умолчанию.
- Fetch данных из Supabase
- Рендеринг статического контента
- Layout, страницы, секции

### Структура компонента

```typescript
// 1. Imports
import { type FC } from 'react'
import { cn } from '@/lib/utils/cn'

// 2. Types
interface ProductCardProps {
  product: Product
  className?: string
}

// 3. Component
export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article className={cn('rounded-lg border border-border', className)}>
      {/* ... */}
    </article>
  )
}

// Правила:
// - Named exports (не default, кроме page.tsx/layout.tsx)
// - Нет React.FC — обычные функции с типизированными props
// - className всегда опциональный, мержим через cn()
// - Семантические HTML-теги (article, section, nav, aside)
```

### cn() — утилита для классов

```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 4. ДАННЫЕ: DATA ACCESS LAYER

### Принцип: queries/ — единственный способ получить данные

```
Компонент → lib/queries/products.ts → Supabase → данные
```

Компоненты НЕ вызывают Supabase напрямую. Все запросы — через функции в `lib/queries/`.

### Пример: queries/products.ts

```typescript
import { createServerClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'

export async function getProducts(): Promise<Product[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, documents(*), specifications(*)')
    .eq('slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}
```

### Кэширование и ISR

```typescript
// В page.tsx — настройка ISR
export const revalidate = 3600 // 1 час

// Для страниц с generateStaticParams — предгенерация при билде
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}
```

---

## 5. РОУТИНГ И НАВИГАЦИЯ

### URL-структура (из ARCHITECTURE.md)

| URL | Страница | Файл |
|-----|----------|------|
| `/` | Главная | `app/[locale]/page.tsx` |
| `/production` | Контрактное производство | `app/[locale]/production/page.tsx` |
| `/catalog` | Каталог | `app/[locale]/catalog/page.tsx` |
| `/catalog/magiya-3` | Продукт | `app/[locale]/catalog/[slug]/page.tsx` |
| `/about` | О компании | `app/[locale]/about/page.tsx` |
| `/partners` | Партнёрам | `app/[locale]/partners/page.tsx` |
| `/dealers` | Где купить | `app/[locale]/dealers/page.tsx` |
| `/docs` | Документация | `app/[locale]/docs/page.tsx` |
| `/news` | Новости | `app/[locale]/news/page.tsx` |
| `/news/[slug]` | Новость | `app/[locale]/news/[slug]/page.tsx` |
| `/contacts` | Контакты | `app/[locale]/contacts/page.tsx` |
| `/admin` | CMS | `app/admin/page.tsx` |

### Навигация (constants.ts)

```typescript
export const NAV_ITEMS = [
  { label: 'nav.production', href: '/production' },
  { label: 'nav.catalog', href: '/catalog' },
  { label: 'nav.about', href: '/about' },
  { label: 'nav.partners', href: '/partners' },
  { label: 'nav.dealers', href: '/dealers' },
  { label: 'nav.docs', href: '/docs' },
  { label: 'nav.news', href: '/news' },
  { label: 'nav.contacts', href: '/contacts' },
] as const
```

### Breadcrumbs

Автоматические на основе URL-сегментов. Маппинг в переводах:

```json
{
  "breadcrumbs": {
    "home": "Главная",
    "production": "Контрактное производство",
    "catalog": "Каталог",
    "about": "О компании",
    "partners": "Партнёрам",
    "dealers": "Где купить",
    "docs": "Документация",
    "news": "Новости",
    "contacts": "Контакты"
  }
}
```

---

## 6. ИНТЕРНАЦИОНАЛИЗАЦИЯ (i18n)

### Библиотека: next-intl

### Структура переводов

```
messages/
├── ru.json    # Русский (основной)
└── en.json    # Английский (позже)
```

### Формат переводов

```json
{
  "common": {
    "cta": {
      "call": "Позвонить",
      "email": "Написать",
      "details": "Подробнее",
      "download": "Скачать"
    },
    "currency": "BYN"
  },
  "home": {
    "hero": {
      "title": "Производство электроники собственной разработки и под заказ",
      "subtitle": "С 2015 года. Собственная линия SMD-монтажа.",
      "cta": "Заказать производство"
    }
  }
}
```

### Правила i18n

- **Ключи:** dot-notation, вложенные по секции → элемент.
- **Нет хардкода текста** в компонентах — всё через `t('key')`.
- **Исключение:** SEO-мета (title, description) — через `generateMetadata` с переводами.
- **Числа и даты:** через `Intl.NumberFormat`, `Intl.DateTimeFormat` — не хардкодить формат.
- **Цены:** показывать в BYN (основная), RUB и USD — из БД.

---

## 7. SEO

### generateMetadata на каждой странице

```typescript
// app/[locale]/catalog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}

  return {
    title: `${product.name} — ${product.short_description} | АРТИДА`,
    description: product.seo_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [{ url: product.image_url, width: 800, height: 600 }],
    },
  }
}
```

### JSON-LD (structured data)

```typescript
// Для страниц продуктов — Product schema
// Для всех страниц — Organization, BreadcrumbList
// Реализация: компонент <JsonLd data={...} /> в layout
```

### Sitemap и robots

```typescript
// app/sitemap.ts — автогенерация
// app/robots.ts — индексация всех публичных, блок /admin/
```

---

## 8. ИЗОБРАЖЕНИЯ

### next/image — ОБЯЗАТЕЛЬНО для всех изображений

```typescript
import Image from 'next/image'

// ✅ Всегда указывать width/height или fill
<Image
  src={product.image_url}
  alt={product.name}
  width={400}
  height={300}
  className="rounded-lg object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// ❌ Никогда <img> напрямую
```

### Правила

- **sizes** — ОБЯЗАТЕЛЬНО для responsive. Без него next/image грузит слишком большие файлы.
- **priority** — только для hero-изображений (above-the-fold). На остальных lazy loading по умолчанию.
- **alt** — описательный текст на русском: «Кнопка выхода МАГИЯ-3, вид спереди».
- **Форматы:** next/image автоматически конвертирует в WebP/AVIF.

---

## 9. СТИЛИЗАЦИЯ

### Tailwind CSS — единственный способ стилизации

```typescript
// ✅ Tailwind классы
<div className="flex items-center gap-4 rounded-lg bg-surface-alt p-6">

// ✅ Условные классы через cn()
<button className={cn(
  'rounded-lg px-6 py-3 font-semibold',
  variant === 'primary' && 'bg-brand text-white hover:bg-brand-light',
  variant === 'secondary' && 'border border-brand text-brand',
)}>

// ❌ Inline styles
// ❌ CSS Modules
// ❌ styled-components
// ❌ Отдельные .css файлы (кроме globals.css)
```

### globals.css — минимум

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Только то, что нельзя сделать через Tailwind:
   - @font-face для IBM Plex Sans
   - CSS-переменные (если нужны для анимаций)
   - Стили для markdown-контента из CMS (prose)
*/
```

---

## 10. ОБРАБОТКА ОШИБОК

### Файлы ошибок Next.js

```
app/[locale]/
├── error.tsx         # Глобальный error boundary
├── not-found.tsx     # 404 страница
└── loading.tsx       # Глобальный loading state
```

### Error boundary

```typescript
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Section>
      <h1>Что-то пошло не так</h1>
      <p>Попробуйте обновить страницу или свяжитесь с нами.</p>
      <Button onClick={reset}>Попробовать снова</Button>
    </Section>
  )
}
```

### 404

```typescript
export default function NotFound() {
  return (
    <Section>
      <h1>Страница не найдена</h1>
      <p>Проверьте адрес или вернитесь на главную.</p>
      <Button href="/">На главную</Button>
    </Section>
  )
}
```

---

## 11. ПРОИЗВОДИТЕЛЬНОСТЬ

### Checklist перед каждым PR

- [ ] Все изображения через `next/image` с `sizes`
- [ ] Нет `'use client'` без необходимости
- [ ] Нет `useEffect` для fetch данных (Server Components!)
- [ ] Нет тяжёлых зависимостей (проверить через `@next/bundle-analyzer`)
- [ ] Шрифты: `display: swap`, preload
- [ ] Анимации: respect `prefers-reduced-motion`
- [ ] Lazy loading для below-the-fold контента
- [ ] `revalidate` настроен корректно

### Bundle budget

- Общий JS: < 100KB gzipped
- Отдельный chunk: < 30KB gzipped
- Если превышает — декомпозировать через dynamic imports

---

## 12. ЗАВИСИМОСТИ (package.json)

### Core

```
next: ^15
react: ^19
typescript: ^5.5
tailwindcss: ^4
```

### Утилиты

```
next-intl               # i18n
@supabase/supabase-js   # Supabase клиент
clsx                    # Условные классы
tailwind-merge          # Мерж Tailwind классов
lucide-react            # Иконки
framer-motion           # Анимации (LazyMotion)
```

### Dev

```
eslint + eslint-config-next
prettier + prettier-plugin-tailwindcss
@types/react, @types/node
supabase (CLI, для генерации типов)
```

### Запрещённые зависимости

- ❌ jQuery, lodash (не нужны)
- ❌ Moment.js (Intl.DateTimeFormat)
- ❌ Bootstrap, Material UI (Tailwind)
- ❌ axios (fetch API)
- ❌ Любая библиотека > 50KB gzipped без обоснования
