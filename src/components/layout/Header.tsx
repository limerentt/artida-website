'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { Menu, X, Phone, Globe } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Container } from './Container'
import { CONTACTS, NAV_ITEMS } from '@/lib/constants'
import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const switchLocale = () => {
    const nextLocale = locale === 'ru' ? 'en' : 'ru'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        isScrolled
          ? 'bg-surface/80 backdrop-blur-lg border-border shadow-sm'
          : 'bg-surface/95 backdrop-blur-sm border-border'
      )}
    >
      <Container>
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            isScrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[72px]'
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-brand shrink-0"
          >
            АРТИДА
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-brand transition-colors rounded-md"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Phone + Language + Mobile menu button */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACTS.phoneClean}`}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-light transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{CONTACTS.phone}</span>
            </a>

            <button
              onClick={switchLocale}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-text-secondary hover:text-brand transition-colors rounded-md border border-border"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === 'ru' ? 'EN' : 'RU'}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-primary hover:text-brand transition-colors"
              aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-200',
            isMobileMenuOpen ? 'max-h-[400px] pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-brand hover:bg-surface-alt transition-colors rounded-md"
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <a
              href={`tel:${CONTACTS.phoneClean}`}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand sm:hidden"
            >
              <Phone className="w-4 h-4" />
              {CONTACTS.phone}
            </a>
          </nav>
        </div>
      </Container>
    </header>
  )
}
