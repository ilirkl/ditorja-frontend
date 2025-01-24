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
  console.log("Fetching articles from Supabase...")
  console.log("Using URL:", supabaseUrl)
  console.log("Using Key:", supabaseKey)
  
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
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      console.log("Table schema:", await supabase.rpc('get_table_schema', { table_name: 'ditorja_frontend' }))
      return []
    }

    console.log("Supabase connection successful")
    // Check table existence by attempting to fetch metadata
    // Directly attempt to query the table with schema prefix
    const { data: tableInfo, error: tableError } = await supabase
      .from('ditorja_frontend')
      .select('*')
      .limit(1)
      
    if (tableError) {
      console.error("Table access error:", {
        message: tableError.message,
        code: tableError.code,
        details: tableError.details,
        hint: tableError.hint
      })
      return []
    }
    
    console.log("Table access successful")

    // Get detailed row count
    const { count } = await supabase
      .from('ditorja_frontend')
      .select('*', { count: 'exact', head: true })
    console.log("Row count:", count)
    console.log("Articles fetched:", data)

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
      article_hashtag,
      created_at,
      status
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching article:", error)
    return null
  }

  return {
    ...data,
    article_hashtags: data.article_hashtag ? data.article_hashtag.split('\n') : [],
    status: data.status || 'normal'
  } as Article
}
