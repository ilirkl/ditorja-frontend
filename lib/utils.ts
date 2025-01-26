import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"
import type { Article } from "@/types/article"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CategoryMapping {
  slug: string;
  dbName: string;
}

interface CategoryCache {
  mappings: CategoryMapping[];
  lastUpdated: number;
}

const CATEGORY_CACHE_TTL = 1000 * 60 * 5; // 5 minutes
let categoryCache: CategoryCache | null = null;

async function fetchCategoriesWithRetry(retries = 3): Promise<CategoryMapping[]> {
  try {
    const { data, error } = await supabase
      .from("categories") // Assuming a dedicated categories table exists
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return data.map(category => ({
      slug: formatCategorySlug(category.name),
      dbName: category.name
    }));
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying category fetch (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchCategoriesWithRetry(retries - 1);
    }
    throw error;
  }
}

async function refreshCategoryCache() {
  try {
    const mappings = await fetchCategoriesWithRetry();
    categoryCache = {
      mappings,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error("Failed to refresh category cache:", error);
  }
}

// Initialize cache and setup background refresh
refreshCategoryCache();
setInterval(refreshCategoryCache, CATEGORY_CACHE_TTL);

function getCurrentMappings(): CategoryMapping[] {
  if (!categoryCache || Date.now() - categoryCache.lastUpdated > CATEGORY_CACHE_TTL) {
    // If cache is stale, refresh synchronously
    refreshCategoryCache();
    return categoryCache?.mappings || [];
  }
  return categoryCache.mappings;
}

export function formatCategorySlug(category: string): string {
  // Find matching mapping or create a default slug
  const mapping = getCurrentMappings().find(m => m.dbName === category);
  return mapping ? mapping.slug : category
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatCategoryForQuery(slug: string): string {
  // Find matching mapping or use default conversion
  const mapping = getCurrentMappings().find(m => m.slug === slug);
  if (mapping) {
    return mapping.dbName;
  }
  
  // Fallback for unmapped categories
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  // Convert URL-friendly slug to database format
  const dbCategory = formatCategoryForQuery(categorySlug);
  
  console.log(`Searching for articles with category: ${dbCategory}`);

  const { data, error } = await supabase
    .from("ditorja_frontend")
    .select("*")
    .eq("article_category", dbCategory) // Use exact match now that we have correct format
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  console.log(`Found ${data.length} articles for category: ${dbCategory}`);
  return data as Article[];
}
