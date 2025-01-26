"use client";

import { Category } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Article } from "@/types/article";
import { formatCategorySlug } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function CategoryArticlesSection({ 
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
      <ScrollArea className="h-[400px] sm:h-[600px] pr-2 sm:pr-4">
        <div className="space-y-6">
          {articles.map((article) => (
            <Card key={article.id} className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="space-y-2">
                  
                  <div className="space-y-2">
                    <div 
                      className="cursor-pointer"
                      onClick={() => {
                        setExpandedId((prev: string | null) => prev === article.id ? null : article.id);
                        setExpandedSummaryId(null);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <h3 className="title-hover font-bold font-sohne-medium">{article.article_title}</h3>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
