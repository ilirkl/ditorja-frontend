"use client";

import { Category } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { getArticles } from "@/lib/supabase";
import { formatCategorySlug } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Article } from "@/types/article";
import { FeaturedNews } from "@/components/FeaturedNews";
import { EditorsPicks } from "@/components/EditorsPicks";

const NewsSection = ({
  title,
  articles,
  start,
  end,
  expandedArticleId,
  expandedSummaryId,
  setExpandedArticleId,
  setExpandedSummaryId
}: {
  title?: string;
  articles: Article[];
  start: number;
  end: number;
  expandedArticleId: string | null;
  expandedSummaryId: string | null;
  setExpandedArticleId: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedSummaryId: React.Dispatch<React.SetStateAction<string | null>>;
}) => (
  <section className="space-y-6">
    {title && (
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href="/articles" className="text-sm text-blue-600 hover:underline">
          Shiko Gjitha →
        </Link>
      </div>
    )}
    
    <div className="space-y-6">
      {articles.slice(start, end).map((article, index, arr) => (
        <Card 
          key={article.id} 
          className={`border-0 shadow-none ${
            index !== arr.length - 1 ? 'border-b border-gray-200 pb-4' : ''
          }`}
        >
          <CardContent className="p-0">
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <Category className="text-sm" href={`/categories/${formatCategorySlug(article.article_category)}`}>
                  {article.article_category}
                </Category>
                <div className="space-y-2">
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setExpandedArticleId(prev => prev === article.id ? null : article.id);
                      setExpandedSummaryId(null);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h3 className="font-bold title-hover line-clamp-2">
                        {article.article_title}
                      </h3>
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
                      href={`/article/${article.title_slug}`}
                      className="text-sm text-blue-600 hover:underline block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Lexo →
                    </Link>
                  )}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <time>{new Date(article.created_at).toLocaleDateString()}</time>
                </div>
              </div>

              <div className="w-20 h-20 relative shrink-0">
                <Image
                  src={article.article_image || "/placeholder.svg"}
                  alt={article.article_title}
                  fill
                  className="rounded-lg object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default function NewsApp() {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    );
  }

  const featuredArticle = articles.find(article => article.status === "featured");
  const latestArticles = articles.filter(article => article.status === "normal");
  const editorsPicks = articles.filter(article => article.status === "editors");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container px-2 sm:px-4 pb-8 sm:pb-16">
        {featuredArticle && (
          <FeaturedNews
            article={featuredArticle}
            expandedArticleId={expandedArticleId}
            expandedSummaryId={expandedSummaryId}
            setExpandedArticleId={setExpandedArticleId}
            setExpandedSummaryId={setExpandedSummaryId}
          />
        )}

        <NewsSection
          title="Te Fundit"
          articles={latestArticles}
          start={0}
          end={5}
          expandedArticleId={expandedArticleId}
          expandedSummaryId={expandedSummaryId}
          setExpandedArticleId={setExpandedArticleId}
          setExpandedSummaryId={setExpandedSummaryId}
        />

        <EditorsPicks articles={editorsPicks} />

        <NewsSection
          title="Më shumë lajme"
          articles={latestArticles}
          start={5}
          end={10}
          expandedArticleId={expandedArticleId}
          expandedSummaryId={expandedSummaryId}
          setExpandedArticleId={setExpandedArticleId}
          setExpandedSummaryId={setExpandedSummaryId}
        />
      </main>
      
      <Footer />
    </div>
  );
}