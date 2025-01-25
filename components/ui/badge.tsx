import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-blue-800",
        secondary: "text-sm text-blue-600 text-transform-uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps 
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span 
      className={cn(badgeVariants({ variant }), className)} 
      {...props} 
    />
  )
}

interface CategoryProps extends React.HTMLAttributes<HTMLSpanElement> {}

function Category({ className, ...props }: CategoryProps) {
  return (
    <span 
      className={cn("category", className)} 
      {...props} 
    />
  )
}

export { Badge, Category }
