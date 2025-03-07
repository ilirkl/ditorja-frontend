import { Category } from "@/components/ui/badge"
import Link from "next/link"

export function ArticleHeader({
  category,
  title,
  date,
}: {
  category: { slug: string, name: string }
  title: string
  date: string
}) {
  return (
    <>
      <Link href="/" className="text-sm text-blue-600 hover:underline inline-block">
        ← Kthehu
      </Link>
      <div>
        <Link href={`/categories/${category.slug}`}>
          <Category className="text-sm mb-2">{category.name}</Category>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">{title}</h1>
        <div className="text-sm text-muted-foreground">
          <time>{date}</time>
        </div>
      </div>
    </>
  )
}
