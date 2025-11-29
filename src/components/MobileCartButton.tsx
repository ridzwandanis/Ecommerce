import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const MobileCartButton = () => {
  const { itemCount, setIsCartOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingBag className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs font-bold text-destructive-foreground flex items-center justify-center border-2 border-background">
          {itemCount}
        </span>
      </Button>
    </div>
  );
};

export default MobileCartButton;
