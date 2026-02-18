import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
        secondary: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
        destructive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        outline: 'border border-stone-200 text-stone-700 dark:border-stone-700 dark:text-stone-300',
        solid: 'bg-green-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
