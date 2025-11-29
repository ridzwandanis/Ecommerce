import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-me";

// RajaOngkir Config
const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL =
  process.env.RAJAONGKIR_BASE_URL || "https://rajaongkir.komerce.id/api/v1";

app.use(cors());
app.use(express.json());

// Interfaces
interface ProductInput {
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  stock: number;
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

// --- RAJAONGKIR PROXY ---

app.get("/api/rajaongkir/provinces", async (req, res) => {
  if (!RAJAONGKIR_API_KEY)
    return res.status(500).json({ error: "API Key not configured" });
  try {
    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/province`,
      {
        headers: { key: RAJAONGKIR_API_KEY },
      }
    );
    res.json(response.data.data || response.data.rajaongkir?.results);
  } catch (error: any) {
    console.error("RajaOngkir Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch provinces", details: error.message });
  }
});

app.get("/api/rajaongkir/cities/:provinceId", async (req, res) => {
  const { provinceId } = req.params;
  if (!RAJAONGKIR_API_KEY)
    return res.status(500).json({ error: "API Key not configured" });
  try {
    console.log(`Fetching cities for province: ${provinceId}`);
    // Standard RajaOngkir expects 'province' query param.
    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/city/${provinceId}`,
      {
        headers: { key: RAJAONGKIR_API_KEY },
      }
    );
    res.json(response.data.data || response.data.rajaongkir?.results || []);
  } catch (error: any) {
    console.error("RajaOngkir City Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    // Forward the actual error from upstream if available
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      error: "Failed to fetch cities",
      details: error.message,
    };
    res.status(status).json(data);
  }
});

app.get("/api/rajaongkir/districts/:cityId", async (req, res) => {
  const { cityId } = req.params;
  if (!RAJAONGKIR_API_KEY)
    return res.status(500).json({ error: "API Key not configured" });
  try {
    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/district/${cityId}`,
      {
        headers: { key: RAJAONGKIR_API_KEY },
      }
    );
    res.json(response.data.data || response.data.rajaongkir?.results || []);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      error: "Failed to fetch districts",
      details: error.message,
    };
    res.status(status).json(data);
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
  const body = req.body as StoreSettingInput;
  try {
    const settings = await prisma.storeSetting.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });
    res.json(settings);
  } catch (error) {
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

// ... Products API ...
app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
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
  const body = req.body as ProductInput;
  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { ...body, stock: Number(body.stock) },
    });
    res.json({ ...product, price: Number(product.price) });
  } catch (error) {
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
    });
    if (product) res.json({ ...product, price: Number(product.price) });
    else res.status(404).json({ error: "Product not found" });
  } catch (error) {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
