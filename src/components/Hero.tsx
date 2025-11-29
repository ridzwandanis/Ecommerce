import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Hero = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  if (isLoading) {
    return <Skeleton className="hidden md:block w-full h-[500px]" />;
  }

  return (
    <section className="hidden md:block relative w-full h-[500px] bg-gray-100 overflow-hidden">
      {/* Background Image */}
      {settings?.bannerUrl ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        </div>
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-start px-6 text-white">
        <h1 className="text-5xl font-bold tracking-tight mb-4 max-w-2xl">
          {settings?.storeName || "Welcome to Our Shop"}
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-xl">
          {settings?.storeDescription || "Discover our latest collection of unique items."}
        </p>
        <Button size="lg" className="bg-white text-black hover:bg-white/90 border-none">
          Shop Now
        </Button>
      </div>
    </section>
  );
};

export default Hero;
