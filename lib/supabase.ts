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
        article_hashtag,
        created_at,
        status
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
      
      return {
        ...article,
        article_hashtags: hashtags,
        status: article.status || 'normal'
      };
    }) as Article[]
  } catch (error) {
    console.error("Error fetching articles:", error.message)
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
      article_hashtag,
      created_at,
      status
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
    status: data.status || 'normal'
  } as Article
}
