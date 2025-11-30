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
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  stock: number;
  type: "physical" | "digital";
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  stock,
  type,
}: ProductCardProps) => {
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
    <Link to={`/product/${id}`} className="group block h-full">
      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800",
          isOutOfStock && "opacity-75"
        )}
      >
        <img
          src={image || "https://via.placeholder.com/400x600?text=No+Image"}
          alt={name}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500",
            !isOutOfStock && "group-hover:scale-105",
            isOutOfStock && "grayscale"
          )}
        />

        {/* Stock Status & Type Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isDigital && (
            <span className="bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-medium shadow-sm flex items-center gap-1 w-fit">
              <Download className="w-3 h-3" />
              Digital
            </span>
          )}

          {!isOutOfStock && isLowStock && (
            <span className="bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-medium shadow-sm flex items-center gap-1 w-fit">
              <AlertCircle className="w-3 h-3" />
              Sisa {stock}
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Habis
            </span>
          </div>
        )}

        {/* Add to Cart Button (Floating) */}
        {!isOutOfStock && (
          <Button
            size="icon"
            className="absolute bottom-3 right-3 opacity-100 md:opacity-0 md:translate-y-4 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:text-primary shadow-sm hover:shadow-md z-20 h-9 w-9 rounded-full border border-gray-100"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Rp {price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
