import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { BlogPost } from "@/lib/api";

interface BlogPostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: BlogPost | null;
  onSubmit: (data: Partial<BlogPost>) => void;
  isSubmitting: boolean;
}

const BlogPostForm = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: BlogPostFormProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<
    Partial<BlogPost>
  >({
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      isPublished: true,
    },
  });

  const isPublished = watch("isPublished");

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          title: initialData.title,
          excerpt: initialData.excerpt || "",
          content: initialData.content,
          image: initialData.image || "",
          category: initialData.category || "",
          isPublished: initialData.isPublished,
        });
      } else {
        reset({
          title: "",
          excerpt: "",
          content: "",
          image: "",
          category: "",
          isPublished: true,
        });
      }
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Artikel" : "Tambah Artikel Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Ubah detail artikel di sini."
              : "Isi detail untuk membuat artikel baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              {...register("title", { required: true })}
              placeholder="Contoh: Tren Fashion 2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              {...register("category")}
              placeholder="Contoh: Fashion, Tips, Lifestyle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Gambar Artikel</Label>
            <ImageUpload
              value={watch("image") || ""}
              onChange={(url) =>
                setValue("image", url, { shouldValidate: true })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="Ringkasan singkat artikel..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Konten Artikel</Label>
            <Textarea
              id="content"
              {...register("content", { required: true })}
              placeholder="Tulis isi artikel di sini..."
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Mendukung teks biasa (Markdown support coming soon).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
            />
            <Label htmlFor="isPublished">Publikasikan</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
