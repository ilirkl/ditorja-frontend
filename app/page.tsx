import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getArticles } from "@/lib/supabase"

export default async function NewsApp() {
  const articles = await getArticles()
  
  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    )
  }

  const featuredArticle = articles[0]
  const latestArticles = articles.slice(1, 6)
  const editorsPicks = articles.slice(6, 8)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/logo.svg`}
                alt="Morning Brew"
                width={32}
                height={32}
              />
              <span className="font-bold">MORNING BREW</span>
            </Link>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 pb-16">
        {/* Featured Article */}
        {featuredArticle && (
          <article className="py-6">
            <Link href={`/article/${featuredArticle.id}`} className="space-y-4">
              <Badge className="bg-blue-600 hover:bg-blue-700">{featuredArticle.article_category}</Badge>
              <h1 className="text-2xl font-bold tracking-tight">{featuredArticle.article_title}</h1>
              <Image
                src={featuredArticle.article_image || "/placeholder.svg"}
                alt={featuredArticle.article_title}
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{featuredArticle.author}</span>
                <span>•</span>
                <time>{new Date(featuredArticle.created_at).toLocaleDateString()}</time>
              </div>
              <p className="text-muted-foreground">{featuredArticle.article_short}</p>
              <div className="flex flex-wrap gap-2">
                {featuredArticle.article_hashtags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Link>
          </article>
        )}

        {/* Latest News */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">The Latest</h2>
            <Link href="/articles" className="text-sm text-blue-600 hover:underline">
              ALL STORIES →
            </Link>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {latestArticles.map((article) => (
                <Card key={article.id} className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <Link href={`/article/${article.id}`} className="space-y-2">
                      <Badge className="bg-blue-600 hover:bg-blue-700" variant="secondary">
                        {article.article_category}
                      </Badge>
                      <h3 className="font-bold">{article.article_title}</h3>
                      <p className="text-sm text-muted-foreground">{article.article_short}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{article.author}</span>
                        <span>•</span>
                        <time>{new Date(article.created_at).toLocaleDateString()}</time>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {article.article_hashtags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Editor's Picks */}
        <section className="space-y-6 pt-8">
          <h2 className="text-xl font-bold">Editor's Picks</h2>
          <div className="grid gap-6">
            {editorsPicks.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/article/${article.id}`} className="space-y-4">
                    <Image
                      src={article.article_image || "/placeholder.svg"}
                      alt={article.article_title}
                      width={600}
                      height={300}
                      className="object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <Badge className="bg-blue-600 hover:bg-blue-700">{article.article_category}</Badge>
                      <h3 className="font-bold">{article.article_title}</h3>
                      <p className="text-sm text-muted-foreground">{article.article_short}</p>
                      <div className="text-sm text-muted-foreground">{article.author}</div>
                      <div className="flex flex-wrap gap-2">
                        {article.article_hashtags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
