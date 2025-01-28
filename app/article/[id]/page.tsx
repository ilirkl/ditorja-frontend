import { getArticleBySlug, getRelatedArticles  } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ArticleHeader } from "@/components/article/article-header"
import { ArticleImage } from "@/components/article/article-image"
import { ArticleTags } from "@/components/article/article-tags"
import { ArticleContent } from "@/components/article/article-content"
import { NewsSection } from "@/components/NewsSection"

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticleBySlug(params.id);

  if (!article) {
    notFound();
  };

  const relatedArticles = await getRelatedArticles(article)


  return (
    <>
      <Navbar />
      <div className="container max-w-3xl px-4 py-6">
        <article className="space-y-2">
          <ArticleHeader
            category={{
              slug: article.article_category.toLowerCase().replace(/\s+/g, "-"),
              name: article.article_category,
            }}
            title={article.article_title}
            date={new Date(article.created_at).toLocaleDateString()}
          />
          <ArticleImage
            src={article.article_image}
            alt={article.article_title}
          />
         
          <ArticleContent content={article.article_large} />
          <ArticleTags tags={article.article_hashtag} />
       
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Artikuj të ngjashëm</h2>
              <div className="space-y-8">
                {relatedArticles.map((relatedArticle) => (
                  <NewsSection
                    key={relatedArticle.id}
                    articles={[relatedArticle]} // Pass as an array if needed
                    start={0} // Specify a starting index
                    end={1} // Specify an ending index (1 article in this case)
                    expandedArticleId={null}
                    expandedSummaryId={null}
                    setExpandedArticleId={() => {}}
                    setExpandedSummaryId={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
      <Footer />
    </>
  );
}