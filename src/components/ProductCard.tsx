import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, AlertCircle, Download } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  type: "physical" | "digital";
}

const ProductCard = ({ id, name, price, image, category, stock, type }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if clicked on the button
    e.stopPropagation();
    
    if (stock > 0 || type === "digital") {
      addToCart({ id, name, price, image, category, stock, type });
    }
  };

  const isOutOfStock = type === "physical" && stock === 0;
  const isLowStock = type === "physical" && stock > 0 && stock <= 5;
  const isDigital = type === "digital";

  return (
    <Link to={`/product/${id}`} className="block h-full">
      <Card className={cn(
        "group overflow-hidden border-border bg-card transition-all hover:shadow-lg h-full flex flex-col",
        isOutOfStock && "opacity-75"
      )}>
        <div className="relative w-full aspect-square overflow-hidden bg-muted">
          <img
            src={image || "https://via.placeholder.com/400x400?text=No+Image"}
            alt={name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              !isOutOfStock && "group-hover:scale-105",
              isOutOfStock && "grayscale"
            )}
          />
          
          {/* Stock Status & Type Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {isDigital && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium shadow-md flex items-center gap-1 w-fit">
                <Download className="w-3 h-3" />
                Digital
              </span>
            )}

            {!isOutOfStock && isLowStock && (
               <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium shadow-md flex items-center gap-1 w-fit">
                <AlertCircle className="w-3 h-3" />
                Only {stock} left
              </span>
            )}
          </div>
          
          {isOutOfStock && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-10">
               <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg rotate-12 border-2 border-white">
                Sold Out
              </span>
            </div>
          )}
          
          {/* Add to Cart Button (Overlay) */}
          {!isOutOfStock && (
            <Button
              size="icon"
              className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100 bg-primary text-primary-foreground shadow-lg z-20"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
            <div className="mb-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="mt-auto pt-2">
               <p className="text-base md:text-lg font-bold text-foreground">Rp {price.toLocaleString()}</p>
            </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;