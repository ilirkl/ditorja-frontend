"use client";

import { Badge, Category } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { getArticles } from "@/lib/supabase"
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Article } from "@/types/article"

export default function NewsApp() {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null)
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getArticles()
        setArticles(data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    )
  }

  const featuredArticle = articles.find(article => article.status === "featured")
  const latestArticles = articles.filter(article => article.status === "normal")
  const editorsPicks = articles.filter(article =>  article.status === "editors")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container px-2 sm:px-4 pb-8 sm:pb-16">
        {/* Featured Article */}
        {featuredArticle && (
          <article className="py-6">
            <div className="space-y-4">
              <Category className="text-sm">{featuredArticle.article_category}</Category>
              <Link href={`/article/${featuredArticle.id}`}>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight title-hover">{featuredArticle.article_title}</h1>
              </Link>
              <Image
                src={featuredArticle.article_image || "/placeholder.svg"}
                alt={featuredArticle.article_title}
                width={600}
                height={400}
                className="rounded-lg object-cover w-full h-auto"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time>{new Date(featuredArticle.created_at).toLocaleDateString()}</time>
              </div>
              <div className="space-y-2">
                <div 
                  className="cursor-pointer"
                  onClick={() => {
                    setExpandedArticleId(featuredArticle.id)
                    setExpandedSummaryId(expandedSummaryId === featuredArticle.id ? null : featuredArticle.id)
                  }}
                >
                  {expandedSummaryId !== featuredArticle.id && (
                    <div className="flex items-center justify-between w-full">
                      <p className="text-muted-foreground flex-1">{featuredArticle.article_short}</p>
                      <ChevronDown className="h-4 w-4 text-black shrink-0 ml-2" />
                    </div>
                  )}
                  {expandedSummaryId === featuredArticle.id && (
                    <div className="flex items-center justify-between w-full">
                      <p className="text-muted-foreground whitespace-pre-line flex-1">
                        {featuredArticle.article_medium}
                      </p>
                      <ChevronUp className="h-4 w-4 text-black shrink-0 ml-2" />
                    </div>
                  )}
                </div>
                {expandedArticleId === featuredArticle.id && expandedSummaryId === featuredArticle.id && (
                  <Link 
                    href={`/article/${featuredArticle.id}`}
                    className="text-sm text-blue-600 hover:underline block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Lexo →
                  </Link>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {featuredArticle.article_hashtags?.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </article>
        )}

        {/* Latest News */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Te Fundit</h2>
            <Link href="/articles" className="text-sm text-blue-600 hover:underline">
              ALL STORIES →
            </Link>
          </div>

          <ScrollArea className="h-[400px] sm:h-[600px] pr-2 sm:pr-4">
            <div className="space-y-6">
              {latestArticles.map((article) => (
                <Card key={article.id} className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="">
                      <Category className="text-sm">{article.article_category}</Category>
                      <div className="space-y-2">
                        <div 
                          className="cursor-pointer"
                          onClick={() => {
                            setExpandedArticleId(prev => prev === article.id ? null : article.id)
                            setExpandedSummaryId(null)
                          }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <h3 className="font-bold title-hover">{article.article_title}</h3>
                            {expandedArticleId === article.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                        
                        {expandedArticleId === article.id && (
                          <div 
                            className="cursor-pointer"
                            onClick={() => setExpandedSummaryId(prev => prev === article.id ? null : article.id)}
                          >
                            {expandedSummaryId !== article.id && (
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground flex-1">{article.article_short}</p>
                                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                              </div>
                            )}
                            {expandedSummaryId === article.id && (
                              <div className="flex items-center gap-2">
                                <p className="text-muted-foreground whitespace-pre-line flex-1">
                                  {article.article_medium}
                                </p>
                                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {expandedArticleId === article.id && expandedSummaryId === article.id && (
                          <Link 
                            href={`/article/${article.id}`}
                            className="text-sm text-blue-600 hover:underline block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Lexo →
                          </Link>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <time>{new Date(article.created_at).toLocaleDateString()}</time>
                        <div className="flex flex-wrap gap-2">
                          {article.article_hashtags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Editor's Picks */}
        <section className="space-y-6 pt-8">
          <h2 className="text-xl font-bold">Editor's Picks</h2>
          <div className="grid gap-4 sm:gap-6">
            {editorsPicks.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/article/${article.id}`} className="space-y-4">
                    <Image
                      src={article.article_image || "/placeholder.svg"}
                      alt={article.article_title}
                      width={600}
                      height={300}
                      className="object-cover w-full h-auto"
                    />
                    <div className="p-4 space-y-2">
                      <Category className="text-sm">{article.article_category}</Category>
                      <h3 className="font-bold title-hover">{article.article_title}</h3>
                      <p className="text-sm text-muted-foreground">{article.article_short}</p>
                      <div className="flex flex-wrap gap-2">
                        {article.article_hashtags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                           {tag}
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
      
      <Footer />
    </div>
  )
}
