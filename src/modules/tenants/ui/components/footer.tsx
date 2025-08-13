import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["700"]
})

const Footer = () => {
  return (
    <div className="border-t font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center gap-2 py-6 h-full px-4 lg:px-12">
        <p>Powered by </p>
        <Link href="/">
          <span className={cn("text-2xl font-semibold", poppins.className)}>Eshop</span>
        </Link>
      </div>
    </div>
  )
}

export default Footer
