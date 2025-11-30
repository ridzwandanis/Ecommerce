import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, Category } from "@/lib/api";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Product | null;
  onSubmit: (data: Partial<Product>) => void;
  isSubmitting: boolean;
  categories: Category[];
}

const ProductForm = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  categories,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    categoryId: undefined,
    image: "/placeholder.svg",
    description: "",
    stock: 0,
    type: "physical",
    fileUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        categoryId: initialData.categoryId,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        price: 0,
        categoryId: undefined,
        image: "/placeholder.svg",
        description: "",
        stock: 0,
        type: "physical",
        fileUrl: "",
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure categoryId is a number
    if (!formData.categoryId) {
      alert("Mohon pilih kategori");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Ubah detail produk di sini."
              : "Isi detail untuk membuat produk baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.categoryId?.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stok</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Berat (gram)</Label>
              <Input
                id="weight"
                type="number"
                value={(formData as any).weight || 1000}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: Number(e.target.value),
                  } as any)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Gambar Produk</Label>
            <ImageUpload
              value={formData.image || ""}
              onChange={(url) => setFormData({ ...formData, image: url })}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
