import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSettings,
  updateSettings,
  fetchProvinces,
  fetchCities,
  fetchDistricts,
  StoreSetting,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, MapPin, CheckCircle, Store, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<StoreSetting>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  // Location Queries for the FORM (active editing)
  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    staleTime: Infinity, // Cache forever during session to save API quota
  });

  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities", formData.storeProvinceId],
    queryFn: () => fetchCities(formData.storeProvinceId!),
    enabled: !!formData.storeProvinceId,
    staleTime: Infinity,
  });

  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ["districts", formData.storeCityId],
    queryFn: () => fetchDistricts(formData.storeCityId!),
    enabled: !!formData.storeCityId,
    staleTime: Infinity,
  });

  // Location Queries for the PREVIEW (Current DB State)
  const { data: previewCities, isLoading: isLoadingPreviewCities } = useQuery({
    queryKey: ["previewCities", settings?.storeProvinceId],
    queryFn: () => fetchCities(settings?.storeProvinceId!),
    enabled: !!settings?.storeProvinceId,
    staleTime: Infinity,
  });

  const { data: previewDistricts, isLoading: isLoadingPreviewDistricts } = useQuery({
    queryKey: ["previewDistricts", settings?.storeCityId],
    queryFn: () => fetchDistricts(settings?.storeCityId!),
    enabled: !!settings?.storeCityId,
    staleTime: Infinity,
  });


  // Helper to resolve names for the PREVIEW (Current DB State)
  const getProvinceName = (id?: string) =>
    provinces?.find((p: any) => String(p.id || p.province_id) === id)?.province ||
    id ||
    "-";
  
  // These helpers now take the actual list as argument
  const getCityName = (id?: string, cityList?: any[]) =>
    cityList?.find((c: any) => String(c.id || c.city_id) === id)?.city_name ||
    id ||
    "-";

  const getDistrictName = (id?: string, districtList?: any[]) =>
    districtList?.find((d: any) => String(d.id || d.subdistrict_id) === id)
      ?.subdistrict_name ||
    id ||
    "-";

  // Populate form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);
  
  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Pengaturan Disimpan",
        description: "Konfigurasi toko berhasil diperbarui.",
      });
    },
    onError: () =>
      toast({ title: "Gagal menyimpan", variant: "destructive" }),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      storeProvinceId: value,
      storeCityId: "", // Reset city
      storeDistrictId: "", // Reset district
    }));
  };

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      storeCityId: value,
      storeDistrictId: "", // Reset district
    }));
  };

  const handleDistrictChange = (value: string) => {
    setFormData((prev) => ({ ...prev, storeDistrictId: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  const isPreviewLoading = isLoading || isLoadingPreviewCities || isLoadingPreviewDistricts;

  if (isLoading) { // Use the main settings loading for initial page skeleton
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Toko</h2>
        <p className="text-muted-foreground">
          Kelola identitas, kontak, dan asal pengiriman toko Anda.
        </p>
      </div>

      {/* Live Preview Card */}
      <Card className="bg-muted/30 border-dashed border-primary/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-primary">
            <Store className="h-5 w-5" />
            Pratinjau Konfigurasi Langsung
          </CardTitle>
          <CardDescription>
            Ini adalah konfigurasi toko Anda yang tersimpan di database saat ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Identity Preview */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-gray-900">
                <CheckCircle className="h-4 w-4 text-green-600" /> Identitas & Kontak
              </h3>
              <div className="text-sm space-y-2 pl-6 border-l-2 border-gray-200">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Nama Toko
                  </span>
                  <span className="font-medium">
                    {settings?.storeName || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Email Dukungan
                  </span>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {settings?.supportEmail || "-"}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    WhatsApp
                  </span>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {settings?.whatsapp || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Preview */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-gray-900">
                <MapPin className="h-4 w-4 text-red-600" /> Asal Pengiriman
              </h3>
              <div className="text-sm space-y-2 pl-6 border-l-2 border-gray-200">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Alamat
                  </span>
                  <span className="font-medium">
                    {settings?.storeAddress || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Wilayah
                  </span>
                  <div className="font-medium">
                    {isPreviewLoading ? (
                      "Memuat Wilayah..."
                    ) : (
                      <>
                        {getDistrictName(settings?.storeDistrictId, previewDistricts)},{" "}
                        {getCityName(settings?.storeCityId, previewCities)}
                      </>
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {getProvinceName(settings?.storeProvinceId)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
            <CardDescription>Detail dasar tentang toko Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Nama Toko</Label>
              <Input
                id="storeName"
                name="storeName"
                value={formData.storeName || ""}
                onChange={handleChange}
                placeholder="Toko Keren Saya"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storeDescription">Deskripsi</Label>
              <Textarea
                id="storeDescription"
                name="storeDescription"
                value={formData.storeDescription || ""}
                onChange={handleChange}
                placeholder="Tempat terbaik untuk berbelanja."
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Origin */}
        <Card>
          <CardHeader>
            <CardTitle>Asal Pengiriman</CardTitle>
            <CardDescription>
              Atur dari mana produk dikirim (untuk perhitungan ongkos kirim).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storeAddress">Alamat Lengkap</Label>
              <Textarea
                id="storeAddress"
                name="storeAddress"
                value={formData.storeAddress || ""}
                onChange={handleChange}
                placeholder="Jl. Contoh No. 123..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Provinsi</Label>
                <Select
                  value={formData.storeProvinceId || ""}
                  onValueChange={handleProvinceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(provinces) &&
                      provinces.map((p: any) => (
                        <SelectItem
                          key={p.id || p.province_id}
                          value={String(p.id || p.province_id)}
                        >
                          {p.name || p.province}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kota/Kabupaten</Label>
                <Select
                  value={formData.storeCityId || ""}
                  onValueChange={handleCityChange}
                  disabled={!formData.storeProvinceId || isLoadingCities}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingCities ? "Memuat Kota..." : "Pilih Kota"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(cities) &&
                      cities.map((c: any) => (
                        <SelectItem
                          key={c.id || c.city_id}
                          value={String(c.id || c.city_id)}
                        >
                          {c.type} {c.name || c.city_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kecamatan</Label>
                <Select
                  value={formData.storeDistrictId || ""}
                  onValueChange={handleDistrictChange}
                  disabled={!formData.storeCityId || isLoadingDistricts}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingDistricts
                          ? "Memuat Kecamatan..."
                          : "Pilih Kecamatan"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(districts) &&
                      districts.map((d: any) => (
                        <SelectItem
                          key={d.id || d.subdistrict_id}
                          value={String(d.id || d.subdistrict_id)}
                        >
                          {d.name || d.subdistrict_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Gambar dan identitas visual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bannerUrl">URL Banner Utama</Label>
              <Input
                id="bannerUrl"
                name="bannerUrl"
                value={formData.bannerUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Ukuran yang disarankan: 1920x600px
              </p>
            </div>
            {formData.bannerUrl && (
              <div className="mt-2 rounded-md overflow-hidden h-32 w-full bg-muted">
                <img
                  src={formData.bannerUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="logoUrl">URL Logo (Opsional)</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social & Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Kontak & Media Sosial</CardTitle>
            <CardDescription>Bagaimana pelanggan dapat menghubungi Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp || ""}
                  onChange={handleChange}
                  placeholder="628123456789"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Email Dukungan</Label>
                <Input
                  id="supportEmail"
                  name="supportEmail"
                  value={formData.supportEmail || ""}
                  onChange={handleChange}
                  placeholder="support@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instagram">URL Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram || ""}
                  onChange={handleChange}
                  placeholder="https://instagram.com/myshop"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tiktok">URL TikTok</Label>
                <Input
                  id="tiktok"
                  name="tiktok"
                  value={formData.tiktok || ""}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/@myshop"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateSettingsMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettingsMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;