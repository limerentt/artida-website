import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { news } from '@/data/news'
import { Calendar, Tag } from 'lucide-react'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const metadata: Metadata = { title: 'Новости — АРТИДА', description: 'События и новости компании АРТИДА: выставки, партнёрства, реализованные проекты.' }
export default async function NewsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <Reveal variant="fade-up" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-4">
                Новости
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={0.25}>
              <p className="text-lg text-text-inverse/80 max-w-2xl">
                События и новости компании АРТИДА
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <StaggerContainer className="max-w-3xl mx-auto space-y-6">
            {news.map((item) => (
              <StaggerItem
                key={item.slug}
                className="rounded-xl border border-border p-6 hover:border-brand/30 hover:shadow-sm transition-all"
              >
                <article>
                <div className="flex items-center gap-4 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                </div>
                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.excerpt}
                </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>
    </>
  )
}
