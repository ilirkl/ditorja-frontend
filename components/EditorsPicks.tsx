import { Article } from "@/types/article";
import { Category } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatCategorySlug } from "@/lib/utils";

export const EditorsPicks = ({ articles }: { articles: Article[] }) => (
  <section className="space-y-6 pt-8">
    <h2 className="text-xl font-bold">Editoriale</h2>
    <div className="grid gap-4 sm:gap-6">
      {articles.slice(0, 5).map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="space-y-4">
              <Link href={`/article/${article.title_slug}`}>
                <Image
                  src={article.article_image || "/placeholder.svg"}
                  alt={article.article_title}
                  width={600}
                  height={300}
                  className="object-cover w-full h-auto"
                />
              </Link>
              <div className="p-4 space-y-2">
                <Category className="text-sm" href={`/categories/${formatCategorySlug(article.article_category)}`}>
                  {article.article_category}
                </Category>
                <h3 className="font-bold title-hover">{article.article_title}</h3>
                <p className="text-sm text-muted-foreground">{article.article_short}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);