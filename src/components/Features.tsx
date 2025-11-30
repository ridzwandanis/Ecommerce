import { Truck, ShieldCheck, RefreshCw, Clock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Gratis Ongkir",
    description: "Untuk pembelian di atas Rp 500.000",
  },
  {
    icon: ShieldCheck,
    title: "Pembayaran Aman",
    description: "100% terjamin keamanannya",
  },
  {
    icon: RefreshCw,
    title: "Mudah Dikembalikan",
    description: "Garansi 30 hari pengembalian",
  },
  {
    icon: Clock,
    title: "Layanan 24/7",
    description: "Tim support siap membantu",
  },
];

const Features = () => {
  return (
    <section className="py-8 md:py-12 bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-2 md:space-y-3 p-3 md:p-4 rounded-lg bg-white shadow-sm md:shadow-none md:hover:bg-white md:hover:shadow-sm transition-all border border-gray-100 md:border-none"
            >
              <div className="p-2 md:p-3 bg-primary/10 text-primary rounded-full">
                <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
