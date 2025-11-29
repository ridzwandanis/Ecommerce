import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings, StoreSetting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
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
      toast({ title: "Settings saved", description: "Store configuration updated successfully." });
    },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-[400px] w-full" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Store Settings</h2>
        <p className="text-muted-foreground">Manage your store identity and contacts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Basic details about your shop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input 
                id="storeName" 
                name="storeName" 
                value={formData.storeName || ""} 
                onChange={handleChange} 
                placeholder="My Awesome Shop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea 
                id="storeDescription" 
                name="storeDescription" 
                value={formData.storeDescription || ""} 
                onChange={handleChange} 
                placeholder="The best place to buy stuff."
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Images and visual identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bannerUrl">Hero Banner URL</Label>
              <Input 
                id="bannerUrl" 
                name="bannerUrl" 
                value={formData.bannerUrl || ""} 
                onChange={handleChange} 
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-xs text-muted-foreground">Recommended size: 1920x600px</p>
            </div>
            {formData.bannerUrl && (
              <div className="mt-2 rounded-md overflow-hidden h-32 w-full bg-muted">
                <img src={formData.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
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
            <CardTitle>Contact & Social Media</CardTitle>
            <CardDescription>How customers can reach you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input 
                  id="whatsapp" 
                  name="whatsapp" 
                  value={formData.whatsapp || ""} 
                  onChange={handleChange} 
                  placeholder="628123456789"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input 
                  id="supportEmail" 
                  name="supportEmail" 
                  value={formData.supportEmail || ""} 
                  onChange={handleChange} 
                  placeholder="support@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input 
                  id="instagram" 
                  name="instagram" 
                  value={formData.instagram || ""} 
                  onChange={handleChange} 
                  placeholder="https://instagram.com/myshop"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tiktok">TikTok URL</Label>
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
            {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
