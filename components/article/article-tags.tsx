import { Badge } from "@/components/ui/badge"

export function ArticleTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="third">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
