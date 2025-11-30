import { ShoppingBag, Menu, Search, Home, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const MobileHeader = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });
  const location = useLocation();

  const handleOpenCart = () => {
    setIsCartOpen(true);
  }

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Akun", icon: User, path: "/account" },
    { name: "Wishlist", icon: Heart, path: "#wishlist" }, // Placeholder for now
    { name: "Pencarian", icon: Search, path: "#search" }, // Placeholder for now
  ];

  return (
    <header className="md:hidden sticky top-0 z-50 flex items-center justify-between bg-background/80 px-4 py-2 backdrop-blur-md border-b border-border/50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="h-6 w-6 text-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-lg font-bold">
              {settings?.storeName || "Navigasi"}
            </SheetTitle>
            <SheetDescription className="sr-only">Main mobile navigation</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link to={item.path} key={item.name} className={`flex items-center gap-3 p-2 rounded-lg ${location.pathname === item.path ? 'bg-muted text-primary' : 'text-foreground hover:bg-muted'}`}>
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 border-t mt-4">
              <Link to="/login" className="flex items-center gap-3 p-2 rounded-lg text-foreground hover:bg-muted">
                <User className="h-5 w-5" />
                <span className="font-medium">Masuk</span>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      
      <h1 className="text-lg font-bold tracking-tight text-foreground">
        {settings?.storeName || "Aura"}
      </h1>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
          onClick={handleOpenCart}
        >
          <ShoppingBag className="h-6 w-6 text-foreground" />
          {itemCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default MobileHeader;