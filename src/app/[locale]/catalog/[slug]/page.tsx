import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { products, getProductBySlug } from '@/data/products'
import { ArrowLeft, Download, Check } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const product = getProductBySlug(slug)
  if (!product) notFound()

  return (
    <>
      <Section background="white">
        <Container>
          {/* Breadcrumb */}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Каталог
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Info */}
            <div>
              <span className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                {product.categoryLabel}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
                {product.name}
              </h1>
              <p className="text-text-secondary leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border">
                <span className="text-3xl font-bold text-brand">
                  {product.price.byn} BYN
                </span>
                <span className="text-sm text-text-secondary">
                  {product.price.rub} RUB / {product.price.usd} USD
                </span>
              </div>

              {/* Features */}
              <h2 className="text-lg font-semibold mb-4">
                Функциональные возможности
              </h2>
              <ul className="space-y-3 mb-8">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Specs + Docs */}
            <div>
              {/* Specs table */}
              <div className="bg-surface-alt rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  Технические характеристики
                </h2>
                <table className="w-full text-sm">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr
                        key={spec.label}
                        className={
                          i < product.specs.length - 1
                            ? 'border-b border-border'
                            : ''
                        }
                      >
                        <td className="py-3 text-text-secondary pr-4">
                          {spec.label}
                        </td>
                        <td className="py-3 font-medium text-right">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Documents */}
              {product.docs.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Документация</h2>
                  <div className="space-y-3">
                    {product.docs.map((doc) => (
                      <a
                        key={doc.file}
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/30 hover:bg-surface-alt transition-all"
                      >
                        <Download className="w-5 h-5 text-brand shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {doc.title}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {doc.size}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
