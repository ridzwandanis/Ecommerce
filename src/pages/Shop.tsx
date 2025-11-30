import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const filterType = searchParams.get("filter");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categorySlug);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Sync state with URL param
  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  const handleCategoryChange = (slug: string | null) => {
    setSelectedCategory(slug);
    // Remove filter when changing category to avoid confusion
    const newParams: any = {};
    if (slug) newParams.category = slug;
    setSearchParams(newParams);
  };

  const filteredProducts = products?.filter((product) => {
    // 1. Filter by Category
    if (selectedCategory) {
      const matchesCategory = product.category?.slug?.toLowerCase() === selectedCategory.toLowerCase() || 
                              product.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCategory) return false;
    }

    // 2. Filter by Type (Featured simulation)
    if (filterType === 'featured') {
      // Simulate featured products by picking those with even IDs or price > 100000
      // Using ID % 2 === 0 as a simple deterministic filter for demo
      return product.id % 2 !== 0; 
    }

    return true;
  });

  // Determine Page Title
  let pageTitle = "Semua Produk";
  if (selectedCategory) {
    pageTitle = categories?.find(c => c.slug === selectedCategory)?.name || "Produk";
  } else if (filterType === 'featured') {
    pageTitle = "Produk Unggulan";
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Header />
      <MobileHeader />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kategori</h3>
              {isLoadingCategories ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === null ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleCategoryChange(null)}
                  >
                    Semua Produk
                  </Button>
                  {categories?.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.slug ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryChange(category.slug)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Filter Sheet */}
          <div className="md:hidden mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Belanja</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filter Produk</SheetTitle>
                  <SheetDescription>
                    Pilih kategori untuk menyaring produk.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryChange(null)}
                    >
                      Semua Produk
                    </Button>
                    {categories?.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.slug ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange(category.slug)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 hidden md:block">
              <h1 className="text-3xl font-bold">
                {pageTitle}
              </h1>
              <p className="text-muted-foreground mt-2">
                Menampilkan {filteredProducts?.length || 0} produk
              </p>
            </div>

            {isLoadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] rounded-xl w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Tidak ada produk ditemukan dalam kategori ini.
                </p>
                <Button 
                  variant="link" 
                  onClick={() => handleCategoryChange(null)}
                  className="mt-4"
                >
                  Lihat semua produk
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Shop;
