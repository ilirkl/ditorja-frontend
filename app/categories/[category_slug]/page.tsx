"use client";
import { useState, useEffect } from "react";
import type { Article } from "@/types/article";
import { getArticlesByCategory } from "@/lib/supabase";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { NewsSection } from "@/components/NewsSection";
import { formatCategorySlug } from "@/lib/utils";
import Link from "next/link";

export default function CategoryPage({
  params,
}: {
  params: { category_slug: string };
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticlesByCategory(params.category_slug.toLowerCase());
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [params.category_slug]);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [params.category_slug]);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8">
          <p className="text-muted-foreground">Duke perpunuar...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8">
          <p className="text-muted-foreground">Ska artikuj.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container px-4 py-2">
        <div className="mb-4">
          <div className="py-2 ml-4">
            <h1 className="text-2xl font-bold mb-2 capitalize">
              Kategoria: {formatCategorySlug(params.category_slug)}
            </h1>
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              ← Kthehu në faqen kryesore
            </Link>
          </div>
        </div>
        <NewsSection
          articles={articles} // Pass only static data
          start={startIndex}
          end={endIndex}
          showViewAll={false} // Disable "Shiko Gjitha" link
        />
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Paraardhës
            </button>

            <span className="text-sm text-muted-foreground">
              Faqja {currentPage} nga {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tjetra
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}