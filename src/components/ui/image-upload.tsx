import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  disabled,
  className,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Get token for auth - check both storages as admin might use different token key
      const token = localStorage.getItem("adminToken") || localStorage.getItem("authToken");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengupload gambar. Pastikan konfigurasi R2 benar dan Anda login.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative h-40 w-40 rounded-lg overflow-hidden border border-border bg-muted">
            <img src={value} alt="Upload" className="h-full w-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="h-40 w-40 rounded-lg border border-dashed border-border flex items-center justify-center bg-muted/50">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Pilih Gambar
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Format: JPG, PNG, WEBP. Max 5MB.
          </p>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
};
