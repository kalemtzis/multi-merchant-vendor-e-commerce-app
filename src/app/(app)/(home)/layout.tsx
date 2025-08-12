import Footer from "@/modules/home/ui/footer";
import Navbar from "@/modules/home/ui/navbar";
import {
  SearchFilters,
  SearchFiltersSkeleton,
} from "@/modules/home/ui/search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <main className="flex-1 bg-[#F4F4F0]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
