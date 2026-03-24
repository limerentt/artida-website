import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, FileText } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion/Reveal'

export function Hero() {
  const t = useTranslations()

  return (
    <section className="relative overflow-hidden bg-surface-dark text-text-inverse">
      {/* Animated gradient background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <Container>
        <div className="relative z-10 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            {/* Subtitle chip */}
            <Reveal variant="fade-in" delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm font-medium tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {t('hero.subtitle')}
              </div>
            </Reveal>

            {/* Title */}
            <Reveal variant="fade-up" delay={0.1} duration={0.6}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                {t('hero.title')}
              </h1>
            </Reveal>

            {/* Description */}
            <Reveal variant="fade-up" delay={0.25}>
              <p className="text-lg sm:text-xl text-text-inverse/80 leading-relaxed mb-10 max-w-2xl">
                {t('hero.description')}
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal variant="fade-up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contacts"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand font-semibold rounded-lg hover:bg-white/90 transition-all duration-200 shadow-lg shadow-black/20"
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  <FileText className="w-5 h-5" />
                  {t('hero.catalog')}
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Stats row */}
          <StaggerContainer
            className="grid grid-cols-3 gap-6 sm:gap-12 mt-16 pt-10 border-t border-white/10 max-w-xl"
            staggerDelay={0.15}
          >
            <StaggerItem>
              <Stat value="10+" label={t('stats.years')} />
            </StaggerItem>
            <StaggerItem>
              <Stat value="20+" label={t('stats.products')} />
            </StaggerItem>
            <StaggerItem>
              <Stat value="100+" label={t('stats.partners')} />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </Container>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-text-inverse/60 mt-1">
        {label}
      </div>
    </div>
  )
}
