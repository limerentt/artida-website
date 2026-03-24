import { cn } from '@/lib/utils/cn'
import { Container } from './Container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'alt' | 'dark'
  id?: string
}

const bgStyles = {
  white: 'bg-surface',
  alt: 'bg-surface-alt',
  dark: 'bg-surface-dark text-text-inverse',
}

export function Section({ children, className, background = 'white', id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-8 md:py-12 lg:py-20',
        bgStyles[background],
        className
      )}
    >
      <Container>{children}</Container>
    </section>
  )
}
