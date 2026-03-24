import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { dealers } from '@/data/dealers'
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'Где купить — АРТИДА', description: 'Официальные дилеры продукции АРТИДА в Беларуси и России.' }
export default async function DealersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <Reveal variant="fade-up" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-4">
                Где купить
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={0.25}>
              <p className="text-lg text-text-inverse/80 max-w-2xl">
                Официальные дилеры продукции АРТИДА
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <StaggerItem
                key={dealer.name}
                className={`rounded-xl border p-6 ${
                  dealer.isOwn
                    ? 'border-brand/30 bg-brand/5'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      dealer.isOwn
                        ? 'bg-brand text-white'
                        : 'bg-surface-alt text-text-secondary'
                    }`}
                  >
                    {dealer.isOwn ? (
                      <Star className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{dealer.name}</h3>
                    {dealer.isOwn && (
                      <span className="text-xs font-medium text-brand">
                        Производитель
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>
                      {dealer.city}, {dealer.country}
                    </span>
                  </div>
                  {dealer.phone && (
                    <a
                      href={`tel:${dealer.phone.replace(/[\s()-]/g, '')}`}
                      className="flex items-center gap-2 text-text-secondary hover:text-brand transition-colors"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{dealer.phone}</span>
                    </a>
                  )}
                  {dealer.email && (
                    <a
                      href={`mailto:${dealer.email}`}
                      className="flex items-center gap-2 text-text-secondary hover:text-brand transition-colors"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>{dealer.email}</span>
                    </a>
                  )}
                  {dealer.website && (
                    <a
                      href={dealer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-secondary hover:text-brand transition-colors"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span>{dealer.website.replace('https://', '')}</span>
                    </a>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>
    </>
  )
}
