import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const currentYear = new Date().getFullYear();

  if (isLoading) {
    return <div className="py-12 container bg-muted/10"><Skeleton className="h-40 w-full" /></div>;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{settings?.storeName || "Microsite Shop"}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {settings?.storeDescription || "Your one-stop shop for amazing digital and physical products."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <div className="space-y-3 text-sm">
              {settings?.whatsapp && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{settings.whatsapp}</span>
                </div>
              )}
              {settings?.supportEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{settings.supportEmail}</span>
                </div>
              )}
              
              {/* Social Media Icons Row */}
              <div className="flex gap-4 pt-2">
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings?.twitter && (
                  <a href={settings.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} {settings?.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
