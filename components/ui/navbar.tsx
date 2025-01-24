import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center pl-3.5">
          <Image
            src="/brand-logo.svg"
            alt="Logo"
            width={200}
            height={100}
            className="h-[50px] w-[200px]"
          />
        </Link>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
