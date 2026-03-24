import type { Product } from '@/data/products'

const BASE_URL = 'https://artida.by'

type JsonLdProps = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ООО «АРТИДА»',
        alternateName: 'АРТИДА',
        url: BASE_URL,
        logo: `${BASE_URL}/images/og-cover.jpg`,
        description:
          'Разработка и производство электронных устройств в Беларуси. Контрактное производство электроники.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. Маковская, д.80',
          addressLocality: 'Минск',
          addressCountry: 'BY',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+375-29-756-87-07',
          contactType: 'sales',
          availableLanguage: ['Russian', 'English'],
        },
        sameAs: [],
        foundingDate: '2015',
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          minValue: 10,
          maxValue: 50,
        },
      }}
    />
  )
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image
          ? `${BASE_URL}${product.image}`
          : undefined,
        brand: {
          '@type': 'Brand',
          name: 'АРТИДА',
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'ООО «АРТИДА»',
        },
        offers: {
          '@type': 'Offer',
          url: `${BASE_URL}/ru/catalog/${product.slug}`,
          priceCurrency: 'BYN',
          price: product.price.byn,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'ООО «АРТИДА»',
          },
        },
        category: product.categoryLabel,
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${BASE_URL}${item.url}`,
        })),
      }}
    />
  )
}
