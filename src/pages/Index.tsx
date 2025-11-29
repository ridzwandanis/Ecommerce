import Header from "@/components/Header";
import MobileHero from "@/components/MobileHero";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ShopSection from "@/components/ShopSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileHero />
      <Hero />
      <main className="flex-grow">
        <Features />
        <ShopSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
