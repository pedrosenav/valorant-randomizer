import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = ComponentProps<'div'>

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('relative mx-auto max-w-7xl px-6', className)}>
      {children}
    </div>
  )
}
