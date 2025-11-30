import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Shirt, Footprints, Watch, Glasses, LayoutGrid } from "lucide-react";

const CategoryGrid = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Helper to get icon based on category name (simple heuristic)
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("baju") || lower.includes("pakaian") || lower.includes("shirt")) return Shirt;
    if (lower.includes("sepatu") || lower.includes("kaki") || lower.includes("shoes")) return Footprints;
    if (lower.includes("jam") || lower.includes("watch")) return Watch;
    if (lower.includes("kacamata") || lower.includes("glasses")) return Glasses;
    return LayoutGrid;
  };

  if (isLoading) {
    return (
      <div className="px-4 pt-8 md:px-0 md:pt-0"> {/* Adjusted padding for desktop */}
        <Skeleton className="h-6 w-32 mb-4 md:mb-0" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"> {/* Horizontal scroll skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center gap-2"> {/* Fixed width for skeleton items */}
              <Skeleton className="h-14 w-14 rounded-xl" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no categories, showing some dummies or nothing
  if (!categories || categories.length === 0) return null;

  // Take top 4 categories for the grid or more for scroll
  const displayCategories = categories.slice(0, 8); // Display more for scroll

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-0"> {/* Adjusted padding for desktop */}
      <h3 className="text-lg font-bold text-foreground mb-4 md:hidden">Kategori</h3> {/* Hide title on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory text-center">
        {displayCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          return (
            <a
              key={cat.id}
              href={`#shop?category=${cat.id}`} // Simple link anchor for now
              className="group flex-shrink-0 w-20 snap-center flex flex-col items-center gap-2"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10">
                <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate w-full">
                {cat.name}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
