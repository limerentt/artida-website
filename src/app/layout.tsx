import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = 'https://artida.by'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'АРТИДА — Производство электроники',
    template: '%s — АРТИДА',
  },
  description:
    'ООО «АРТИДА» — разработка и производство электронных устройств в Беларуси. Бесконтактные кнопки серии «Магия», устройства доступа КТМ-УД. Контрактное производство электроники.',
  keywords: [
    'АРТИДА',
    'электроника Беларусь',
    'бесконтактная кнопка',
    'Магия',
    'СКУД',
    'контроль доступа',
    'КТМ-УД',
    'контрактное производство',
    'электронные устройства',
    'artida.by',
  ],
  authors: [{ name: 'ООО «АРТИДА»' }],
  creator: 'ООО «АРТИДА»',
  publisher: 'ООО «АРТИДА»',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_BY',
    alternateLocale: 'en_US',
    siteName: 'АРТИДА',
    title: 'АРТИДА — Производство электроники',
    description:
      'Разработка и производство электронных устройств в Беларуси. Бесконтактные кнопки, устройства доступа, контрактное производство.',
    url: BASE_URL,
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'АРТИДА — Производство электроники',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'АРТИДА — Производство электроники',
    description:
      'Разработка и производство электронных устройств в Беларуси.',
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      ru: `${BASE_URL}/ru`,
      en: `${BASE_URL}/en`,
    },
  },
  other: {
    'geo.region': 'BY',
    'geo.placename': 'Минск',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
