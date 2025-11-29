import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardOverview from "@/components/admin/DashboardOverview";
import ProductManager from "@/components/admin/ProductManager";
import OrderManager from "@/components/admin/OrderManager";

import SettingsManager from "@/components/admin/SettingsManager";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "settings">("dashboard");

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <DashboardOverview />}
      {activeTab === "products" && <ProductManager />}
      {activeTab === "orders" && <OrderManager />}
      {activeTab === "settings" && <SettingsManager />}
    </AdminLayout>
  );
};

export default Admin;
