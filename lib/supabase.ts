import { createClient } from "@supabase/supabase-js"
import type { Article } from "@/types/article"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Helper function for slug generation
function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Unified article processing
function processArticle(article: any): Article {
  return {
    ...article,
    article_hashtags: article.article_hashtag?.split('\n') || [],
    status: article.status || 'normal',
    title_slug: article.title_slug || slugify(article.article_title),
    category_slug: article.category_slug || slugify(article.article_category)
  };
}

export async function getArticles() {
  try {
    const { data, error } = await supabase
      .from("ditorja_frontend")
      .select(`
        id,
        article_title,
        article_short,
        article_medium,
        article_large,
        article_image,
        article_category,
        category_slug,
        article_hashtag,
        created_at,
        status,
        title_slug
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching articles:", error.message)
      return []
    }

    return data.map(processArticle) as Article[]
  } catch (error: unknown) {
    console.error("Unexpected error fetching articles:", error)
    return []
  }
}

export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from("ditorja_frontend")
    .select(`
      id,
      article_title,
      article_short,
      article_medium,
      article_large,
      article_image,
      article_category,
      category_slug,
      article_hashtag,
      created_at,
      status,
      title_slug
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching article:", error.message)
    return null
  }

  return processArticle(data)
}

export async function getArticlesByCategory(categorySlug: string) {
  try {
    const { data, error } = await supabase
      .from("ditorja_frontend")
      .select(`
        id,
        article_title,
        article_short,
        article_medium,
        article_large,
        article_image,
        article_category,
        category_slug,
        article_hashtag,
        created_at,
        status,
        title_slug
      `)
      .ilike('category_slug', `%${categorySlug}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching articles by category:", error.message)
      return []
    }

    return data.map(processArticle) as Article[]
  } catch (error) {
    console.error("Unexpected error fetching articles by category:", error)
    return []
  }
}

export async function getArticlesBySearch(query: string): Promise<Article[]> {
  try {
    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const { data, error } = await supabase
      .from("ditorja_frontend")
      .select(`
        id,
        article_title,
        article_short,
        article_medium,
        article_large,
        article_image,
        article_category,
        category_slug,
        article_hashtag,
        created_at,
        status,
        title_slug
      `)
      .or(`article_title.ilike.%${normalizedQuery}%,article_short.ilike.%${normalizedQuery}%,article_medium.ilike.%${normalizedQuery}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Search error:", error);
      return [];
    }

    return data.map(processArticle) as Article[];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string | undefined) {
  if (!slug) {
    console.error("Invalid slug provided:", slug)
    return null
  }

  try {
    const { data, error } = await supabase
      .from("ditorja_frontend")
      .select(`
        id,
        article_title,
        article_short,
        article_medium,
        article_large,
        article_image,
        article_category,
        category_slug,
        article_hashtag,
        created_at,
        status,
        title_slug
      `)
      .eq("title_slug", slug)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Error fetching article by slug:", error.message)
      return null
    }

    return data ? processArticle(data) : null;
  } catch (error) {
    console.error("Unexpected error fetching article by slug:", error)
    return null
  }
}

// Simplified category formatting functions
export function formatCategorySlug(category: string): string {
  return slugify(category);
}

export function formatCategoryForQuery(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}