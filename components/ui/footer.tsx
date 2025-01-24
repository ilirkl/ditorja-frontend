import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            &copy; 2025 Ditorja. All rights reserved.
          </p>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}
