import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createOrder,
  fetchProvinces,
  fetchCities,
  fetchDistricts,
  calculateShippingCost,
  Order,
  CreateOrderInput,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Truck, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cart, total: cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  // Form State
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(
    user?.name?.split(" ").slice(1).join(" ") || ""
  );
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Shipping State
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [courier, setCourier] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFirstName(user.name.split(" ")[0]);
      setLastName(user.name.split(" ").slice(1).join(" "));
    }
  }, [user]);

  // Queries
  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
  });

  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities", provinceId],
    queryFn: () => fetchCities(provinceId),
    enabled: !!provinceId && provinceId !== "undefined",
  });

  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ["districts", cityId],
    queryFn: () => fetchDistricts(cityId),
    enabled: !!cityId && cityId !== "undefined",
  });

  // Mutations
  const calculateCostMutation = useMutation({
    mutationFn: calculateShippingCost,
    onSuccess: (data) => {
      // RajaOngkir returns array of shipping options directly
      // Format: [{ name, code, service, description, cost, etd }]
      if (Array.isArray(data) && data.length > 0) {
        setShippingOptions(data);
        toast({
          title: "Shipping calculated",
          description: "Please select a service.",
        });
      } else {
        // Reset shipping options if no data
        setShippingOptions([]);
        setSelectedService("");
        setShippingCost(0);
        toast({
          title: "Unavailable",
          description:
            "This courier is not available for selected destination.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      // Reset shipping options on error
      setShippingOptions([]);
      setSelectedService("");
      setShippingCost(0);
      toast({
        title: "Error",
        description: "This courier is not available for selected destination.",
        variant: "destructive",
      });
    },
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast({
        title: "Order placed!",
        description: `Order #${data.id} has been created successfully.`,
      });
      clearCart();
      navigate("/account"); // Redirect to dashboard
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "There was a problem creating your order.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleCalculateShipping = () => {
    if (!districtId || !courier) {
      toast({
        title: "Missing info",
        description: "Please select district and courier.",
        variant: "destructive",
      });
      return;
    }

    // Calculate Total Weight (Default 1000g if missing)
    const totalWeight = cart.reduce(
      (acc, item) => acc + item.quantity * ((item as any).weight || 1000),
      0
    );

    calculateCostMutation.mutate({
      origin: "1527", // Default Store Location: Betara (ID 1527 found via scan)
      destination: districtId,
      weight: totalWeight,
      courier: courier,
    });
  };

  const handleServiceChange = (serviceName: string) => {
    const service = shippingOptions.find((s) => s.service === serviceName);
    if (service) {
      setSelectedService(serviceName);
      // RajaOngkir format: { cost: number } not { cost: [{ value: number }] }
      const cost =
        typeof service.cost === "number"
          ? service.cost
          : service.cost[0]?.value || 0;
      setShippingCost(cost);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return;
    if (!selectedService && cart.some((i) => i.type === "physical")) {
      toast({
        title: "Shipping required",
        description: "Please select a shipping service.",
        variant: "destructive",
      });
      return;
    }

    const finalTotal = cartTotal + shippingCost;

    const orderData: CreateOrderInput = {
      email,
      firstName,
      lastName,
      address,
      city:
        cities?.find((c: any) => String(c.id || c.city_id) === cityId)?.name ||
        cities?.find((c: any) => String(c.id || c.city_id) === cityId)
          ?.city_name ||
        cityId,
      postalCode,
      total: finalTotal,
      subtotal: cartTotal,
      shippingCost: shippingCost,
      shippingCourier: courier,
      shippingService: selectedService,
      items: cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    orderMutation.mutate(orderData);
  };

  const hasPhysicalItems = cart.some((item) => item.type === "physical");

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-6">
              <form id="checkout-form" onSubmit={handleSubmit}>
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address"
                      />
                    </div>

                    {hasPhysicalItems && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Province</Label>
                            <Select onValueChange={setProvinceId}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Province" />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces && provinces.length > 0 ? (
                                  provinces
                                    .filter((p: any) => p.id || p.province_id)
                                    .map((p: any) => (
                                      <SelectItem
                                        key={p.id || p.province_id}
                                        value={String(p.id || p.province_id)}
                                      >
                                        {p.name || p.province}
                                      </SelectItem>
                                    ))
                                ) : (
                                  <div className="p-2 text-sm text-muted-foreground text-center">
                                    Loading data...
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Select
                              onValueChange={setCityId}
                              disabled={!provinceId}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    isLoadingCities
                                      ? "Loading..."
                                      : "Select City"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {cities && cities.length > 0 ? (
                                  cities.map((c: any) => (
                                    <SelectItem
                                      key={c.id || c.city_id}
                                      value={String(c.id || c.city_id)}
                                    >
                                      {c.type} {c.name || c.city_name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-muted-foreground text-center">
                                    {provinceId
                                      ? "Loading cities..."
                                      : "Select province first"}
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* District Selection */}
                        <div className="space-y-2">
                          <Label>District (Kecamatan)</Label>
                          <Select
                            onValueChange={setDistrictId}
                            disabled={!cityId}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isLoadingDistricts
                                    ? "Loading..."
                                    : "Select District"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {districts && districts.length > 0 ? (
                                districts.map((d: any) => (
                                  <SelectItem
                                    key={d.id || d.subdistrict_id}
                                    value={String(d.id || d.subdistrict_id)}
                                  >
                                    {d.name || d.subdistrict_name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                  {cityId
                                    ? "Loading districts..."
                                    : "Select city first"}
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                {hasPhysicalItems && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Shipping Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                          <Label>Courier</Label>
                          <Select
                            onValueChange={(value) => {
                              setCourier(value);
                              // Reset shipping options when courier changes
                              setShippingOptions([]);
                              setSelectedService("");
                              setShippingCost(0);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Courier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jne">JNE</SelectItem>
                              <SelectItem value="tiki">TIKI</SelectItem>
                              <SelectItem value="pos">POS Indonesia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          onClick={handleCalculateShipping}
                          disabled={calculateCostMutation.isPending}
                        >
                          {calculateCostMutation.isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Check Cost"
                          )}
                        </Button>
                      </div>

                      {shippingOptions.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <Label>Select Service</Label>
                          <Select onValueChange={handleServiceChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Service" />
                            </SelectTrigger>
                            <SelectContent>
                              {shippingOptions.map((option: any) => (
                                <SelectItem
                                  key={option.service}
                                  value={option.service}
                                >
                                  {option.service} - Rp{" "}
                                  {(typeof option.cost === "number"
                                    ? option.cost
                                    : option.cost[0]?.value || 0
                                  ).toLocaleString()}{" "}
                                  ({option.etd})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </form>
            </div>

            {/* Right Column: Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span>
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rp {cartTotal.toLocaleString()}</span>
                    </div>
                    {hasPhysicalItems && (
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                          {shippingCost > 0
                            ? `Rp ${shippingCost.toLocaleString()}`
                            : "-"}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>
                        Rp {(cartTotal + shippingCost).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    type="submit"
                    form="checkout-form"
                    disabled={orderMutation.isPending}
                  >
                    {orderMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
