/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: 'BYN' | 'RUB' | 'USD' = 'BYN'): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    BYN: new Intl.NumberFormat('ru-BY', { style: 'currency', currency: 'BYN', minimumFractionDigits: 0 }),
    RUB: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
  }
  return formatters[currency].format(price)
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, locale: string = 'ru'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
