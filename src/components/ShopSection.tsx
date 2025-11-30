import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ShopSection = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categories = useMemo(() => {
    if (!products) return ["Semua"];
    const cats = new Set(products.map((p) => p.category?.name).filter(Boolean));
    return ["Semua", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "Semua") return products;
    return products.filter((p) => p.category?.name === activeCategory);
  }, [products, activeCategory]);

  if (isLoading) {
    return (
      <section id="shop" className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl w-full" />
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
      <section id="shop" className="py-16 px-6 text-center text-destructive">
        Gagal memuat produk. Silakan coba lagi nanti.
      </section>
    );
  }

  return (
    <section id="shop" className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Koleksi Kami
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Jelajahi pilihan produk premium kami.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeCategory === category
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">
              Tidak ada produk dalam kategori ini.
            </p>
            <Button
              variant="link"
              onClick={() => setActiveCategory("Semua")}
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
