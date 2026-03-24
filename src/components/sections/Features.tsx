import { useTranslations } from 'next-intl'
import { Cpu, Factory, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion/Reveal'

const features = [
  { icon: Cpu, titleKey: 'features.own_rd', descKey: 'features.own_rd_desc' },
  {
    icon: Factory,
    titleKey: 'features.contract',
    descKey: 'features.contract_desc',
  },
  {
    icon: ShieldCheck,
    titleKey: 'features.quality',
    descKey: 'features.quality_desc',
  },
]

export function Features() {
  const t = useTranslations()

  return (
    <Section background="white">
      <Container>
        <Reveal variant="fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t('features.title')}
          </h2>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" staggerDelay={0.12}>
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={feature.titleKey}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand/10 text-brand mb-5">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </Container>
    </Section>
  )
}
