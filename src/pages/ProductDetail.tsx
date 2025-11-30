import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingBag, ArrowLeft, Share2, ShieldCheck, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator"; // Added missing import

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, itemCount } = useCart();
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

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    toast({
      title: "Berhasil ditambahkan",
      description: `${quantity}x ${product.name} masuk keranjang.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-[50vh] w-full rounded-b-3xl" />
        <div className="container px-4 space-y-4 w-full">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Produk tidak ditemukan</h2>
        <p className="text-muted-foreground mb-6">
          Produk yang Anda cari mungkin sudah dihapus atau tidak tersedia.
        </p>
        <Button onClick={() => navigate("/")}>Kembali ke Toko</Button>
      </div>
    );
  }

  const isOutOfStock = product.type === "physical" && product.stock === 0;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Sticky Minimal Header */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-md border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 hover:bg-muted"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Button>
        <h1 className="flex-1 text-center text-base font-semibold truncate px-4 text-foreground">
          {product.name}
        </h1>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 hover:bg-muted"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary border border-background" />
            )}
          </Button>
        </div>
      </div>

      <main className="flex-grow pb-32 md:pb-12 pt-0 md:pt-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Image Gallery */}
            <div className="w-full md:sticky md:top-24">
              <div className="relative aspect-[3/4] md:aspect-square w-full overflow-hidden rounded-2xl bg-muted border border-border/50">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className={`h-full w-full object-cover transition-opacity duration-500 ${
                    isOutOfStock ? "grayscale opacity-75" : ""
                  }`}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                      Stok Habis
                    </span>
                  </div>
                )}
                {/* Carousel Indicators (Static for now) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50 shadow-sm" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50 shadow-sm" />
                </div>
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="flex flex-col space-y-6 md:pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-muted-foreground font-normal">
                    {product.category?.name || "Umum"}
                  </Badge>
                  <Button variant="ghost" size="icon" className="rounded-full -mr-2 text-muted-foreground hover:text-foreground">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-end gap-3 pt-2">
                  <p className="text-3xl font-semibold text-primary">
                    Rp {product.price.toLocaleString()}
                  </p>
                  {product.type === "physical" && product.stock <= 5 && !isOutOfStock && (
                    <p className="text-sm text-orange-600 font-medium mb-1.5 animate-pulse">
                      Tersisa {product.stock} lagi!
                    </p>
                  )}
                </div>
              </div>

              <Separator className="hidden md:block" />

              {/* Desktop Actions Section */}
              <div className="hidden md:flex flex-col gap-6">
                 {!isOutOfStock && (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-border rounded-lg bg-card">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-none rounded-l-lg hover:bg-muted"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center font-semibold text-base">
                        {quantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-none rounded-r-lg hover:bg-muted"
                        onClick={() => handleQuantityChange(1)}
                        disabled={product.type === "physical" && quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      size="lg"
                      className="flex-1 h-11 text-base font-bold shadow-sm"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Tambah ke Keranjang
                    </Button>
                  </div>
                 )}
                 
                 {/* Trust Badges (Desktop) */}
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span>Pembayaran Aman</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>Jaminan Kualitas</span>
                    </div>
                 </div>
              </div>

              {/* Mobile Quantity (Hidden on Desktop since it's included above) */}
              <div className="md:hidden mt-4 flex items-center justify-between border-y border-border py-4">
                <span className="text-sm font-medium">Jumlah</span>
                <div className="flex items-center gap-4">
                   <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-semibold w-4 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.type === "physical" && quantity >= product.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                </div>
              </div>

              {/* Description & Details Accordion */}
              <div className="pt-2">
                <Accordion type="single" collapsible defaultValue="desc" className="w-full">
                  <AccordionItem value="desc">
                    <AccordionTrigger className="text-base font-semibold">
                      Deskripsi Produk
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description || "Tidak ada deskripsi untuk produk ini."}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="shipping">
                    <AccordionTrigger className="text-base font-semibold">
                      Pengiriman & Pengembalian
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-2">
                      <p>
                        • Pengiriman gratis untuk pembelian di atas Rp 500.000.
                      </p>
                      <p>
                        • Estimasi pengiriman 2-5 hari kerja tergantung lokasi.
                      </p>
                      <p>
                        • Garansi pengembalian 7 hari jika produk cacat atau tidak sesuai.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border p-4">
        <Button
          size="lg"
          className="w-full rounded-xl text-base font-bold shadow-lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? (
            "Stok Habis"
          ) : (
            <>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Tambah - Rp {(product.price * quantity).toLocaleString()}
            </>
          )}
        </Button>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
