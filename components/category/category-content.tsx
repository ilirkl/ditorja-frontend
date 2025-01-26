import { CategoryArticlesSection } from "@/components/category-articles-section"
import type { Article } from "@/types/article"
import type { Dispatch, SetStateAction } from "react"

export function CategoryContent({
  articles,
  expandedId,
  setExpandedId,
  categorySlug
}: {
  articles: Article[]
  expandedId: string | null
  setExpandedId: Dispatch<SetStateAction<string | null>>
  categorySlug: string
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container px-4 py-2">
               
        <CategoryArticlesSection 
          articles={articles}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      </main>
    </div>
  )
}
