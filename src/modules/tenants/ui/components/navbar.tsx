"use client";

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="bg-white">
        <ShoppingCartIcon />
      </Button>
    ),
  }
);
interface Prop {
  slug: string;
}

export const Navbar = ({ slug }: Prop) => {
  const trpc = useTRPC();
  const { data: tenant } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({ slug })
  );
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center justify-between h-full px-4 lg:px-12">
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          {tenant.image?.url && (
            <Image
              src={tenant.image.url}
              width={32}
              height={32}
              alt={slug}
              className="rounded-full border shrink-0 size-[32px]"
            />
          )}
          <p className="text-xl">{tenant.name}</p>
        </Link>

        <CheckoutButton hideIfEmpty tenantSlug={slug} />
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl mx-auto) flex items-center justify-between h-full px-4 lg:px-12">
        <Button disabled className="bg-white">
          <ShoppingCartIcon />
        </Button>
      </div>
    </nav>
  );
};
