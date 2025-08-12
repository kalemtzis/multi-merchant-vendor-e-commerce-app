"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
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
      className="p-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={dropdownRef}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className={cn(
            "px-4 bg-transparent border-transparent rounded-full hover:text-black hover:border-black text-black",
            isActive && !isNavigationHovered && "bg-white border-black",
            isOpen &&
              "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]"
          )}
        >
          <Button asChild variant='ghost'>
            <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
              {category.name}
            </Link>
          </Button>

          {category.subcategories && subcategories.length > 0 && (
            <DropdownMenuContent
              className="mt-4"
              style={{
                backgroundColor: category.color || "#F5F5F5",
              }}
            >
              {subcategories.map((sub) => (
                <DropdownMenuLabel key={sub.id}>
                  <Link href={`/${category.slug}/${sub.slug}`}>
                    <span className="underline">{sub.name}</span>
                  </Link>
                </DropdownMenuLabel>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
};

export default DropdownCategoryMenu;
