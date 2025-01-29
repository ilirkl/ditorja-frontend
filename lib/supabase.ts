import { createClient } from "@supabase/supabase-js";
import type { Article } from "@/types/article";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function for slug generation
function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Type for raw article input from Supabase
interface ArticleInput {
  id: string;
  article_title: string;
  article_short: string;
  article_medium: string;
  article_large: string;
  article_image: string;
  article_category: string;
  category_slug?: string;
  article_hashtag?: string;
  created_at: string;
  status?: "featured" | "normal" | "editors";  // Restrict status to specific values
  title_slug?: string;
}

// Unified article processing
function processArticle(article: ArticleInput): Article {
  return {
    ...article,
    article_hashtag: article.article_hashtag ? article.article_hashtag.split("\n") : [],
    status: article.status || "normal",
    title_slug: article.title_slug || slugify(article.article_title),
    category_slug: article.category_slug || slugify(article.article_category),
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
      .limit(10);

    if (error) {
      console.error("Error fetching articles:", error.message);
      return [];
    }

    return data.map(processArticle) as Article[];
  } catch (error: unknown) {
    console.error("Unexpected error fetching articles:", error);
    return [];
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
    .single();

  if (error) {
    console.error("Error fetching article:", error.message);
    return null;
  }

  return processArticle(data as ArticleInput);
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
      .ilike("category_slug", `%${categorySlug}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles by category:", error.message);
      return [];
    }

    return data.map(processArticle) as Article[];
  } catch (error) {
    console.error("Unexpected error fetching articles by category:", error);
    return [];
  }
}

export async function getArticlesBySearch(query: string): Promise<Article[]> {
  try {
    const normalizedQuery = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
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
      .or(
        `article_title.ilike.%${normalizedQuery}%,article_short.ilike.%${normalizedQuery}%,article_medium.ilike.%${normalizedQuery}%`
      )
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
    console.error("Invalid slug provided:", slug);
    return null;
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
      .single();

    if (error) {
      console.error("Error fetching article by slug:", error.message);
      return null;
    }

    return processArticle(data as ArticleInput);
  } catch (error) {
    console.error("Unexpected error fetching article by slug:", error);
    return null;
  }
}

export async function getRelatedArticles(currentArticle: Article, limit = 3): Promise<Article[]> {
  if (!currentArticle.article_hashtag || currentArticle.article_hashtag.length === 0) {
    return [];
  }

  try {
    const hashtagConditions = currentArticle.article_hashtag.map(hashtag => 
      `article_hashtag.ilike.%${hashtag.trim()}%`
    );

    const orCondition = `${hashtagConditions.join(',')}`;

    const { data, error } = await supabase
      .from("ditorja_frontend")
      .select(
        `id,
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
        title_slug`
      )
      .neq('id', currentArticle.id)
      .or(orCondition)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching related articles:", error.message);
      return [];
    }
    return data.map(processArticle) as Article[];
  } catch (error) {
    console.error("Unexpected error fetching related articles:", error);
    return [];
  }
}

export async function getCategories(): Promise<{ category: string; slug: string }[]> {
  try {
    const { data, error } = await supabase
      .from("ditorja_frontend")
      .select("article_category, category_slug") // Fetch both category name and slug
      .not("article_category", "eq", null) // Ensure no null values
      .order("article_category", { ascending: true })
      .limit(50); // Optional: Limit the number of categories

    if (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }

    // Extract unique categories and their slugs
    const uniqueCategories = Array.from(
      new Map(data.map((item) => [item.article_category, item])).values()
    );

    return uniqueCategories.map(({ article_category, category_slug }) => ({
      category: article_category,
      slug: category_slug || article_category.toLowerCase().replace(/\s+/g, "-"), // Fallback to generated slug if missing
    }));
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return [];
  }
}