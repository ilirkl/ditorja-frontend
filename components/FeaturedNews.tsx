import { Article } from "@/types/article";
import { Category } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCategorySlug } from "@/lib/utils";

export const FeaturedNews = ({
  article,
  expandedArticleId,
  expandedSummaryId,
  setExpandedArticleId,
  setExpandedSummaryId
}: {
  article: Article;
  expandedArticleId: string | null;
  expandedSummaryId: string | null;
  setExpandedArticleId: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedSummaryId: React.Dispatch<React.SetStateAction<string | null>>;
}) => (
  <article className="py-6">
    <div className="space-y-4">
      <Category className="text-sm" href={`/categories/${formatCategorySlug(article.article_category)}`}>
        {article.article_category}
      </Category>
      <Link href={`/article/${article.title_slug}`}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight title-hover">
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
            setExpandedArticleId(article.id);
            setExpandedSummaryId(expandedSummaryId === article.id ? null : article.id);
          }}
        >
          {expandedSummaryId !== article.id ? (
            <div className="flex items-center justify-between w-full">
              <p className="text-muted-foreground flex-1">{article.article_short}</p>
              <ChevronDown className="h-4 w-4 text-black shrink-0 ml-2" />
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <p className="text-muted-foreground whitespace-pre-line flex-1">
                {article.article_medium}
              </p>
              <ChevronUp className="h-4 w-4 text-black shrink-0 ml-2" />
            </div>
          )}
        </div>
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
    </div>
  </article>
);