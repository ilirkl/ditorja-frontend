"use client";

import { useState, useEffect } from "react";
import type { Article } from "@/types/article";
import { CategoryArticlesSection } from "@/components/category-articles-section";
import { getArticlesByCategory } from "@/lib/supabase";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

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
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">
        Artikuj : {params.category_slug.replace(/-/g, " ")} 
        </h1>
        <p className="text-muted-foreground">Duke perpunuar...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">
        Artikuj : {params.category_slug.replace(/-/g, " ")} 
        </h1>
        <p className="text-muted-foreground">
          Ska artikuj.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          Kategoria : {params.category_slug.replace(/-/g, " ")} 
        </h1>
        
        <CategoryArticlesSection 
          articles={articles}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      </main>
      
      <Footer />
    </div>
  );
}
