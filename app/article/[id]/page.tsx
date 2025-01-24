import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getArticleById } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

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
    <div className="container max-w-3xl px-4 py-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Home
      </Link>
      <article className="space-y-6">
        <Badge className="bg-blue-600">{article.article_category}</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{article.article_title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{article.author}</span>
          <span>•</span>
          <time>{new Date(article.created_at).toLocaleDateString()}</time>
        </div>
        <Image
          src={article.article_image || "/placeholder.svg"}
          alt={article.article_title}
          width={800}
          height={400}
          className="rounded-lg object-cover"
        />
        <div className="flex flex-wrap gap-2">
          {article.article_hashtags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="prose prose-gray max-w-none">
          <p className="text-lg font-medium">{article.article_short}</p>
          <p>{article.article_medium}</p>
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Read More</h2>
            <p>{article.article_large}</p>
          </div>
        </div>
      </article>
    </div>
  )
}

