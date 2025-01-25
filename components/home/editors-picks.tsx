import { Article } from "@/types/article"
import { ArticleImage } from "@/components/ui/article-image"

export function EditorsPicks({ articles }: { articles: Article[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Editor's Picks</h2>
      <div className="grid gap-6">
        {articles.map((article) => (
          <div key={article.id} className="flex gap-4">
            <div className="w-1/3">
              <ArticleImage src={article.article_image} alt={article.article_title} />
            </div>
            <div className="w-2/3">
              <h3 className="text-lg font-semibold">{article.article_title}</h3>
              <p className="text-sm text-gray-600">{article.article_short}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
