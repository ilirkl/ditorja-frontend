// utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"
import type { Article } from "@/types/article"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Remove all category cache-related code and interfaces

export function formatCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')    // Replace special chars with hyphens
    .replace(/(^-|-$)/g, '');       // Remove leading/trailing hyphens
}

export function formatCategoryForQuery(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letters
    .trim();
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  // Convert URL-friendly slug to display format
  const displayCategory = formatCategoryForQuery(categorySlug);
  
  console.log(`Searching for articles with category: ${displayCategory}`);

  const { data, error } = await supabase
    .from("ditorja_frontend")
    .select("*")
    .ilike("article_category", `%${displayCategory}%`) // Case-insensitive partial match
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  console.log(`Found ${data.length} articles for category: ${displayCategory}`);
  return data as Article[];
}