import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeaturedBanner = () => {
  return (
    <section className="w-full relative h-[350px] md:h-[500px] overflow-hidden">
      {/* Background Image - Using an image with clear space on the left */}
      <img
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
        alt="New Season Collection"
        className="w-full h-full object-cover object-center"
      />
      
      {/* Gradient Overlay - Ensures text is readable regardless of image brightness */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl text-white space-y-4 md:space-y-6 animate-in slide-in-from-left-10 fade-in duration-700">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-xs md:text-sm font-medium uppercase tracking-widest border border-white/30">
              Limited Edition
            </span>
            <h2 className="text-3xl md:text-6xl font-bold leading-tight">
              Urban <br/> Collection
            </h2>
            <p className="text-base md:text-xl text-gray-200 leading-relaxed max-w-md">
              Temukan gaya baru yang mendefinisikan karaktermu. Kualitas premium untuk tampilan yang tak lekang oleh waktu.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 rounded-none uppercase tracking-wider font-semibold mt-4"
            >
              <Link to="/shop">Lihat Koleksi</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBanner;
