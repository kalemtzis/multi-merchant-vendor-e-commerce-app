"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { navItems } from "../constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
});

const Navbar = () => {
  const pathname = usePathname();

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="flex items-center justify-between border-b border-black">
      {/* Logo */}
      <Button asChild variant="ghost">
        <Link href="/">
          <span className={cn("text-2xl font-bold", poppins.className)}>
            Eshop
          </span>
        </Link>
      </Button>

      {/* Nav Items */}
      <div className="hidden lg:flex items-center justify-center gap-8">
        {navItems.map(({ href, name }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-2 rounded-full hover:shadow-black hover:shadow-sm",
              pathname === href && "shadow-black shadow-sm"
            )}
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Buttons */}
      {session.data?.user ? (
        <div className="hidden lg:flex h-full">
          <Button
            asChild
            variant="secondary"
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
          >
            <Link href="/admin">
              {/* TODO: After you logout from payload backend ui you dont redirect to the homepage but in the payload sign in page */}
              Dashboard
            </Link>
          </Button>
        </div>
      ) : (
        <div className="hidden lg:flex">
          <Button
            asChild
            variant="secondary"
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
          >
            <Link prefetch href="/sign-in">
              Log In
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
          >
            <Link prefetch href="/sign-up">
              Start Selling
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
