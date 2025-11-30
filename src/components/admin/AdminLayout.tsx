import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

type TabType = "dashboard" | "products" | "categories" | "orders" | "settings";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const AdminLayout = ({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const handleTabClick = (tab: TabType) => {
    onTabChange(tab);
    setIsMobileOpen(false); // Close mobile menu on click
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Panel Admin
        </h2>
        <p className="text-sm text-gray-500 mt-1">Kelola toko Anda</p>
      </div>

      <nav className="p-4 space-y-2 flex-grow">
        <Button
          variant={activeTab === "dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabClick("dashboard")}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Ringkasan
        </Button>

        <Button
          variant={activeTab === "products" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabClick("products")}
        >
          <Package className="mr-2 h-4 w-4" />
          Produk
        </Button>

        <Button
          variant={activeTab === "categories" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabClick("categories")}
        >
          <FolderTree className="mr-2 h-4 w-4" />
          Kategori
        </Button>

        <Button
          variant={activeTab === "orders" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabClick("orders")}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Pesanan
        </Button>

        <Button
          variant={activeTab === "settings" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabClick("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Pengaturan
        </Button>
      </nav>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <NavContent />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg">Panel Admin</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-65px)] md:h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;