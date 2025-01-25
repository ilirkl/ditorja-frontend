import { getArticleById } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ArticleHeader } from "@/components/article/article-header"
import { ArticleImage } from "@/components/ui/article-image"
import { ArticleTags } from "@/components/article/article-tags"
import { ArticleContent } from "@/components/article/article-content"

export default async function ArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const article = await getArticleById(params.id)

  if (!article) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <div className="container max-w-3xl px-4 py-6">
        <article className="space-y-2">
          <ArticleHeader
            category={article.article_category}
            title={article.article_title}
            date={new Date(article.created_at).toLocaleDateString()}
          />
          <ArticleImage 
            src={article.article_image}
            alt={article.article_title}
          />
          <ArticleTags tags={article.article_hashtags} />
          <ArticleContent content={article.article_large} />
        </article>
      </div>
      <Footer />
    </>
  )
}
