import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { COMPANY, CONTACTS } from '@/lib/constants'
import { Building2, Calendar, Cpu, Users } from 'lucide-react'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'О компании — АРТИДА', description: 'ООО «АРТИДА» — современное многопрофильное предприятие по производству электроники. Основана в 2015 году, собственное производство с 2017.' }
export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const milestones = [
    { year: '2015', icon: Building2, title: 'Основание', desc: 'Создание ООО «АРТИДА» как многопрофильного электронного предприятия' },
    { year: '2017', icon: Cpu, title: 'Производство', desc: 'Открытие собственного производственного участка с итальянским оборудованием' },
    { year: '2018', icon: Users, title: 'Партнёрства', desc: 'Расширение партнёрской сети: Вега-Абсолют, СпецКомИнтегРо, ТИНКО' },
    { year: '2024', icon: Calendar, title: 'Развитие', desc: 'Расширение ассортимента продукции и географии поставок' },
  ]

  return (
    <>
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <Reveal variant="fade-up" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-6">
                О компании
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={0.25}>
              <p className="text-lg text-text-inverse/80 max-w-2xl leading-relaxed">
                {COMPANY.fullName} — современное многопрофильное предприятие
                по производству электроники собственной разработки
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* About text */}
      <Section background="white">
        <Container>
          <Reveal variant="fade-up">
            <div className="max-w-3xl mx-auto">
            <p className="text-text-secondary leading-relaxed mb-6">
              АРТИДА — современное многопрофильное предприятие. Основные
              направления деятельности — производство электроники собственной
              разработки и оказание услуг другим предприятиям по контрактному
              монтажу и сборке печатных плат. Предприятие находится в постоянном
              движении, работает над созданием новой инновационной продукции
              в сотрудничестве с заинтересованными в этом предприятиями.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              Предприятие {COMPANY.fullName} создано в {COMPANY.founded} году.
              С этого момента разработано и начато серийное производство
              нескольких изделий разного функционального назначения.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              В {COMPANY.productionSince} году открыт собственный
              производственный участок полного цикла по монтажу и сборке
              печатных плат. Участок оснащён автоматическим
              высокопроизводительным оборудованием. Теперь {COMPANY.fullName}{' '}
              способно самостоятельно производить не только собственные
              изделия, но и оказывать помощь другим предприятиям по монтажу
              и пайке печатных плат.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Коллектив предприятия продолжает работу над созданием новой
              продукции, в которой воплощаются оригинальные идеи. Ведутся
              переговоры и заключаются договоры с новыми партнёрами,
              заинтересованными в реализации совместных проектов.
            </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Timeline */}
      <Section background="alt">
        <Container>
          <Reveal variant="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              История развития
            </h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m) => {
              const Icon = m.icon
              return (
                <StaggerItem key={m.year}>
                  <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand/10 text-brand mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-2xl font-bold text-brand mb-1">
                    {m.year}
                  </div>
                  <h3 className="font-semibold mb-2">{m.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {m.desc}
                  </p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Requisites */}
      <Section background="white">
        <Container>
          <Reveal variant="fade-up">
            <h2 className="text-2xl font-bold mb-6">Реквизиты</h2>
            <div className="bg-surface-alt rounded-xl p-6">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Полное наименование', COMPANY.fullName],
                    ['Адрес', CONTACTS.address],
                    ['Телефон', CONTACTS.phone],
                    ['Email', CONTACTS.email],
                    ['Режим работы', CONTACTS.hours],
                  ].map(([label, value], i, arr) => (
                    <tr
                      key={label}
                      className={
                        i < arr.length - 1 ? 'border-b border-border' : ''
                      }
                    >
                      <td className="py-3 text-text-secondary pr-4">
                        {label}
                      </td>
                      <td className="py-3 font-medium text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Reveal>
        </Container>
      </Section>
    </>
  )
}
