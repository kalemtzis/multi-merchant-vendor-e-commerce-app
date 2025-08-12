"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Props {
  category: Category;
  isActive: boolean;
  isNavigationHovered: boolean;
}

const DropdownCategoryMenu = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200); // Slightly longer delay for better UX
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get subcategories from the category object
  const subcategories = category.subcategories?.docs || [];

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        className={cn(
          "h-11 px-4 rounded-full transition-all duration-200",
          isActive && "border border-black bg-white"
        )}
        asChild
      >
        <Link href={`/${category.slug}`}>{category.name}</Link>
      </Button>

      {category.subcategories && isNavigationHovered && (
        <div
          className="absolute top-full left-0 mt-2 min-w-[200px] p-2 rounded-md shadow-lg border z-50 bg-white"
          style={{
            backgroundColor: category.color || "#F5F5F5",
            minWidth: 'max-content',
          }}
        >
          {subcategories.map((subcategory) => {
            // Handle both string and Category types
            const subcategoryData = typeof subcategory === 'string' 
              ? { id: subcategory, name: subcategory, slug: subcategory }
              : subcategory;
            
            return (
              <Link 
                key={subcategoryData.id}
                href={`/${category.slug}/${subcategoryData.slug}`}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-white/20 transition-colors text-sm whitespace-nowrap"
              >
                {subcategoryData.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownCategoryMenu;
