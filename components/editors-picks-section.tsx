"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Article } from "@/types/article";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function EditorsPicksSection({ 
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
      <h2 className="text-xl font-bold font-sohne">Editors Picks</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="space-y-4">
                <Badge className="text-sm text-blue-600 text-transform-uppercase">
                  {article.article_category}
                </Badge>
                
                <div className="space-y-2">
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setExpandedId((prev: string | null) => prev === article.id ? null : article.id);
                      setExpandedSummaryId(null);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h3 className="font-bold title-hover font-sohne">{article.article_title}</h3>
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
    </section>
  );
}
