"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category })
  );

  return <div>{JSON.stringify(products)}</div>;
};

export const ProductListSkeleton = () => <div>Loading...</div>;
