import Link from "next/link"

export function CategoryHeader({ categorySlug }: { categorySlug: string }) {
  return (
    <div className="container py-2 ml-4">
      <h1 className="text-2xl font-bold mb-2  capitalize">
        Kategoria: {categorySlug.replace(/-/g, " ")}
      </h1>
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Kthehu në faqen kryesore
      </Link>
    </div>
  )
}
