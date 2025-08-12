"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Props {
  category: Category;
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

  const subcategories = category.subcategories?.docs || [];

  return (
    <div className="relavite" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={dropdownRef}>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "px-4 bg-transparent border-transparent rounded-full hover:text-black hover:border-black text-black",
          isActive && !isNavigationHovered && "bg-white border-black",
          isOpen && "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]"
        )}>
          <Link href={`/${category.slug === 'all' ? "" : category.slug}`}>
            {category.name}
          </Link>

          {/* {category.subcategories && subcategories.length > 0 && ( */} {true && (
            <DropdownMenuContent>
              {subcategories.map(sub => (
                <DropdownMenuLabel>
                  <Link href="#">
                    Hellow
                  </Link>
                </DropdownMenuLabel>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  )
};

export default DropdownCategoryMenu;
