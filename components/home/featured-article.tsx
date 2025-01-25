import { Article } from "@/types/article"
import { ArticleImage } from "@/components/ui/article-image"

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Featured Article</h2>
      <div className="grid gap-6">
        <ArticleImage src={article.article_image} alt={article.article_title} />
        <h3 className="text-xl font-semibold">{article.article_title}</h3>
        <p className="text-gray-600">{article.article_short}</p>
      </div>
    </section>
  )
}
