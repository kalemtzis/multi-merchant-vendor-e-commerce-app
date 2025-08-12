"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState, useCallback } from "react";
import DropdownCategoryMenu from "./dropdown-category-menu";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import { useParams } from "next/navigation";
import CategoriesSidebar from "./categories-sidebar";
import { ListFilterIcon } from "lucide-react";

interface Props {
  data: Category[];
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

  const calculateVisible = useCallback(() => {
    if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
      return;
    }

    // Force a reflow to ensure accurate measurements
    containerRef.current.offsetHeight;

    const containerWidth = containerRef.current.offsetWidth;
    const viewAllWidth = viewAllRef.current.offsetWidth;
    const availableWidth = containerWidth - viewAllWidth - 32; // Add more padding for safety

    if (availableWidth <= 0) {
      setVisibleCount(1);
      return;
    }

    const items = Array.from(measureRef.current.children);
    let totalWidth = 0;
    let visible = 0;

    for (const item of items) {
      const itemWidth = (item as HTMLElement).offsetWidth;

      if (totalWidth + itemWidth > availableWidth) {
        break;
      }
      totalWidth += itemWidth;
      visible++;
    }

    // Ensure at least one category is visible
    setVisibleCount(Math.max(1, visible));
  }, []);

  useEffect(() => {
    // Initial calculation with multiple attempts to ensure DOM is ready
    let attempts = 0;
    const maxAttempts = 5;

    const attemptCalculation = () => {
      if (attempts >= maxAttempts) {
        console.warn(
          "Failed to calculate visible categories after",
          maxAttempts,
          "attempts"
        );
        return;
      }

      if (containerRef.current && measureRef.current && viewAllRef.current) {
        calculateVisible();
      } else {
        attempts++;
        setTimeout(attemptCalculation, 100);
      }
    };

    attemptCalculation();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize events
      setTimeout(calculateVisible, 50);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize
    const handleResize = () => {
      setTimeout(calculateVisible, 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [data, calculateVisible]);

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
          visibility: "hidden",
        }}
        ref={measureRef}
      >
        {/* TODO: Hardcoded All button */}

        {data.map((category) => (
          <div key={category.id}>
            <DropdownCategoryMenu
              category={category as Category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-center gap-2 overflow-hidden"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        ref={containerRef}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <DropdownCategoryMenu
              category={category as Category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

        <div ref={viewAllRef}>
          <Button
            size="sm"
            variant="elevated"
            className={cn(
              "hover:bg-white bg-transparent border-transparent rounded-full text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-black"
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
