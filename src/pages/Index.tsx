import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Hero from "@/components/Hero";
import GenderCategories from "@/components/GenderCategories";
import Features from "@/components/Features";
import ShopSection from "@/components/ShopSection";
import FeaturedBanner from "@/components/FeaturedBanner";
import RunningTextBanner from "@/components/RunningTextBanner";
import CategoryGrid from "@/components/CategoryGrid";
import NewArrivals from "@/components/NewArrivals";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      {/* Headers */}
      <Header />
      <MobileHeader />

      {/* Hero Section */}
      <Hero />

      <main className="flex-grow space-y-2 md:space-y-8">
        {/* Mobile Specific Sections */}
        <div className="md:hidden">
          <CategoryGrid />
          <NewArrivals />
        </div>
        <GenderCategories />

        {/* Features (Desktop Only - to keep mobile clean) */}
        <div className="hidden md:block">
          <Features />
        </div>

        {/* Main Shop Grid (Trending Now) */}
        <div className="pt-4 md:pt-0">
          <ShopSection />
        </div>
        
        <FeaturedBanner />

        <RunningTextBanner />
            </main>
      
            <Footer />
            
            <BottomNav />    </div>
  );
};

export default Index;
