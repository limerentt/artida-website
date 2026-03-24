import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Container } from './Container'
import { COMPANY, CONTACTS, NAV_ITEMS } from '@/lib/constants'

export function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-dark text-text-inverse">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-12 lg:py-16">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">АРТИДА</h3>
            <p className="text-sm text-text-inverse/70 leading-relaxed">
              {COMPANY.tagline}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-text-inverse/50">
              {t('footer.sections')}
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-text-inverse/70 hover:text-white transition-colors"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: More links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-text-inverse/50">
              {t('footer.info')}
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.slice(5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-text-inverse/70 hover:text-white transition-colors"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Contacts */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-text-inverse/50">
              {t('footer.contacts')}
            </h4>
            <div className="flex flex-col gap-3 text-sm text-text-inverse/70">
              <a
                href={`tel:${CONTACTS.phoneClean}`}
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                {CONTACTS.phone}
              </a>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                {CONTACTS.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{CONTACTS.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{CONTACTS.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 text-center text-xs text-text-inverse/40">
          &copy; {currentYear} {COMPANY.fullName}. {t('footer.rights')}.
        </div>
      </Container>
    </footer>
  )
}
