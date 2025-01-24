import { createClient } from "@supabase/supabase-js"
import type { Article } from "@/types/article"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getArticles() {
  const { data, error } = await supabase.from("ditorja_frontend").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data.map((article: any) => ({
    ...article,
    article_hashtags: article.article_hashtags || []
  })) as Article[]
}

export async function getArticleById(id: string) {
  const { data, error } = await supabase.from("ditorja_frontend").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching article:", error)
    return null
  }

  return data as Article
}
