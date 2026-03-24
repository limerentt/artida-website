import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Handshake, Factory, Lightbulb, PenTool, TrendingUp } from 'lucide-react'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'Партнёрам — АРТИДА', description: 'Формы сотрудничества с АРТИДА: кооперация, совместные проекты, разработка под заказ, контрактное производство электроники.' }
export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const cooperationForms = [
    {
      icon: Factory,
      title: 'Кооперация',
      desc: 'Изготовление на производстве ООО «Артида» изделий, разработанных партнёром. Не просто изготовление, а оптимизация изделий: перенос элементов на одну сторону платы, оптимизация поставок комплектующих, анализ схемотехники и топологии.',
    },
    {
      icon: Lightbulb,
      title: 'Совместная реализация проектов',
      desc: 'Объединение усилий для разработки, производства и внедрения новой инновационной продукции. ООО «Артида» обладает рядом идей в области разработки электроники, которые может предложить заинтересованным организациям.',
    },
    {
      icon: PenTool,
      title: 'Разработка под заказ',
      desc: 'Разработка электронных устройств или систем по заданию и за средства партнёра. В дальнейшем — участие в изготовлении и техническом сопровождении.',
    },
    {
      icon: TrendingUp,
      title: 'Инвестирование',
      desc: 'Инвестирование свободных финансовых ресурсов в развитие предприятия. Условия определяются путём переговоров.',
    },
  ]

  return (
    <>
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <Reveal variant="fade-up" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-6">
                Партнёрам
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={0.25}>
              <p className="text-lg text-text-inverse/80 max-w-2xl leading-relaxed">
                Формы сотрудничества и возможности для партнёров
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Cooperation forms */}
      <Section background="white">
        <Container>
          <Reveal variant="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10">
              Формы сотрудничества
            </h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cooperationForms.map((form) => {
              const Icon = form.icon
              return (
                <StaggerItem
                  key={form.title}
                  className="bg-surface rounded-xl border border-border p-6"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand/10 text-brand mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{form.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {form.desc}
                  </p>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Partner spotlight */}
      <Section background="alt">
        <Container>
          <Reveal variant="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Наши партнёры</h2>
            <div className="bg-surface rounded-xl border border-border p-6 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                <Handshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  ООО «Вега-Абсолют»
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  г. Новосибирск, Россия
                </p>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Ведущий разработчик и производитель оборудования для систем
                  телеметрии, IoT, мониторинга транспорта и управления
                  автопарком. АРТИДА является официальным представителем
                  Вега-Абсолют в Республике Беларусь.
                </p>
                <a
                  href="https://www.vega-absolute.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand hover:underline"
                >
                  www.vega-absolute.ru
                </a>
              </div>
            </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="white">
        <Container>
          <Reveal variant="fade-up">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">
                Заинтересованы в сотрудничестве?
              </h2>
              <p className="text-text-secondary mb-6 max-w-xl mx-auto">
                Свяжитесь с нами для обсуждения условий партнёрства
              </p>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors"
            >
              Связаться с нами
            </Link>
              </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
