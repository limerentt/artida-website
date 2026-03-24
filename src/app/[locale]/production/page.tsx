import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Factory, Cpu, Shield, Wrench } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'Производство — АРТИДА', description: 'Собственное автоматизированное производство электроники полного цикла. SMD и DIP монтаж. Контрактное производство печатных плат.' }
export default async function ProductionPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ProductionContent />
}

function ProductionContent() {
  const t = useTranslations()

  const capabilities = [
    {
      icon: Cpu,
      title: 'SMD-монтаж',
      desc: 'Автоматическая установка компонентов поверхностного монтажа на итальянском оборудовании',
    },
    {
      icon: Wrench,
      title: 'DIP-монтаж',
      desc: 'Ручной монтаж выводных элементов на современных паяльных станциях',
    },
    {
      icon: Factory,
      title: 'Пайка в печи',
      desc: 'Трёхзонная конвекционная печь с индивидуальной температурой каждой зоны',
    },
    {
      icon: Shield,
      title: '100% контроль',
      desc: 'Визуальный контроль каждого изделия. Свинцовая и бессвинцовая технологии',
    },
  ]

  return (
    <>
      {/* Hero */}
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-6">
              Производство
            </h1>
            <p className="text-lg text-text-inverse/80 max-w-2xl leading-relaxed">
              Собственное автоматизированное производство полного цикла по выпуску
              электронной продукции. Оснащено высокопроизводительным итальянским
              оборудованием.
            </p>
          </div>
        </Container>
      </Section>

      {/* Photos grid */}
      <Section background="white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="aspect-[4/3] relative rounded-lg overflow-hidden bg-surface-alt"
              >
                <Image
                  src={`/images/manufacture${n === 1 ? '01' : n}-240x180.jpg`}
                  alt={`Производство АРТИДА — фото ${n}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section background="alt">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Возможности производства
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div key={cap.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand/10 text-brand mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold mb-2">{cap.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Contract manufacturing */}
      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Контрактное производство
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              ООО «АРТИДА» оказывает услуги по контрактной сборке и пайке печатных
              плат (SMD и DIP монтаж) предприятиям, занимающимся разработкой
              электронной техники. Высококвалифицированный персонал выполняет заказы
              любой сложности — от единичных изделий до крупных партий.
            </p>

            <h3 className="text-lg font-semibold mb-3">Основные работы:</h3>
            <ul className="space-y-2 text-text-secondary mb-8">
              {[
                'Монтаж мелких, средних, крупных партий печатных плат',
                'Все виды плат: односторонние, двухсторонние, многослойные, гибкие',
                'Автоматическая установка и пайка SMD-компонентов',
                'Ручной монтаж DIP-элементов',
                'Комбинированный DIP + SMD монтаж',
                'Визуальный 100% контроль качества',
                'Выполнение срочных заказов',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              Дополнительные услуги:
            </h3>
            <ul className="space-y-2 text-text-secondary">
              {[
                'Проверка схемотехники и топологии печатных плат',
                'Проектирование и разработка печатных плат',
                'Отмывка плат и нанесение влагозащитных покрытий',
                'Поставка комплектующих по спецификации заказчика',
                'Наладка, программирование и тестирование',
                'Сборка в корпуса, механосборочные работы',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  )
}
