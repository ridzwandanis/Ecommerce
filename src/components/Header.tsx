import { Instagram, Twitter, ShoppingBag, Facebook, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Belanja", href: "#shop" },
    { label: "Tentang", href: "#about" },
    { label: "Kontak", href: "#contact" },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Avatar Section */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <Link to="/" className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage
                    src={settings?.logoUrl || "/placeholder.svg"}
                    alt="Store Logo"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {settings?.storeName?.substring(0, 2).toUpperCase() || "ST"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-lg font-semibold tracking-tight">
                  {settings?.storeName || "Microsite Shop"}
                </span>
              </Link>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Icons & Cart */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              {!isLoading && settings && (
                <>
                  {settings.instagram && (
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {settings.twitter && (
                    <a
                      href={settings.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {user ? (
              <Link to="/account">
                <Button variant="ghost" size="icon" title="My Account">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
