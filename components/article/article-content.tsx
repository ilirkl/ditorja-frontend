export function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose prose-gray max-w-none">
      <p>{content}</p>
    </div>
  )
}
