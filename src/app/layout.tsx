import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'АРТИДА — Производство электроники',
  description:
    'Разработка и производство электронных устройств. Контрактное производство электроники. Системы контроля доступа.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
