import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-me";

// RajaOngkir Config
const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL =
  process.env.RAJAONGKIR_BASE_URL || "https://rajaongkir.komerce.id/api/v1";

// Cloudflare R2 Config
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Interfaces
interface ProductInput {
  name: string;
  price: number;
  categoryId: number;
  image: string;
  description?: string;
  stock: number;
  weight?: number;
  type: string;
  fileUrl?: string;
}

interface OrderItemInput {
  id: number; // This is productId
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItemInput[];
  total: number;
  subtotal?: number;
  shippingCost?: number;
  shippingCourier?: string;
  shippingService?: string;
}

interface StoreSettingInput {
  storeName: string;
  storeDescription?: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  supportEmail?: string;
  storeAddress?: string;
  storeProvinceId?: string;
  storeCityId?: string;
  storeDistrictId?: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- AUTH MIDDLEWARE ---
const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  // Legacy Admin Check (Keep this for existing admin frontend until updated)
  if (token === "admin-session-token") {
    req.user = { userId: 0, email: "admin@local", role: "admin" };
    return next();
  }

  // JWT Check
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// --- RAJAONGKIR PROXY WITH CACHING ---

// 1. Get Provinces
app.get("/api/rajaongkir/provinces", async (req, res) => {
  try {
    // A. Check Database
    const cachedProvinces = await prisma.province.findMany();

    if (cachedProvinces.length > 0) {
      // Return cached data formatted like RajaOngkir
      return res.json(
        cachedProvinces.map((p) => ({
          province_id: p.id,
          province: p.name,
          id: p.id, // Keep 'id' for generic usage
          name: p.name,
        }))
      );
    }

    // B. Fetch from API (If DB empty)
    if (!RAJAONGKIR_API_KEY)
      return res.status(500).json({ error: "API Key not configured" });

    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/province`,
      { headers: { key: RAJAONGKIR_API_KEY } }
    );

    const provincesData = response.data.rajaongkir?.results || [];

    // C. Save to Database
    if (provincesData.length > 0) {
      await prisma.province.createMany({
        data: provincesData.map((p: any) => ({
          id: p.province_id,
          name: p.province,
        })),
        skipDuplicates: true,
      });
    }

    res.json(provincesData);
  } catch (error: any) {
    console.error(
      "RajaOngkir Province Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch provinces",
      details: error.message,
    });
  }
});

// 2. Get Cities by Province
app.get("/api/rajaongkir/cities/:provinceId", async (req, res) => {
  const { provinceId } = req.params;
  try {
    // A. Check Database
    const cachedCities = await prisma.city.findMany({
      where: { provinceId: provinceId },
    });

    if (cachedCities.length > 0) {
      return res.json(
        cachedCities.map((c) => ({
          city_id: c.id,
          province_id: c.provinceId,
          city_name: c.name,
          type: c.type,
          postal_code: c.postalCode,
          // Aliases
          id: c.id,
          name: c.name,
        }))
      );
    }

    // B. Fetch from API
    if (!RAJAONGKIR_API_KEY)
      return res.status(500).json({ error: "API Key not configured" });

    console.log(`Fetching cities for province: ${provinceId} from API...`);
    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/city/${provinceId}`,
      { headers: { key: RAJAONGKIR_API_KEY } }
    );

    const citiesData = response.data.rajaongkir?.results || [];

    // C. Save to Database
    // Ensure Province Exists first (Foreign Key constraint)
    // (Usually fetchProvinces runs first, but just in case)
    const provinceExists = await prisma.province.findUnique({
      where: { id: provinceId },
    });
    if (!provinceExists && citiesData.length > 0) {
      // If province doesn't exist locally, we can't save cities yet due to FK.
      // We just return data without caching, or we could fetch province.
      // For simplicity/safety, we just return data.
      // Ideally, seed provinces first.
      console.warn(
        `Province ${provinceId} not found in DB. Skipping cache for cities.`
      );
      return res.json(citiesData);
    }

    if (citiesData.length > 0) {
      await prisma.city.createMany({
        data: citiesData.map((c: any) => ({
          id: c.city_id,
          provinceId: c.province_id,
          name: c.city_name,
          type: c.type,
          postalCode: c.postal_code,
        })),
        skipDuplicates: true,
      });
    }

    res.json(citiesData);
  } catch (error: any) {
    console.error(
      "RajaOngkir City Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch cities",
      details: error.message,
    });
  }
});

// 3. Get Districts by City
app.get("/api/rajaongkir/districts/:cityId", async (req, res) => {
  const { cityId } = req.params;
  try {
    // A. Check Database
    const cachedDistricts = await prisma.district.findMany({
      where: { cityId: cityId },
    });

    if (cachedDistricts.length > 0) {
      return res.json(
        cachedDistricts.map((d) => ({
          subdistrict_id: d.id,
          city_id: d.cityId,
          subdistrict_name: d.name,
          // Aliases
          id: d.id,
          name: d.name,
        }))
      );
    }

    // B. Fetch from API
    if (!RAJAONGKIR_API_KEY)
      return res.status(500).json({ error: "API Key not configured" });

    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/district/${cityId}`,
      { headers: { key: RAJAONGKIR_API_KEY } }
    );

    const districtsData = response.data.rajaongkir?.results || [];

    // C. Save to Database
    const cityExists = await prisma.city.findUnique({ where: { id: cityId } });
    if (!cityExists) {
      console.warn(
        `City ${cityId} not found in DB. Skipping cache for districts.`
      );
      return res.json(districtsData);
    }

    if (districtsData.length > 0) {
      await prisma.district.createMany({
        data: districtsData.map((d: any) => ({
          id: d.subdistrict_id,
          cityId: d.city_id,
          name: d.subdistrict_name,
        })),
        skipDuplicates: true,
      });
    }

    res.json(districtsData);
  } catch (error: any) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: "Failed to fetch districts",
      details: error.message,
    });
  }
});

app.post("/api/rajaongkir/cost", async (req, res) => {
  const { origin, destination, weight, courier } = req.body;
  if (!RAJAONGKIR_API_KEY)
    return res.status(500).json({ error: "API Key not configured" });
  try {
    // Aligning with user's curl command for /calculate/district/domestic-cost
    // FIX: Use URLSearchParams to ensure application/x-www-form-urlencoded format
    const params = new URLSearchParams();
    params.append("origin", origin);
    params.append("destination", destination);
    params.append("weight", weight);
    params.append("courier", courier);
    // params.append('price', 'lowest'); // Removed to get all services

    const response = await axios.post(
      `${RAJAONGKIR_BASE_URL}/calculate/domestic-cost`,
      params,
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
          // Axios automatically sets content-type to application/x-www-form-urlencoded when using URLSearchParams
        },
      }
    );

    // Return the data array from response (response.data.data contains the shipping options)
    res.json(response.data.data || []);
  } catch (error: any) {
    console.error(
      "RajaOngkir Cost Error:",
      error.response?.data || error.message
    );
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      error: "Failed to calculate cost",
      details: error.message,
    };
    res.status(status).json(data);
  }
});

// --- AUTH API ---

// Register User
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "customer",
      },
    });
    // Create Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to register" });
  }
});

// Login User (or Admin)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded Admin Login (Legacy Support & Fallback)
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (email === "admin" && password === adminPassword) {
    // Return the legacy token for now to not break existing admin
    return res.json({
      success: true,
      token: "admin-session-token",
      role: "admin",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Get Current User Profile
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  if (!req.user || req.user.userId === 0) {
    // Legacy admin doesn't have a DB record
    return res.json({
      id: 0,
      name: "Administrator",
      email: "admin@local",
      role: "admin",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get User Orders
app.get("/api/orders/my", authenticateToken, async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(400).json({ error: "User ID required" });

  try {
    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// --- EXISTING API ROUTES (Unchanged logic, mostly) ---

// Legacy Login Endpoint (Keep for Admin.tsx compatibility if needed)
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    res.json({ success: true, token: "admin-session-token" });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

// ... Store Settings & Admin Stats endpoints (Same as before) ...
// Get Settings (Public)
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await prisma.storeSetting.findFirst({
      where: { id: 1 },
    });
    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          id: 1,
          storeName: "Microsite Shop",
          storeDescription: "Welcome to our shop",
          bannerUrl:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        },
      });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.put("/api/admin/settings", authenticateToken, async (req, res) => {
  console.log("Received settings update:", req.body);
  const {
    storeName,
    storeDescription,
    logoUrl,
    bannerUrl,
    whatsapp,
    instagram,
    facebook,
    twitter,
    tiktok,
    supportEmail,
    storeAddress,
    storeProvinceId,
    storeCityId,
    storeDistrictId,
  } = req.body as StoreSettingInput;

  const dataToUpdate = {
    storeName,
    storeDescription,
    logoUrl,
    bannerUrl,
    whatsapp,
    instagram,
    facebook,
    twitter,
    tiktok,
    supportEmail,
    storeAddress,
    storeProvinceId,
    storeCityId,
    storeDistrictId,
  };

  try {
    const settings = await prisma.storeSetting.upsert({
      where: { id: 1 },
      update: dataToUpdate,
      create: { id: 1, ...dataToUpdate },
    });
    res.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

app.get("/api/admin/stats", authenticateToken, async (req, res) => {
  // ... Same stats logic ...
  try {
    const orderAggregates = await prisma.order.aggregate({
      _sum: { total: true },
      _count: { id: true },
    });
    const lowStockCount = await prisma.product.count({
      where: { stock: { lte: 5 }, type: "physical" },
    });
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    // Simple chart logic (abbreviated for brevity, same as before)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const lastWeekOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, total: true },
    });
    const chartMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      chartMap.set(d.toISOString().split("T")[0], 0);
    }
    lastWeekOrders.forEach((order) => {
      const d = order.createdAt.toISOString().split("T")[0];
      chartMap.set(d, (chartMap.get(d) || 0) + Number(order.total));
    });
    const revenueChart = Array.from(chartMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      totalRevenue: Number(orderAggregates._sum.total || 0),
      totalOrders: orderAggregates._count.id,
      lowStockCount,
      recentOrders: recentOrders.map((o) => ({ ...o, total: Number(o.total) })),
      revenueChart,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ... Category API ...
// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get single category
app.get("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { products: true },
    });
    if (category) res.json(category);
    else res.status(404).json({ error: "Category not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// Create category (Admin only)
app.post("/api/categories", authenticateToken, async (req, res) => {
  const { name, description, icon } = req.body;
  try {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await prisma.category.create({
      data: { name, slug, description, icon },
    });
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Category already exists" });
    } else {
      res.status(500).json({ error: "Failed to create category" });
    }
  }
});

// Update category (Admin only)
app.put("/api/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, icon } = req.body;
  try {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, slug, description, icon },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Delete category (Admin only)
app.delete("/api/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: Number(id) },
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: "Cannot delete category with existing products",
      });
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ... Products API ...
app.get("/api/products", async (req, res) => {
  try {
    const { categoryId } = req.query;
    const where = categoryId ? { categoryId: Number(categoryId) } : {};

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { id: "asc" },
    });
    res.json(products.map((p) => ({ ...p, price: Number(p.price) })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", authenticateToken, async (req, res) => {
  const body = req.body as ProductInput;
  try {
    const product = await prisma.product.create({
      data: { ...body, stock: Number(body.stock) },
    });
    res.status(201).json({ ...product, price: Number(product.price) });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    categoryId,
    image,
    description,
    stock,
    weight,
    type,
    fileUrl,
  } = req.body as ProductInput;

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        categoryId: Number(categoryId),
        image,
        description,
        stock: Number(stock),
        weight: weight ? Number(weight) : 1000,
        type,
        fileUrl,
      },
    });
    res.json({ ...product, price: Number(product.price) });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.orderItem.deleteMany({ where: { productId: Number(id) } });
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (product) res.json({ ...product, price: Number(product.price) });
    else res.status(404).json({ error: "Product not found" });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// --- ORDERS API (Updated with User ID) ---

app.post("/api/orders", async (req, res) => {
  const body = req.body as CreateOrderInput;
  const { items } = body;

  // Check for authenticated user to link order
  let userId: number | null = null;
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.userId) userId = decoded.userId;
    } catch (e) {
      // Ignore invalid token, treat as guest
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Product ${item.id} not found`);
        if (product.type === "physical") {
          if (product.stock < item.quantity)
            throw new Error(`Insufficient stock for ${product.name}`);
          await tx.product.update({
            where: { id: item.id },
            data: { stock: product.stock - item.quantity },
          });
        }
      }

      const order = await tx.order.create({
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          address: body.address,
          city: body.city,
          postalCode: body.postalCode,
          total: body.total,
          subtotal: body.subtotal,
          shippingCost: body.shippingCost,
          shippingCourier: body.shippingCourier,
          shippingService: body.shippingService,
          userId: userId, // Link to user if logged in
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });
      return order;
    });
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Order error:", error.message);
    if (error.message.includes("Insufficient stock"))
      return res.status(400).json({ error: error.message });
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// --- BLOG POST API ---

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: Number(id) },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.post("/api/posts", authenticateToken, async (req, res) => {
  const { title, content, image, category, excerpt, isPublished } = req.body;
  try {
    const slug =
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // remove non-word chars
        .replace(/\s+/g, "-") +
      "-" +
      Date.now(); // simple slug

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        image,
        category,
        excerpt,
        isPublished: isPublished ?? true,
        author: "Admin", // Hardcoded for now
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.put("/api/posts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, image, category, excerpt, isPublished } = req.body;
  try {
    const post = await prisma.blogPost.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        image,
        category,
        excerpt,
        isPublished,
      },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.blogPost.delete({ where: { id: Number(id) } });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// --- FILE UPLOAD API ---

app.post(
  "/api/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Check if R2 is configured, otherwise use local storage
    const useR2 =
      R2_ACCOUNT_ID &&
      R2_ACCESS_KEY_ID &&
      R2_SECRET_ACCESS_KEY &&
      R2_BUCKET_NAME &&
      R2_PUBLIC_DOMAIN &&
      R2_ACCESS_KEY_ID !== "your-access-key-id";

    try {
      // Convert image to AVIF format
      console.log("Converting image to AVIF format...");
      const avifBuffer = await sharp(req.file.buffer)
        .avif({ quality: 80, effort: 4 })
        .toBuffer();

      // Generate filename with .avif extension
      const originalName = path.parse(req.file.originalname).name;
      const baseFileName = `${Date.now()}-${originalName.replace(/\s+/g, "-")}`;

      if (useR2) {
        // Use Cloudflare R2
        const fileName = `uploads/${baseFileName}.avif`;

        const parallelUploads3 = new Upload({
          client: s3Client,
          params: {
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: avifBuffer,
            ContentType: "image/avif",
          },
        });

        await parallelUploads3.done();
        const url = `${R2_PUBLIC_DOMAIN}/${fileName}`;
        console.log(`File uploaded to R2 as AVIF: ${url}`);
        res.json({ url });
      } else {
        // Use local file storage
        console.log("Using local file storage (R2 not configured)");
        const fileName = `${baseFileName}.avif`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, avifBuffer);

        // Return relative URL that works with proxy
        const url = `/uploads/${fileName}`;
        console.log(`File uploaded successfully as AVIF: ${url}`);
        res.json({ url });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
