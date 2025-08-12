"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoriesSidebar = ({ open, onOpenChange }: Props) => {
  const trpc = useTRPC();
  const { data: categories } = useQuery(trpc.categories.getMany.queryOptions());
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <ScrollArea>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" style={{
          
        }}>
          <SheetHeader>
            <SheetTitle className="mb-4 border-b">Categories</SheetTitle>
            <SheetDescription asChild>
              <div className="flex flex-col items-start justify-center gap-8">
                {categories?.map((category) => (
                  <Link
                    href={`/${category.slug}`}
                    className=""
                    key={category.slug}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-black">{category.name}</span>
                      {category.parent && <ArrowRightIcon />}
                    </div>
                  </Link>
                ))}
              </div>
            </SheetDescription>
            <SheetFooter>
              {session.data?.user ? (
                <div className="flex h-full">
                  <Button
                    asChild
                    variant="secondary"
                    className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-sm"
                  >
                    <Link href="/admin">
                      {/* TODO: After you logout from payload backend ui you dont redirect to the homepage but in the payload sign in page */}
                      Dashboard
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full rounded-none bg-white hover:bg-pink-400 transition-colors text-sm"
                  >
                    <Link prefetch href="/sign-in">
                      Log In
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="secondary"
                    className="w-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-sm"
                  >
                    <Link prefetch href="/sign-up">
                      Start Selling
                    </Link>
                  </Button>
                </div>
              )}
            </SheetFooter>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
};

export default CategoriesSidebar;
