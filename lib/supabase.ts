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
      if (error instanceof Error) {
      console.error("Error fetching articles:", error.message)
    } else {
      console.error("Unexpected error fetching articles:", error)
    }
      return []
    }


    return data.map((article: any) => {
      // Handle both article_hashtags (array) and article_hashtag (string) formats
      const hashtags = article.article_hashtags || 
        (article.article_hashtag ? article.article_hashtag.split('\n') : []);
      
      // Normalize category slug to ensure consistency
      const normalizedCategorySlug = article.category_slug || 
        article.article_category
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      return {
        ...article,
        article_hashtags: hashtags,
        status: article.status || 'normal',
        title_slug: article.title_slug || article.article_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category_slug: normalizedCategorySlug
      };
    }) as Article[]
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching articles:", error.message)
    } else {
      console.error("Unexpected error fetching articles:", error)
    }
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

  return {
    ...data,
    article_hashtags: data.article_hashtag ? data.article_hashtag.split('\n') : [],
    status: data.status || 'normal',
    title_slug: data.title_slug || data.article_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  } as Article
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
      .eq('category_slug', categorySlug)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching articles by category:", error.message)
      return []
    }

    return data.map((article: any) => ({
      ...article,
      article_hashtags: article.article_hashtag ? article.article_hashtag.split('\n') : [],
      status: article.status || 'normal',
      title_slug: article.title_slug || article.article_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    })) as Article[]
  } catch (error) {
    console.error("Unexpected error fetching articles by category:", error)
    return []
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

    if (!data) {
      console.error("No article found with slug:", slug)
      return null
    }

    return {
      ...data,
      article_hashtags: data.article_hashtag ? data.article_hashtag.split('\n') : [],
      status: data.status || 'normal',
      category_slug: data.category_slug
    } as Article
  } catch (error) {
    console.error("Unexpected error fetching article by slug:", error)
    return null
  }
}
