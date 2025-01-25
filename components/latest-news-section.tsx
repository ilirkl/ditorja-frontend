"use client";

import { Category } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Article } from "@/types/article";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function LatestNewsSection({ 
  articles,
  expandedId,
  setExpandedId
}: {
  articles: Article[];
  expandedId: string | null;
  setExpandedId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-sohne-semibold">Te Fundit</h2>
        <Link href="/articles" className="text-sm text-blue-600 hover:underline">
          ALL STORIES →
        </Link>
      </div>

      <ScrollArea className="h-[400px] sm:h-[600px] pr-2 sm:pr-4">
        <div className="space-y-6">
          {articles.map((article) => (
            <Card key={article.id} className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="space-y-2">
                  <Category className="text-sm">
                    {article.article_category}
                  </Category>
                  <div className="space-y-2">
                    <div 
                      className="cursor-pointer"
                      onClick={() => {
                        setExpandedId((prev: string | null) => prev === article.id ? null : article.id);
                        setExpandedSummaryId(null);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <h3 className="title-hover font-sohne-medium">{article.article_title}</h3>
                        {expandedId === article.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
                    
                    {expandedId === article.id && (
                      <div 
                        className="cursor-pointer"
                        onClick={() => setExpandedSummaryId(prev => prev === article.id ? null : article.id)}
                      >
                        {expandedSummaryId !== article.id && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground flex-1 font-sohne">{article.article_short}</p>
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
                    
                    {expandedId === article.id && expandedSummaryId === article.id && (
                      <Link 
                        href={`/article/${article.id}`}
                        className="text-sm text-blue-600 hover:underline block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read more →
                      </Link>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <time>{new Date(article.created_at).toLocaleDateString()}</time>
                    <div className="flex flex-wrap gap-2">
                      {article.article_hashtags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                          {tag}
                        </span>
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
  );
}
