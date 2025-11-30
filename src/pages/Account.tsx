import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders, Order } from "@/lib/api";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Package, User, LogOut, Eye, MapPin, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Account = () => {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
    enabled: !!user, // Only fetch if user is logged in
  });

  // Protect route
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [isAuthLoading, user, navigate]);

  if (isAuthLoading) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "paid":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Header />
      <MobileHeader />

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-12 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Profile */}
          <aside className="w-full md:w-1/4 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content: Orders */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Order History
              </h2>
              <p className="text-muted-foreground">
                View and track your past orders.
              </p>
            </div>

            {isOrdersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : orders?.length === 0 ? (
              <Card className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Start shopping to see your orders here.
                  </p>
                  <Button onClick={() => navigate("/")} className="mt-2">
                    Browse Products
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <Card
                    key={order.id}
                    className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="bg-muted/40 p-4 border-b flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">
                            Order Placed
                          </span>
                          <span className="font-medium">
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">
                            Total
                          </span>
                          <span className="font-medium">
                            Rp {Number(order.total).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">
                            Order #
                          </span>
                          <span className="font-medium">{order.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getStatusColor(order.status)}
                          variant="secondary"
                        >
                          {order.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hidden md:flex"
                        >
                          <Eye className="mr-2 h-4 w-4" /> Details
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                              {item.product?.image && (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm line-clamp-1">
                                {item.product?.name || "Unknown Product"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="font-medium text-sm">
                              Rp {Number(item.price).toLocaleString()}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-6">
                  <div>
                    <DialogTitle className="text-xl">
                      Order #{selectedOrder.id}
                    </DialogTitle>
                    <DialogDescription>
                      Placed on{" "}
                      {format(new Date(selectedOrder.createdAt), "PPP p")}
                    </DialogDescription>
                  </div>
                  <Badge
                    className={getStatusColor(selectedOrder.status)}
                    variant="secondary"
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Items List */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Items
                  </h4>
                  <div className="border rounded-lg divide-y">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 flex items-center gap-4"
                      >
                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0 border">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Number(item.price).toLocaleString()} x{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="font-semibold text-sm">
                          Rp{" "}
                          {(
                            Number(item.price) * item.quantity
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Shipping Info */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Shipping Details
                    </h4>
                    <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-1">
                      <p className="font-medium">
                        {selectedOrder.firstName} {selectedOrder.lastName}
                      </p>
                      <p className="text-muted-foreground">
                        {selectedOrder.address}
                      </p>
                      <p className="text-muted-foreground">
                        {selectedOrder.city}, {selectedOrder.postalCode}
                      </p>
                      <p className="text-muted-foreground mt-2">
                        {selectedOrder.email}
                      </p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Payment Summary
                    </h4>
                    <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>
                          Rp{" "}
                          {Number(
                            (selectedOrder as any).subtotal ||
                              selectedOrder.total
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>
                          {(selectedOrder as any).shippingCost ? (
                            <div className="text-right">
                              <div>
                                Rp{" "}
                                {Number(
                                  (selectedOrder as any).shippingCost
                                ).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {(
                                  selectedOrder as any
                                ).shippingCourier?.toUpperCase()}{" "}
                                - {(selectedOrder as any).shippingService}
                              </div>
                            </div>
                          ) : (
                            "Free"
                          )}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                          Rp {Number(selectedOrder.total).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
};

export default Account;
