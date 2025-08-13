"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import Link from "next/link";
import { useState, useRef } from "react";

interface Props {
  category: CategoriesGetManyOutput[0];
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

const DropdownCategoryMenu = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => setIsOpen(false);

  const subcategories = category.subcategories || [];

  return (
    <div
      className="my-2"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "bg-transparent border-transparent rounded-full hover:text-black hover:border-black text-black p-2",
              isActive && !isNavigationHovered && "bg-white border-black",
              isOpen &&
                "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]"
            )}
          >
            <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
              {category.name}
            </Link>
          </div>
        </DropdownMenuTrigger>

        {category.subcategories && subcategories.length > 0 && (
          <DropdownMenuContent
            className="mt-2"
            style={{
              backgroundColor: category.color || "#F5F5F5",
            }}
          >
            {subcategories.map((sub) => (
              <DropdownMenuItem asChild key={sub.id}>
                <Link href={`/${category.slug}/${sub.slug}`}>
                  <span className="underline">{sub.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
};

export default DropdownCategoryMenu;
