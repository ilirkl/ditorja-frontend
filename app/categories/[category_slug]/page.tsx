"use client";

import { useState, useEffect } from "react";
import type { Article } from "@/types/article";
import { getArticlesByCategory } from "@/lib/supabase";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CategoryHeader } from "@/components/category/category-header";
import { CategoryLoading } from "@/components/category/category-loading";
import { CategoryEmpty } from "@/components/category/category-empty";
import { CategoryContent } from "@/components/category/category-content";

export default function CategoryPage({
  params,
}: {
  params: { category_slug: string };
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticlesByCategory(params.category_slug.toLowerCase());
        setArticles(data);
        console.log(`Fetched ${data.length} articles for category: ${params.category_slug}`);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [params.category_slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <CategoryLoading categorySlug={params.category_slug} />
        <Footer />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <CategoryEmpty categorySlug={params.category_slug} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CategoryHeader categorySlug={params.category_slug} />
      <CategoryContent
        articles={articles}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        categorySlug={params.category_slug}
      />
      <Footer />
    </div>
  );
}
