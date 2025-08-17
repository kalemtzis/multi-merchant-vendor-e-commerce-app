import { SearchParams } from "nuqs";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { loadProductFilters } from "@/modules/products/search-params";
import { getQueryClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    tenantSlug: slug,
    limit:DEFAULT_LIMIT
  }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ProductListView tenantSlug={slug} narrowView />
      </Suspense>
    </HydrationBoundary>
  )
};

export default Page;
