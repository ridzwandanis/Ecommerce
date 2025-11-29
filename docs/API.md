# 🔌 API Documentation

Complete REST API reference for Microsite Shop backend.

## Base URL

```
http://localhost:3000/api
```

## Table of Contents

- [Authentication](#authentication)
- [Products](#products)
- [Orders](#orders)
- [RajaOngkir (Shipping)](#rajaongkir-shipping)
- [Store Settings](#store-settings)
- [Admin Stats](#admin-stats)

---

## Authentication

### Register User

Create a new customer account.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:** `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

---

### Login User

Authenticate and get JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Admin Login:**

```json
{
  "email": "admin",
  "password": "admin123"
}
```

---

### Get Current User

Get authenticated user profile.

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "customer",
  "createdAt": "2025-11-29T00:00:00.000Z"
}
```

---

## Products

### Get All Products

Retrieve all products.

**Endpoint:** `GET /products`

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Organic Cotton Tote",
    "price": 45000,
    "category": "Bags",
    "image": "https://example.com/image.jpg",
    "description": "Eco-friendly cotton tote bag",
    "stock": 50,
    "weight": 500,
    "type": "physical",
    "createdAt": "2025-11-29T00:00:00.000Z",
    "updatedAt": "2025-11-29T00:00:00.000Z"
  }
]
```

---

### Get Single Product

Get product by ID.

**Endpoint:** `GET /products/:id`

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Organic Cotton Tote",
  "price": 45000,
  "category": "Bags",
  "image": "https://example.com/image.jpg",
  "description": "Eco-friendly cotton tote bag",
  "stock": 50,
  "weight": 500,
  "type": "physical"
}
```

---

### Create Product

Create a new product (Admin only).

**Endpoint:** `POST /products`

**Headers:**

```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "New Product",
  "price": 100000,
  "category": "Electronics",
  "image": "https://example.com/image.jpg",
  "description": "Product description",
  "stock": 20,
  "weight": 1000,
  "type": "physical"
}
```

**Response:** `201 Created`

---

### Update Product

Update existing product (Admin only).

**Endpoint:** `PUT /products/:id`

**Headers:**

```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Updated Product Name",
  "price": 120000,
  "stock": 15
}
```

**Response:** `200 OK`

---

### Delete Product

Delete a product (Admin only).

**Endpoint:** `DELETE /products/:id`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

```json
{
  "message": "Product deleted successfully"
}
```

---

## Orders

### Create Order

Place a new order.

**Endpoint:** `POST /orders`

**Headers:**

```
Authorization: Bearer <token> (optional, for logged-in users)
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "address": "Jl. Sudirman No. 123",
  "city": "Jakarta Selatan",
  "postalCode": "12190",
  "total": 113000,
  "subtotal": 45000,
  "shippingCost": 68000,
  "shippingCourier": "jne",
  "shippingService": "REG",
  "items": [
    {
      "id": 1,
      "quantity": 1,
      "price": 45000
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "id": 10,
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "total": 113000,
  "status": "pending",
  "createdAt": "2025-11-29T00:00:00.000Z",
  "items": [...]
}
```

---

### Get All Orders

Get all orders (Admin only).

**Endpoint:** `GET /orders`

**Response:** `200 OK`

---

### Get My Orders

Get orders for authenticated user.

**Endpoint:** `GET /orders/my`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
[
  {
    "id": 10,
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "address": "Jl. Sudirman No. 123",
    "city": "Jakarta Selatan",
    "postalCode": "12190",
    "total": 113000,
    "subtotal": 45000,
    "shippingCost": 68000,
    "shippingCourier": "jne",
    "shippingService": "REG",
    "status": "pending",
    "createdAt": "2025-11-29T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "quantity": 1,
        "price": 45000,
        "product": {
          "id": 1,
          "name": "Organic Cotton Tote",
          "image": "https://example.com/image.jpg"
        }
      }
    ]
  }
]
```

---

### Update Order Status

Update order status (Admin only).

**Endpoint:** `PATCH /orders/:id/status`

**Headers:**

```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "shipped"
}
```

**Valid statuses:** `pending`, `paid`, `shipped`, `completed`, `cancelled`

**Response:** `200 OK`

---

## RajaOngkir (Shipping)

### Get Provinces

Get list of provinces in Indonesia.

**Endpoint:** `GET /rajaongkir/provinces`

**Response:** `200 OK`

```json
[
  {
    "id": "1",
    "name": "Bali"
  },
  {
    "id": "2",
    "name": "Bangka Belitung"
  }
]
```

---

### Get Cities

Get cities in a province.

**Endpoint:** `GET /rajaongkir/cities/:provinceId`

**Response:** `200 OK`

```json
[
  {
    "id": "1",
    "province_id": "1",
    "type": "Kabupaten",
    "name": "Badung",
    "postal_code": "80351"
  }
]
```

---

### Get Districts

Get districts (kecamatan) in a city.

**Endpoint:** `GET /rajaongkir/districts/:cityId`

**Response:** `200 OK`

```json
[
  {
    "id": "1",
    "city_id": "1",
    "name": "Abiansemal"
  }
]
```

---

### Calculate Shipping Cost

Calculate shipping cost for an order.

**Endpoint:** `POST /rajaongkir/cost`

**Request Body:**

```json
{
  "origin": "1527",
  "destination": "1349",
  "weight": 1000,
  "courier": "jne"
}
```

**Parameters:**

- `origin`: District ID of origin (store location)
- `destination`: District ID of destination
- `weight`: Total weight in grams
- `courier`: Courier code (`jne`, `tiki`, `pos`)

**Response:** `200 OK`

```json
[
  {
    "name": "Jalur Nugraha Ekakurir (JNE)",
    "code": "jne",
    "service": "REG",
    "description": "Layanan Reguler",
    "cost": 68000,
    "etd": "14 day"
  }
]
```

---

## Store Settings

### Get Settings

Get store settings (public).

**Endpoint:** `GET /settings`

**Response:** `200 OK`

```json
{
  "id": 1,
  "storeName": "Microsite Shop",
  "storeDescription": "Your one-stop shop",
  "logoUrl": "https://example.com/logo.png",
  "bannerUrl": "https://example.com/banner.jpg",
  "whatsapp": "+6281234567890",
  "instagram": "@micrositeshop",
  "facebook": "micrositeshop",
  "twitter": "@micrositeshop",
  "tiktok": "@micrositeshop",
  "supportEmail": "support@micrositeshop.com"
}
```

---

### Update Settings

Update store settings (Admin only).

**Endpoint:** `PUT /admin/settings`

**Headers:**

```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "storeName": "New Store Name",
  "whatsapp": "+6281234567890"
}
```

**Response:** `200 OK`

---

## Admin Stats

### Get Dashboard Statistics

Get admin dashboard statistics.

**Endpoint:** `GET /admin/stats`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

```json
{
  "totalRevenue": 5000000,
  "totalOrders": 42,
  "lowStockCount": 3,
  "recentOrders": [
    {
      "id": 10,
      "firstName": "John",
      "total": 113000,
      "status": "pending",
      "createdAt": "2025-11-29T00:00:00.000Z"
    }
  ],
  "revenueChart": [
    {
      "date": "2025-11-23",
      "revenue": 500000
    },
    {
      "date": "2025-11-24",
      "revenue": 750000
    }
  ]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request

```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 7 days.

---

## Need Help?

- 📖 [Installation Guide](./INSTALLATION.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🐛 [Report Issues](https://github.com/yourusername/microsite-shop/issues)
