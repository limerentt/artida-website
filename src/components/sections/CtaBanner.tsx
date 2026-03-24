import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export function CtaBanner() {
  const t = useTranslations('cta')

  return (
    <Section background="alt">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-text-secondary text-lg mb-8">
            {t('description')}
          </p>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand-light transition-colors duration-200"
          >
            {t('button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
