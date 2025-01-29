"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Category } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatCategorySlug } from "@/lib/utils";
import { Article } from "@/types/article";

export const NewsSection = ({
  title,
  articles,
  start,
  end,
  showViewAll = true,
  isSearchResult = false,
}: {
  title?: string;
  articles: Article[];
  start: number;
  end: number;
  showViewAll?: boolean;
  isSearchResult?: boolean;
}) => {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          {showViewAll && (
            <Link href="/articles" className="text-sm text-blue-600 hover:underline">
              Shiko Gjitha →
            </Link>
          )}
        </div>
      )}
      {isSearchResult && (
        <p className="text-muted-foreground italic">
          These articles are the results of your search.
        </p>
      )}
      <div className="space-y-6">
        {articles.slice(start, end).map((article, index, arr) => (
          <Card
            key={article.id}
            className={`border-0 shadow-none ${
              index !== arr.length - 1 ? "border-b border-gray-200 pb-4" : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <Category
                    className="text-sm"
                    href={`/categories/${formatCategorySlug(article.article_category)}`}
                  >
                    {article.article_category}
                  </Category>
                  <div className="space-y-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setExpandedArticleId((prev) =>
                          prev === article.id ? null : article.id
                        );
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
                        onClick={() =>
                          setExpandedSummaryId((prev) =>
                            prev === article.id ? null : article.id
                          )
                        }
                      >
                        {expandedSummaryId !== article.id ? (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground flex-1">
                              {article.article_short}
                            </p>
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground whitespace-pre-line flex-1">
                              {article.article_medium}
                            </p>
                            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                          </div>
                        )}
                      </div>
                    )}
                    {expandedArticleId === article.id &&
                      expandedSummaryId === article.id && (
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
};