import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, ShieldCheck } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(Number(id)),
    enabled: !!id,
  });

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const newQuantity = quantity + delta;
    
    // Validation
    if (newQuantity < 1) return;
    if (product.type === "physical" && newQuantity > product.stock) return;
    
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;

    // We loop to add the quantity (since our simple cart context might add 1 by default, 
    // or we can just call it multiple times. Ideally cart context should accept quantity)
    // For now, we'll iterate or check if cart context supports quantity.
    // Checking context... usually addToCart just takes the product object.
    // To keep it simple and robust with current context:
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-6 py-12 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center flex-grow">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/")}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.type === "physical" && product.stock === 0;
  const isDigital = product.type === "digital";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-6 py-8 flex-grow">
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image */}
          <div className="relative group rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <img 
              src={product.image || "/placeholder.svg"} 
              alt={product.name} 
              className={`w-full h-full object-cover aspect-square ${isOutOfStock ? "grayscale opacity-75" : ""}`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-muted-foreground">{product.category}</Badge>
                {isDigital && <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Digital Download</Badge>}
                {!isOutOfStock && product.stock <= 5 && product.type === "physical" && (
                  <Badge variant="destructive" className="animate-pulse">Low Stock: {product.stock}</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-semibold text-primary">Rp {product.price.toLocaleString()}</p>
            </div>

            <Separator />

            <div className="prose prose-stone max-w-none text-gray-600">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4 pt-4">
              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                   <ShieldCheck className="h-4 w-4 text-green-600" />
                   <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                   <Check className="h-4 w-4 text-green-600" />
                   <span>Quality Guarantee</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-none" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 text-center font-medium">{quantity}</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-none" 
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.type === "physical" && quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button 
                  size="lg" 
                  className="h-12 flex-1 text-base" 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {isOutOfStock ? "Out of Stock" : `Add to Cart - Rp ${(product.price * quantity).toLocaleString()}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
