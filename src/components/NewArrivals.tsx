import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="pt-8">
        <div className="flex items-center justify-between px-4 mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-2/5 flex-shrink-0 aspect-[3/4] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  // Take latest 5 products
  const newProducts = products.slice(0, 5);

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-lg font-bold text-foreground">Terbaru</h3>
        <a href="#shop" className="text-sm font-medium text-primary hover:text-primary/80">
          Lihat semua
        </a>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {newProducts.map((product) => (
          <Link 
            to={`/product/${product.id}`} 
            key={product.id} 
            className="w-[40%] md:w-[200px] flex-shrink-0 snap-start group"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted mb-2 relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <h4 className="truncate text-sm font-semibold text-foreground">
              {product.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              Rp {product.price.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
