import { Truck, ShieldCheck, RefreshCw, Clock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over Rp 500k",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure payment gateway",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support team",
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg hover:bg-white hover:shadow-sm transition-all">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
