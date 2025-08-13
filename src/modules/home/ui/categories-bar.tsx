"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState, useCallback } from "react";
import DropdownCategoryMenu from "./dropdown-category-menu";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import { useParams } from "next/navigation";
import CategoriesSidebar from "./categories-sidebar";
import { ListFilterIcon } from "lucide-react";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  data: CategoriesGetManyOutput;
}

const CategoriesBar = ({ data }: Props) => {
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(data.length);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const params = useParams();

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryIndex = data?.findIndex(
    (cat) => cat.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) break;

        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect()
  }, [data.length]);

  return (
    <div className="relative w-full">
      {/* Categories Sidebar */}
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Hidden measurement div */}
      <div
        className="absolute opacity-0 pointer-events-none flex"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,  
        }}
        ref={measureRef}
      >
        {/* TODO: Hardcoded All button */}

        {data.map((category) => (
          <div key={category.id}>
            <DropdownCategoryMenu
              category={category as CategoriesGetManyOutput[0]}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      <div
        className="flex flex-nowrap items-center justify-center gap-2"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        ref={containerRef}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id} className="shrink-0">
            <DropdownCategoryMenu
              category={category as CategoriesGetManyOutput[0]}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

        <div ref={viewAllRef} className="shrink-0">
          <Button
            size="sm"
            variant="elevated"
            className={cn(
              "hover:bg-white bg-transparent border-transparent rounded-full text-black",
              isActiveCategoryHidden && !isAnyHovered && "bg-white border-black"
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesBar;
