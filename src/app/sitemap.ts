import type { MetadataRoute } from 'next'
import { products } from '@/data/products'

const BASE_URL = 'https://artida.by'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['ru', 'en']
  const now = new Date()

  const staticPages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/catalog', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/production', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/partners', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/dealers', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/docs', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/news', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/contacts', changeFrequency: 'yearly' as const, priority: 0.5 },
  ]

  const entries: MetadataRoute.Sitemap = []

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }
  }

  // Product pages for each locale
  for (const locale of locales) {
    for (const product of products) {
      entries.push({
        url: `${BASE_URL}/${locale}/catalog/${product.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })
    }
  }

  return entries
}
