import React from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: "dashboard" | "products" | "categories" | "orders" | "settings";
  onTabChange: (
    tab: "dashboard" | "products" | "categories" | "orders" | "settings"
  ) => void;
}

const AdminLayout = ({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Panel Admin
          </h2>
          <p className="text-sm text-gray-500 mt-1">Kelola toko Anda</p>
        </div>

        <nav className="p-4 space-y-2">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "products" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("products")}
          >
            <Package className="mr-2 h-4 w-4" />
            Produk
          </Button>

          <Button
            variant={activeTab === "categories" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("categories")}
          >
            <FolderTree className="mr-2 h-4 w-4" />
            Kategori
          </Button>

          <Button
            variant={activeTab === "orders" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("orders")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pesanan
          </Button>

          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("settings")}
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
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
