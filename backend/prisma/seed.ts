import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid duplicates
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.storeSetting.deleteMany(); // Clear settings to re-seed default

  const products = [
    // PHYSICAL PRODUCTS
    {
      name: "Minimal Ceramic Vase",
      price: 89,
      category: "Home Decor",
      image: "https://images.unsplash.com/photo-1616075114704-df820a45050f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "A beautiful, handcrafted ceramic vase perfect for any modern home.",
      stock: 15,
      type: "physical"
    },
    {
      name: "Organic Cotton Tote Bag",
      price: 45,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1591564536733-4f938d212260?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Durable and stylish tote bag made from 100% organic cotton.",
      stock: 50,
      type: "physical"
    },
    {
      name: "Brass Desk Lamp",
      price: 159,
      category: "Lighting",
      image: "https://images.unsplash.com/photo-1542861219-c6bb16790b07?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Elegant brass lamp that adds a touch of sophistication to your workspace.",
      stock: 5,
      type: "physical"
    },
    {
      name: "Minimalist Leather Wallet",
      price: 75,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1558913962-e64e59174154?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Slim and functional wallet made from genuine leather.",
      stock: 20,
      type: "physical"
    },
    {
      name: "Handmade Ceramic Mug",
      price: 32,
      category: "Kitchenware",
      image: "https://images.unsplash.com/photo-1596728073842-8321487216a6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Unique ceramic mug, perfect for your morning coffee or tea.",
      stock: 30,
      type: "physical"
    },
    {
      name: "Scented Soy Candle",
      price: 28,
      category: "Home Fragrance",
      image: "https://images.unsplash.com/photo-1627916599184-e91bf8858348?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Natural soy wax candle with calming lavender scent.",
      stock: 40,
      type: "physical"
    },
    
    // DIGITAL PRODUCTS
    {
      name: "Minimalist Icon Pack",
      price: 15,
      category: "Digital Assets",
      image: "https://images.unsplash.com/photo-1510525000782-b36e399c27b0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "A collection of 100+ minimalist icons for your next project. (Instant Download)",
      stock: 999,
      type: "digital",
      fileUrl: "https://example.com/download/icons.zip"
    },
    {
      name: "Monthly Planner PDF",
      price: 9,
      category: "Digital Productivity",
      image: "https://images.unsplash.com/photo-1522046907572-ec104d509f6e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Printable monthly planner to keep you organized. (PDF Format)",
      stock: 999,
      type: "digital",
      fileUrl: "https://example.com/download/planner.pdf"
    },
     {
      name: "Abstract Wall Art (4K)",
      price: 25,
      category: "Digital Art",
      image: "https://images.unsplash.com/photo-1581403341630-a6e0c38f5f6b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "High-resolution abstract digital art for printing or wallpaper.",
      stock: 999,
      type: "digital",
      fileUrl: "https://example.com/download/art.jpg"
    },
    {
      name: "Music Production Sample Pack",
      price: 49,
      category: "Digital Audio",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469e3775?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "High-quality samples and loops for music producers.",
      stock: 999,
      type: "digital",
      fileUrl: "https://example.com/download/samples.zip"
    }
  ];

  console.log('Start seeding products...');
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(`Created ${createdProduct.type} product: ${createdProduct.name}`);
  }

  // Seed default StoreSetting if it doesn't exist
  let settings = await prisma.storeSetting.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.storeSetting.create({
      data: {
        id: 1,
        storeName: "My Awesome Shop",
        storeDescription: "The best place to buy amazing products, both physical and digital.",
        logoUrl: "https://images.unsplash.com/photo-1627883921381-80ae601b045f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        bannerUrl: "https://images.unsplash.com/photo-1522204523234-8729aa67e16d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        whatsapp: "628123456789",
        instagram: "https://instagram.com/micrositeshop",
        facebook: "https://facebook.com/micrositeshop",
        twitter: "https://twitter.com/micrositeshop",
        tiktok: "https://tiktok.com/@micrositeshop",
        supportEmail: "support@micrositeshop.com"
      }
    });
    console.log(`Created default store settings.`);
  } else {
    console.log('Store settings already exist.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });