const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  category?: Category;
  image: string;
  description?: string;
  stock: number;
  weight?: number;
  type: "physical" | "digital";
  fileUrl?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

export const updateOrderStatus = async (id: number, status: string) => {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update order status");
  }
  return response.json();
};

export interface CreateOrderInput {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  shippingCourier?: string;
  shippingService?: string;
  items: {
    id: number;
    quantity: number;
    price: number;
  }[];
}

export const createOrder = async (orderData: CreateOrderInput) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error("Failed to create order");
  }
  return response.json();
};

export const loginAdmin = async (password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error("Invalid password");
  }

  return response.json();
};

// User Auth API
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Invalid credentials");
  return response.json();
};

export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }
  return response.json();
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("adminToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token && token !== "null" && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchMyOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders/my`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
};

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  recentOrders: {
    id: number;
    firstName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  revenueChart: {
    date: string;
    revenue: number;
  }[];
}

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch admin stats");
  return response.json();
};

export interface StoreSetting {
  id: number;
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

export const fetchSettings = async (): Promise<StoreSetting> => {
  const response = await fetch(`${API_URL}/settings`);
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
};

export const updateSettings = async (settings: Partial<StoreSetting>) => {
  const response = await fetch(`${API_URL}/admin/settings`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error("Failed to update settings");
  return response.json();
};

export const createProduct = async (productData: Partial<Product>) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
};

export const updateProduct = async (
  id: number,
  productData: Partial<Product>
) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
};

export const deleteProduct = async (id: number) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return response.json();
};

// RajaOngkir API
export const fetchProvinces = async () => {
  const response = await fetch(`${API_URL}/rajaongkir/provinces`);
  if (!response.ok) throw new Error("Failed to fetch provinces");
  return response.json();
};

export const fetchCities = async (provinceId: string) => {
  const response = await fetch(`${API_URL}/rajaongkir/cities/${provinceId}`);
  if (!response.ok) throw new Error("Failed to fetch cities");
  return response.json();
};

export const fetchDistricts = async (cityId: string) => {
  const response = await fetch(`${API_URL}/rajaongkir/districts/${cityId}`);
  if (!response.ok) throw new Error("Failed to fetch districts");
  return response.json();
};

export const calculateShippingCost = async (data: {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}) => {
  const response = await fetch(`${API_URL}/rajaongkir/cost`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to calculate cost");
  return response.json();
};

// Category API
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const fetchCategory = async (id: number): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`);
  if (!response.ok) throw new Error("Failed to fetch category");
  return response.json();
};

export const createCategory = async (data: Partial<Category>) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create category");
  }
  return response.json();
};

export const updateCategory = async (id: number, data: Partial<Category>) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
};

export const deleteCategory = async (id: number) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete category");
  }
  return response.json();
};
