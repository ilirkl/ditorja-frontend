"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SearchBoxProps } from "@/types/search.ts";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getCategories } from "@/lib/supabase";

export function Navbar({ onSearch }: SearchBoxProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ category: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch { 
        setError("Gabim gjatë ngarkimit të kategorive.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim()); // Use optional chaining here
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center pl-3.5">
          <div className="w-[200px] h-[50px] relative">
            <Image
              src="/LAJMI365.svg"
              alt="Logo"
              fill
              priority
              style={{ objectFit: "contain" }}
              sizes="200px"
            />
          </div>
        </Link>

        {/* Search and Menu Buttons */}
        <div className="flex items-center gap-2">
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Kërko..."
                  className="h-10 w-48 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Dropdown Menu for Categories */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Homepage Option */}
              <DropdownMenuItem
                className="cursor-pointer text-sm font-semibold"
                onClick={() => router.push("/")}
              >
                Faqja Kryesore
              </DropdownMenuItem>

              {/* Header Label */}
              <DropdownMenuItem disabled className="cursor-default text-sm font-semibold">
                Kategoritë
              </DropdownMenuItem>

              {/* Loading State */}
              {loading && (
                <DropdownMenuItem disabled className="cursor-not-allowed">
                  Duke ngarkuar...
                </DropdownMenuItem>
              )}

              {/* Error State */}
              {error && (
                <DropdownMenuItem disabled className="cursor-not-allowed">
                  {error}
                </DropdownMenuItem>
              )}

              {/* Dynamically Generated Categories */}
              {!loading && !error && categories.length > 0 ? (
                categories.map(({ category, slug }, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="cursor-pointer"
                    onClick={() => router.push(`/categories/${slug}`)} // Use the slug for navigation
                  >
                    {category}
                  </DropdownMenuItem>
                ))
              ) : (
                !loading && !error && (
                  <DropdownMenuItem disabled className="cursor-not-allowed">
                    Nuk ka kategori të disponueshme
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}