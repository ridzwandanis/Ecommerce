import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartSheet = () => {
  const { items, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm">
                  Looks like you haven't added anything yet.
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-secondary/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-foreground">
                        <h3 className="line-clamp-2 mr-2">{item.name}</h3>
                        <p className="ml-4">Rp {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.category?.name || "Umum"}</p>

                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 pt-4">
            <Separator />
            <div className="space-y-1.5">
              <div className="flex justify-between text-base font-medium text-foreground">
                <p>Subtotal</p>
                <p>Rp {total.toLocaleString()}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
            <Button className="w-full h-12 text-base" onClick={handleCheckout}>
              Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
