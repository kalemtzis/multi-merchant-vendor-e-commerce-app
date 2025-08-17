"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// TODO: Fix to show subcategories propetly when click to a category

const CategoriesSidebar = ({ open, onOpenChange }: Props) => {
  const trpc = useTRPC();
  const { data: categories } = useQuery(trpc.categories.getMany.queryOptions());
  const session = useQuery(trpc.auth.session.queryOptions());

  const router = useRouter();

  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[0] | null
  >(null);

  const currentCategories = parentCategories ?? categories ?? [];
  
  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CategoriesGetManyOutput[0]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        router.push(`/${category.slug === "all" ? "" : category.slug}`);
      }
      handleOpenChange(false);
    }
  };

  return (
    <ScrollArea>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          style={{
            backgroundColor: selectedCategory?.color || "#F5F5F5",
          }}
          className="w-full"
        >
          <SheetHeader className="mb-4 border-b">
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>

          <div className="flex w-full flex-col items-start justify-center gap-8 pl-2 border-b pb-4 overflow-y-auto">
            {currentCategories?.map((category) => (
              <div
                className="w-full"
                key={category.slug}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg text-black">{category.name}</span>
                  {category.subcategories.length > 0 && <ChevronRightIcon />}
                </div>
              </div>
            ))}
          </div>

          <SheetFooter className="w-full">
            {session.data?.user ? (
              <div className="">
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
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
};

export default CategoriesSidebar;
