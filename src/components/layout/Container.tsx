import { cn } from '@/lib/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'main' | 'article'
}

export function Container({ children, className, as: Component = 'div' }: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-0', className)}
    >
      {children}
    </Component>
  )
}
