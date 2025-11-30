import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardOverview from "@/components/admin/DashboardOverview";
import ProductManager from "@/components/admin/ProductManager";
import CategoryManager from "@/components/admin/CategoryManager";
import OrderManager from "@/components/admin/OrderManager";
import SettingsManager from "@/components/admin/SettingsManager";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "categories" | "orders" | "settings"
  >("dashboard");

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <DashboardOverview />}
      {activeTab === "products" && <ProductManager />}
      {activeTab === "categories" && <CategoryManager />}
      {activeTab === "orders" && <OrderManager />}
      {activeTab === "settings" && <SettingsManager />}
    </AdminLayout>
  );
};

export default Admin;
