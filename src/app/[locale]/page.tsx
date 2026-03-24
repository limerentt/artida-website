import { setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { CtaBanner } from '@/components/sections/CtaBanner'

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
