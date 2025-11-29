import { Instagram, Twitter, Facebook } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const MobileHero = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const navLinks = ["Shop", "About", "Collections", "Contact"];

  if (isLoading) {
    return (
      <section className="md:hidden py-12 px-6 flex flex-col items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </section>
    );
  }

  return (
    <section className="md:hidden py-12 px-6">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Logo/Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={settings?.logoUrl || "/placeholder.svg"} alt="Store Logo" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-2xl">
              {settings?.storeName?.substring(0, 2).toUpperCase() || "ST"}
            </AvatarFallback>
          </Avatar>
          <span className="text-2xl font-bold tracking-tight">
            {settings?.storeName || "Store"}
          </span>
          <p className="text-sm text-muted-foreground max-w-xs">
            {settings?.storeDescription}
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-6">
           {settings?.instagram && (
            <a href={settings.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-6 w-6" />
            </a>
           )}
           {settings?.twitter && (
            <a href={settings.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-6 w-6" />
            </a>
           )}
           {settings?.facebook && (
             <a href={settings.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
               <Facebook className="h-6 w-6" />
             </a>
           )}
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 flex-wrap justify-center">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default MobileHero;