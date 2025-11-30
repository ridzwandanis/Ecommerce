import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, ShoppingBag, AlertTriangle, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardOverview = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
  });

  if (isLoading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>;
  }

  if (error) {
    return <div className="text-red-500">Gagal memuat data ringkasan.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ringkasan Toko</h2>
        <p className="text-muted-foreground">Ringkasan performa toko Anda.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {stats?.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Pendapatan keseluruhan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Pesanan keseluruhan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Produk dengan &le; 5 item</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div> 
            {/* We didn't fetch total products count explicitly, but that's fine for now */}
            <p className="text-xs text-muted-foreground">Dalam katalog</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Pendapatan (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.revenueChart}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp${value/1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, "Pendapatan"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString("id-ID")}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats?.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{order.firstName}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    +Rp {order.total.toLocaleString()}
                  </div>
                </div>
              ))}
              {stats?.recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada pesanan.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
