// АРТИДА — Company constants
// Source: OWNER_VISION.md + SITE_CONTENT.md

export const COMPANY = {
  name: 'АРТИДА',
  fullName: 'ООО «АРТИДА»',
  tagline: 'Производство электроники собственной разработки и под заказ',
  founded: 2015,
  productionSince: 2017,
} as const

export const CONTACTS = {
  phone: '+375 29 701-87-07',
  phoneClean: '+375297018707',
  email: 'info@artida.by',
  address: 'г. Минск, ул. Нёманская, д.40, оф. 505',
  hours: 'Пн–Пт: 9:00–18:00',
  whatsapp: 'https://wa.me/375297018707',
  telegram: 'https://t.me/artida_by',
  viber: 'viber://chat?number=%2B375297018707',
} as const

export const SITE = {
  url: 'https://artida.by',
  title: 'АРТИДА — Производство электроники',
  description: 'Разработка и производство электронных устройств. Контрактное производство электроники. Системы контроля доступа, пожарной и охранной сигнализации.',
  locale: 'ru',
  alternateLocale: 'en',
} as const

export const NAV_ITEMS = [
  { href: '/production', labelKey: 'nav.production' },
  { href: '/catalog', labelKey: 'nav.catalog' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/partners', labelKey: 'nav.partners' },
  { href: '/dealers', labelKey: 'nav.dealers' },
  { href: '/docs', labelKey: 'nav.docs' },
  { href: '/news', labelKey: 'nav.news' },
  { href: '/contacts', labelKey: 'nav.contacts' },
] as const
