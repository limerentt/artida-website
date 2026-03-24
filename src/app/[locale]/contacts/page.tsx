import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { CONTACTS, COMPANY } from '@/lib/constants'
import { ContactForm } from '@/components/sections/ContactForm'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'Контакты — АРТИДА', description: 'Контактная информация ООО «АРТИДА». Телефон, email, адрес, форма обратной связи.' }
export default async function ContactsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const contactItems = [
    {
      icon: Phone,
      label: 'Телефон',
      value: CONTACTS.phone,
      href: `tel:${CONTACTS.phoneClean}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: CONTACTS.email,
      href: `mailto:${CONTACTS.email}`,
    },
    {
      icon: MapPin,
      label: 'Адрес',
      value: CONTACTS.address,
      href: undefined,
    },
    {
      icon: Clock,
      label: 'Режим работы',
      value: CONTACTS.hours,
      href: undefined,
    },
  ]

  const messengers = [
    { name: 'WhatsApp', href: CONTACTS.whatsapp },
    { name: 'Telegram', href: CONTACTS.telegram },
    { name: 'Viber', href: CONTACTS.viber },
  ]

  return (
    <>
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <Reveal variant="fade-up" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-4">
                Контакты
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={0.25}>
              <p className="text-lg text-text-inverse/80 max-w-2xl">
                Свяжитесь с нами удобным для вас способом
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <Reveal variant="fade-left" delay={0.1}>
              <h2 className="text-2xl font-bold mb-6">{COMPANY.fullName}</h2>

              <div className="space-y-5 mb-8">
                {contactItems.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary uppercase tracking-wide mb-0.5">
                          {item.label}
                        </div>
                        <div className="font-medium">{item.value}</div>
                      </div>
                    </div>
                  )

                  if (item.href) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        {content}
                      </a>
                    )
                  }
                  return <div key={item.label}>{content}</div>
                })}
              </div>

              {/* Messengers */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Мессенджеры
                </h3>
                <div className="flex gap-3">
                  {messengers.map((m) => (
                    <a
                      key={m.name}
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-brand/30 hover:bg-surface-alt transition-all text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {m.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* How to get there */}
              <div className="bg-surface-alt rounded-xl p-5">
                <h3 className="font-semibold mb-2">Как добраться</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Двигаясь по ул. Шаранговича от ул. Горецкого, за домом №19
                  свернуть направо и проехать через шлагбаум на стоянку.
                </p>
              </div>
            </Reveal>

            {/* Contact form */}
            <Reveal variant="fade-right" delay={0.2}>
              <div>
                <h2 className="text-2xl font-bold mb-6">Обратная связь</h2>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
