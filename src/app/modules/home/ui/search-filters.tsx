"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import SearchInput from "./search-input";
import CategoriesBar from "./categories-bar";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput />
      <div className="hidden lg:block">
        <CategoriesBar />
      </div>
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
    backgroundColor: "#F5F5F5"
  }}>
    <SearchInput />
    <div className="hidden lg:block">
      <Skeleton className="h-11 w-full" />
    </div>
  </div>;
};
