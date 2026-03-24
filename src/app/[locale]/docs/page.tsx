import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Download, FileText, ShieldCheck, Award } from 'lucide-react'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

type DocItem = {
  title: string
  file: string
  size: string
  category: 'manual' | 'certificate' | 'passport'
}

const documents: DocItem[] = [
  {
    title: 'Руководство по эксплуатации кнопок серии «Магия»',
    file: '/docs/RE-Magiya.pdf',
    size: '2.2 МБ',
    category: 'manual',
  },
  {
    title: 'Декларация соответствия кнопок «Магия» (ТР ТС 020/2011)',
    file: '/docs/Declaration-Magic.jpg',
    size: '822 КБ',
    category: 'certificate',
  },
  {
    title: 'Декларация соответствия кнопок КЕ',
    file: '/docs/Declaration-KE.jpg',
    size: '1.04 МБ',
    category: 'certificate',
  },
  {
    title: 'Паспорт КТМ-УД4в',
    file: '/docs/Passport-KTM-UD4v.jpg',
    size: '729 КБ',
    category: 'passport',
  },
  {
    title: 'Паспорт КТМ-УДв',
    file: '/docs/Passport-KTM-UDv.jpg',
    size: '662 КБ',
    category: 'passport',
  },
  {
    title: 'Письмо БелГИСС (КТМ-УД)',
    file: '/docs/BelGISS-ktm-ud.jpg',
    size: '725 КБ',
    category: 'certificate',
  },
]

const categoryConfig = {
  manual: { label: 'Руководства', icon: FileText },
  certificate: { label: 'Сертификаты и декларации', icon: ShieldCheck },
  passport: { label: 'Паспорта изделий', icon: Award },
}

export const metadata: Metadata = { title: 'Документация — АРТИДА', description: 'Сертификаты, декларации соответствия, паспорта и руководства по эксплуатации продукции АРТИДА.' }
export default async function DocsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const categories = ['manual', 'certificate', 'passport'] as const

  return (
    <>
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <Reveal variant="fade-up" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-4">
                Документация
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={0.25}>
              <p className="text-lg text-text-inverse/80 max-w-2xl">
                Сертификаты, декларации, паспорта и руководства по эксплуатации
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {categories.map((cat, idx) => {
        const config = categoryConfig[cat]
        const Icon = config.icon
        const catDocs = documents.filter((d) => d.category === cat)
        if (catDocs.length === 0) return null

        return (
          <Section key={cat} background={idx % 2 === 0 ? 'white' : 'alt'}>
            <Container>
              <Reveal variant="fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{config.label}</h2>
                </div>
              </Reveal>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catDocs.map((doc) => (
                  <StaggerItem key={doc.file}>
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/30 hover:bg-surface-alt transition-all"
                    >
                    <Download className="w-5 h-5 text-brand shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {doc.title}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {doc.size}
                      </div>
                    </div>
                    </a>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Container>
          </Section>
        )
      })}
    </>
  )
}
