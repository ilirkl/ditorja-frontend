export type Article = {
  id: string
  article_title: string
  article_short: string
  article_medium: string
  article_large: string
  article_image: string
  article_category: string
  category_slug: string
  article_hashtag: string[]
  created_at: string
  status: "featured" | "normal" | "editors"
  title_slug: string
}
