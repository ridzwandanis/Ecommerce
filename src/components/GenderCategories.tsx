import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GenderCategories = () => {
  return (
    <section className="w-full grid grid-cols-2 gap-0">
      {/* Pria Section */}
      <div className="relative h-[300px] md:h-[600px] group overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200" 
          alt="Fashion Pria" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors flex flex-col items-center justify-end text-center p-2 md:p-4 pb-10 md:pb-20">
          <h2 className="text-xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-widest uppercase drop-shadow-md">
            Pria
          </h2>
          <p className="text-white/90 mb-6 text-sm md:text-lg max-w-md hidden md:block">
            Tampil maskulin dengan koleksi terbaru kami.
          </p>
          <Button 
            asChild 
            className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-4 text-xs md:h-auto md:px-8 md:py-6 md:text-base uppercase tracking-wider font-semibold transition-all md:hover:px-10"
          >
            <Link to="/shop?category=men">Belanja Pria</Link>
          </Button>
        </div>
      </div>

      {/* Wanita Section */}
      <div className="relative h-[300px] md:h-[600px] group overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200" 
          alt="Fashion Wanita" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors flex flex-col items-center justify-end text-center p-2 md:p-4 pb-10 md:pb-20">
          <h2 className="text-xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-widest uppercase drop-shadow-md">
            Wanita
          </h2>
          <p className="text-white/90 mb-6 text-sm md:text-lg max-w-md hidden md:block">
             Elegansi dan gaya untuk setiap momen.
          </p>
          <Button 
            asChild 
            className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-4 text-xs md:h-auto md:px-8 md:py-6 md:text-base uppercase tracking-wider font-semibold transition-all md:hover:px-10"
          >
            <Link to="/shop?category=women">Belanja Wanita</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GenderCategories;