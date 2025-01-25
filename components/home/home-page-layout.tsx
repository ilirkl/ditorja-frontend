import { ReactNode } from "react"

export function HomePageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container px-4 py-6">
      <div className="space-y-12">
        {children}
      </div>
    </div>
  )
}
