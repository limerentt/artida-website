import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { CtaBanner } from '@/components/sections/CtaBanner'

export const metadata: Metadata = {
  title: 'АРТИДА — Производство электроники в Беларуси',
  description:
    'ООО «АРТИДА» — разработка и производство электронных устройств. Бесконтактные кнопки серии «Магия», устройства доступа КТМ-УД. Контрактное производство электроники полного цикла.',
  alternates: {
    canonical: '/',
  },
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <Features />
      <CtaBanner />
    </>
  )
}
