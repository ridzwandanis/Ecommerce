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
    return (
      <div className="px-4 pt-4 md:p-0">
        <Skeleton className="w-full h-64 md:h-[500px] rounded-xl md:rounded-none" />
      </div>
    );
  }

  return (
    <section className="px-4 pt-4 md:p-0">
      <div className="relative w-full h-64 md:h-[500px] bg-gray-100 overflow-hidden rounded-xl md:rounded-none">
        {/* Background Image */}
        {settings?.bannerUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${settings.bannerUrl})` }}
          >
            {/* Gradient Overlay for Mobile/Desktop Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end md:justify-center items-start p-6 md:container md:mx-auto md:px-6 text-white">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-1 md:mb-4 max-w-2xl leading-tight">
            {settings?.storeName || "New Collection"}
          </h2>
          <p className="text-sm md:text-xl text-gray-200 md:text-white/90 mb-4 md:mb-8 max-w-xs md:max-w-xl line-clamp-2 md:line-clamp-none">
            {settings?.storeDescription ||
              "Discover the latest trends in minimalist fashion."}
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 border-none rounded-full px-6 hidden md:inline-flex"
          >
            Belanja Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
