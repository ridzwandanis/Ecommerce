import { useState, useMemo } from "react"; // activeCategory and categories are not needed anymore
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ShopSection = () => {
  // const [activeCategory, setActiveCategory] = useState("Semua"); // No longer needed

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // const categories = useMemo(() => { // No longer needed
  //   if (!products) return ["Semua"];
  //   const cats = new Set(products.map((p) => p.category?.name).filter(Boolean));
  //   return ["Semua", ...Array.from(cats)];
  // }, [products]);

  // const filteredProducts = useMemo(() => { // No longer needed, just show all or a slice
  //   if (!products) return [];
  //   if (activeCategory === "Semua") return products;
  //   return products.filter((p) => p.category?.name === activeCategory);
  // }, [products, activeCategory]);

  if (isLoading) {
    return (
      <section id="shop" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-xl w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="shop" className="py-16 px-4 md:px-6 text-center text-destructive">
        Gagal memuat produk. Silakan coba lagi nanti.
      </section>
    );
  }

  return (
    <section id="shop" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-10 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900">
            Sedang Tren
          </h2>
          <Button variant="link" className="text-sm font-medium p-0 h-auto">
            Lihat semua
          </Button>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">
              Tidak ada produk ditemukan.
            </p>
            <Button
              variant="link"
              onClick={() => {}} // No category filter to reset
              className="mt-2"
            >
              Lihat semua produk
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;
