import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { products } from '@/data/products'
import { ArrowRight, Cpu } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'Каталог продукции — АРТИДА', description: 'Электронные устройства собственной разработки: бесконтактные кнопки серии Магия, КЕ-01, устройства доступа КТМ-УД.' }
export default async function CatalogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const accessControl = products.filter((p) => p.category === 'access-control')
  const security = products.filter((p) => p.category === 'security')

  return (
    <>
      <Section background="dark">
        <Container>
          <div className="py-12 lg:py-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-inverse mb-4">
              Каталог продукции
            </h1>
            <p className="text-lg text-text-inverse/80 max-w-2xl">
              Электронные устройства собственной разработки и производства
            </p>
          </div>
        </Container>
      </Section>

      {/* Access Control */}
      <Section background="white">
        <Container>
          <h2 className="text-2xl font-bold mb-8">Контроль доступа</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessControl.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Security devices */}
      <Section background="alt">
        <Container>
          <h2 className="text-2xl font-bold mb-8">Устройства доступа</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {security.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

function ProductCard({
  product,
}: {
  product: (typeof products)[number]
}) {
  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group block bg-surface rounded-xl border border-border overflow-hidden hover:border-brand/30 hover:shadow-md transition-all duration-200"
    >
      {/* Product image or placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-surface-alt to-surface flex items-center justify-center border-b border-border">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Cpu className="w-12 h-12 text-brand/20" />
        )}
      </div>
      <div className="p-6">
      <div className="mb-4">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          {product.categoryLabel}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-brand transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        {product.shortDescription}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-brand">
          {product.price.byn} BYN
        </span>
        <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-brand group-hover:translate-x-1 transition-all" />
      </div>
      </div>
    </Link>
  )
}
