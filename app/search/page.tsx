"use client";
import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import { getArticlesBySearch } from "@/lib/supabase";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { NewsSection } from "@/components/NewsSection";
import Link from "next/link";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        if (searchParams.q) {
          const searchTerm = searchParams.q.trim();
          const results = await getArticlesBySearch(searchTerm);
          setArticles(results);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams.q]);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams.q]);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8">
          <p className="text-muted-foreground">Duke kërkuar për &quot;{searchParams.q}&quot;...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!searchParams.q || articles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8">
          <h2 className="text-xl">
            {searchParams.q
              ? `Nuk u gjet asnjë rezultat për "${searchParams.q}"`
              : "Shkruani një term kërkimi për të filluar"}
          </h2>
          <Link href="/" className="text-sm text-blue-600 hover:underline mt-4 inline-block">
            ← Kthehu në faqen kryesore
          </Link>
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
            <h1 className="text-2xl font-bold mb-2">
              Rezultatet e kërkimit për: &quot;{searchParams.q}&quot;
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
          isSearchResult={true} // Indicate that this is a search result
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