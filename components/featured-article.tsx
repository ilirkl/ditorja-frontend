"use client";

import { Category } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types/article";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatCategorySlug } from "@/lib/utils";

export function FeaturedArticle({ 
  article,
  expandedId,
  setExpandedId
}: {
  article: Article;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  return (
    <article className="py-6">
      <div className="space-y-4">
        <Link href={`/categories/${encodeURIComponent(formatCategorySlug(article.article_category))}`}>
          <Category className="text-sm hover:underline">
            {article.article_category}
          </Category>
        </Link>
        <Link href={`/article/${article.id}`}>
          <h1 className="text-xl sm:text-2xl tracking-tight title-hover font-sohne-bold">
            {article.article_title}
          </h1>
        </Link>
        <Image
          src={article.article_image || "/placeholder.svg"}
          alt={article.article_title}
          width={600}
          height={400}
          className="rounded-lg object-cover w-full h-auto"
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time>{new Date(article.created_at).toLocaleDateString()}</time>
        </div>
        <div className="space-y-2">
          <div 
            className="cursor-pointer"
            onClick={() => {
              setExpandedId(article.id);
              setExpandedSummaryId(expandedSummaryId === article.id ? null : article.id);
            }}
          >
            {expandedSummaryId !== article.id && (
              <div className="flex items-center justify-between w-full">
                <p className="text-muted-foreground flex-1 font-sohne">{article.article_short}</p>
                <ChevronDown className="h-4 w-4 text-black shrink-0 ml-2" />
              </div>
            )}
            {expandedSummaryId === article.id && (
              <div className="flex items-center justify-between w-full">
                <p className="text-muted-foreground whitespace-pre-line flex-1">
                  {article.article_medium}
                </p>
                <ChevronUp className="h-4 w-4 text-black shrink-0 ml-2" />
              </div>
            )}
          </div>
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
        <div className="flex flex-wrap gap-2">
          {article.article_hashtags?.slice(0, 3).map((tag: string) => (
            <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
