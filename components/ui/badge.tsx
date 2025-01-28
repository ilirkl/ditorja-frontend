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
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Comp = asChild ? 'div' : 'span';
  return (
    <Comp 
      className={cn(badgeVariants({ variant }), className)} 
      {...props} 
    />
  )
}

interface CategoryProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  href?: string;
}

import Link from "next/link";

function Category({ className, asChild, href, ...props }: CategoryProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "category hover:text-blue-700 hover:underline cursor-pointer transition-colors",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {props.children}
      </Link>
    )
  }
  
  const Comp = asChild ? 'div' : 'span';
  return (
    <Comp 
      className={cn(
        "category hover:text-blue-700 hover:underline cursor-pointer transition-colors",
        className
      )} 
      {...props} 
    />
  )
}

export { Badge, Category }
