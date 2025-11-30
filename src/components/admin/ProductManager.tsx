import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/ProductForm";

const ProductManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Product Management State
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsProductFormOpen(false);
      toast({
        title: "Produk dibuat",
        description: "Produk baru berhasil ditambahkan.",
      });
    },
    onError: () =>
      toast({ title: "Gagal membuat produk", variant: "destructive" }),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsProductFormOpen(false);
      setEditingProduct(null);
      toast({
        title: "Produk diperbarui",
        description: "Detail produk diperbarui.",
      });
    },
    onError: () =>
      toast({ title: "Gagal memperbarui produk", variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Produk dihapus",
        description: "Produk berhasil dihapus.",
      });
    },
    onError: () =>
      toast({ title: "Gagal menghapus produk", variant: "destructive" }),
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleProductSubmit = (data: Partial<Product>) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produk</h2>
          <p className="text-muted-foreground">Kelola katalog produk Anda.</p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isProductsLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Memuat produk...
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada produk ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>#{product.id}</TableCell>
                  <TableCell>
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell>
                    Rp {Number(product.price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm ${
                        product.stock === 0
                          ? "text-red-500 font-bold"
                          : product.stock <= 5
                          ? "text-orange-500 font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {product.stock} unit
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {(product as any).weight || 1000}g
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductForm
        open={isProductFormOpen}
        onOpenChange={setIsProductFormOpen}
        initialData={editingProduct}
        onSubmit={handleProductSubmit}
        isSubmitting={
          createProductMutation.isPending || updateProductMutation.isPending
        }
        categories={categories || []}
      />
    </div>
  );
};

export default ProductManager;
