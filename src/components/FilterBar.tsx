import { useState } from "react";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { categories } from "@/data/boxes";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: "popular", label: "Plus populaires" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notés" },
  { value: "newest", label: "Nouveautés" },
];

const FilterBar = ({
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
}: FilterBarProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Filtrer:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "pill"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={cn(
                "transition-all duration-300",
                selectedCategory === category && "shadow-soft"
              )}
            >
              {category}
            </Button>
          ))}

          {categories.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-muted-foreground"
            >
              {showAllCategories ? "Moins" : `+${categories.length - 5}`}
            </Button>
          )}
        </div>
      </div>

      {/* Sort & Additional Filters */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">8</span> box disponibles
        </p>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {sortOptions.find((o) => o.value === sortOption)?.label}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    sortOption === option.value && "bg-accent font-medium"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {selectedCategory !== "All" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
            onClick={() => onCategoryChange("All")}
          >
            {selectedCategory}
            <span className="ml-1.5 text-muted-foreground">×</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
