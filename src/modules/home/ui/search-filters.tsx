"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import SearchInput from "./search-input";
import CategoriesBar from "./categories-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import BreadcrumbNav from "./breadcrumb-nav";
import { Category } from "@/payload-types";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryData = data.find((cat) => cat.slug === activeCategory);
  const activeCategoryColor = activeCategoryData?.color || "#F5F5F5";
  const activeCategoryName = activeCategoryData?.name;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName = 
    activeCategoryData?.subcategories.find(
      (sub) => sub.slug === activeSubcategory
    )?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: activeCategoryColor,
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <CategoriesBar categories={data as Category[]} />
      </div>
      <BreadcrumbNav categoryName={activeCategoryName} category={activeCategory} subcategoryName={activeSubcategoryName} />
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#F5F5F5",
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
};
