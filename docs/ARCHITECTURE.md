# 🏗️ Architecture Guide

Understanding the architecture and design decisions of Microsite Shop.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Order Flow](#order-flow)
- [Shipping Integration](#shipping-integration)
- [Design Patterns](#design-patterns)
- [Security Considerations](#security-considerations)

---

## Overview

Microsite Shop follows a **three-tier architecture**:

1. **Presentation Layer** - React frontend
2. **Application Layer** - Express.js backend
3. **Data Layer** - PostgreSQL database

```
┌─────────────────────────────────────────────┐
│           Frontend (React + Vite)           │
│  - UI Components (shadcn/ui)                │
│  - State Management (React Query)           │
│  - Routing (React Router)                   │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST API
┌──────────────────▼──────────────────────────┐
│        Backend (Node.js + Express)          │
│  - REST API Endpoints                       │
│  - Authentication (JWT)                     │
│  - Business Logic                           │
│  - External API Integration (RajaOngkir)    │
└──────────────────┬──────────────────────────┘
                   │ Prisma ORM
┌──────────────────▼──────────────────────────┐
│         Database (PostgreSQL)               │
│  - User Data                                │
│  - Products & Orders                        │
│  - Store Settings                           │
│  - Location Cache (Provinces/Cities)        │
└─────────────────────────────────────────────┘
```

---

## System Architecture

### Technology Stack

#### Frontend

- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation

#### Backend

- **Node.js 18+** - JavaScript runtime
- **Express** - Web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Axios** - HTTP client

#### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control

---

## Frontend Architecture

### Directory Structure

```
src/
├── components/          # Reusable components
│   ├── admin/          # Admin-specific components
│   │   ├── AdminLayout.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── ProductManager.tsx
│   │   └── OrderManager.tsx
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CartSheet.tsx
│   └── ProductForm.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── hooks/              # Custom hooks
│   └── use-toast.ts
├── lib/                # Utilities
│   ├── api.ts         # API client
│   └── utils.ts       # Helper functions
├── pages/              # Page components
│   ├── Index.tsx      # Home page
│   ├── ProductDetail.tsx
│   ├── Checkout.tsx
│   ├── Account.tsx
│   ├── Admin.tsx
│   ├── Login.tsx
│   └── Register.tsx
└── main.tsx           # App entry point
```

### State Management

#### Server State (React Query)

- Product data
- Order data
- User data
- Store settings

**Benefits:**

- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

#### Client State (React Context)

- Authentication state
- Shopping cart
- UI state (modals, sheets)

### Component Patterns

#### Composition Pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

#### Custom Hooks

```tsx
const { user, login, logout } = useAuth();
const { items, addToCart, removeFromCart } = useCart();
```

---

## Backend Architecture

### Directory Structure

```
backend/
├── prisma/
│   ├── migrations/     # Database migrations
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed data
├── src/
│   └── index.ts        # Express server & routes
├── .env                # Environment variables
└── package.json
```

### API Design

#### RESTful Principles

- Resource-based URLs
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Status codes (200, 201, 400, 401, 404, 500)
- JSON request/response

#### Endpoint Structure

```
/api/products          # Product resources
/api/orders            # Order resources
/api/auth/*            # Authentication
/api/rajaongkir/*      # Shipping integration
/api/admin/*           # Admin endpoints
```

### Middleware Stack

```
Request
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Logging Middleware
  ↓
Authentication Middleware (protected routes)
  ↓
Route Handler
  ↓
Response
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ name        │
│ role        │
└──────┬──────┘
       │ 1:N
       │
┌──────▼──────┐
│    Order    │
├─────────────┤
│ id (PK)     │
│ userId (FK) │
│ email       │
│ firstName   │
│ lastName    │
│ address     │
│ city        │
│ postalCode  │
│ total       │
│ subtotal    │
│ shippingCost│
│ courier     │
│ service     │
│ status      │
└──────┬──────┘
       │ 1:N
       │
┌──────▼──────┐       ┌─────────────┐
│  OrderItem  │ N:1   │   Product   │
├─────────────┤───────┤─────────────┤
│ id (PK)     │       │ id (PK)     │
│ orderId(FK) │       │ name        │
│ productId   │       │ price       │
│ quantity    │       │ category    │
│ price       │       │ image       │
└─────────────┘       │ description │
                      │ stock       │
                      │ weight      │
                      │ type        │
                      └─────────────┘
```

### Key Relationships

- **User → Order**: One-to-Many (optional, for guest checkout)
- **Order → OrderItem**: One-to-Many
- **Product → OrderItem**: One-to-Many

### Indexes

```sql
-- User
CREATE INDEX idx_user_email ON User(email);

-- Order
CREATE INDEX idx_order_userId ON Order(userId);
CREATE INDEX idx_order_status ON Order(status);
CREATE INDEX idx_order_createdAt ON Order(createdAt);

-- Product
CREATE INDEX idx_product_category ON Product(category);
CREATE INDEX idx_product_type ON Product(type);
```

---

## Authentication Flow

### Registration Flow

```
User → Frontend → Backend → Database
  1. User fills registration form
  2. Frontend validates input (Zod)
  3. Backend receives request
  4. Password hashed with bcrypt
  5. User created in database
  6. JWT token generated
  7. Token returned to frontend
  8. Token stored in localStorage
```

### Login Flow

```
User → Frontend → Backend → Database
  1. User enters credentials
  2. Frontend sends to /api/auth/login
  3. Backend verifies credentials
  4. Password compared with bcrypt
  5. JWT token generated
  6. Token returned to frontend
  7. Token stored in localStorage
```

### Protected Route Access

```
Frontend → Backend
  1. Frontend includes token in Authorization header
  2. Backend middleware verifies JWT
  3. User info extracted from token
  4. Request proceeds if valid
  5. 401 Unauthorized if invalid
```

---

## Order Flow

### Complete Order Process

```
1. Browse Products
   ↓
2. Add to Cart (localStorage)
   ↓
3. Proceed to Checkout
   ↓
4. Fill Shipping Info
   ↓
5. Select Location (Province → City → District)
   ↓
6. Calculate Shipping Cost (RajaOngkir API)
   ↓
7. Select Courier & Service
   ↓
8. Review Order Summary
   ↓
9. Place Order
   ↓
10. Backend Transaction:
    - Validate stock
    - Deduct stock
    - Create order
    - Create order items
    ↓
11. Order Confirmation
    ↓
12. View in Order History
```

### Stock Management

```typescript
// Atomic transaction ensures consistency
await prisma.$transaction(async (tx) => {
  // Check stock
  const product = await tx.product.findUnique({ where: { id } });
  if (product.stock < quantity) throw new Error("Insufficient stock");

  // Deduct stock
  await tx.product.update({
    where: { id },
    data: { stock: product.stock - quantity },
  });

  // Create order
  await tx.order.create({ data: orderData });
});
```

---

## Shipping Integration

### RajaOngkir API Flow

```
Frontend → Backend → RajaOngkir API
  1. User selects province
     → GET /api/rajaongkir/provinces
     → Returns province list

  2. User selects city
     → GET /api/rajaongkir/cities/:provinceId
     → Returns city list

  3. User selects district
     → GET /api/rajaongkir/districts/:cityId
     → Returns district list

  4. User selects courier
     → POST /api/rajaongkir/cost
     → Calculates shipping cost
     → Returns service options

  5. User selects service
     → Shipping cost added to order
```

### Location Caching Strategy (Cache-Aside)

To prevent API rate limiting (Error 429) and improve performance, we use a **Cache-Aside** strategy for location data:

1.  **Check DB**: When a location list (Provinces/Cities/Districts) is requested, the backend first checks the local PostgreSQL database.
2.  **Return Cached**: If data exists, it is returned immediately (0 API calls).
3.  **Fetch & Cache**: If data is missing, the backend fetches it from RajaOngkir API, saves it to the database, and then returns it.

This ensures that API calls are only made once per region type, significantly reducing external dependency.

```typescript
// Example Logic
const cached = await prisma.province.findMany();
if (cached.length > 0) return cached;

const response = await axios.get(RAJAONGKIR_URL);
await prisma.province.createMany({ data: response.data }); // Cache for future
return response.data;
```

### Weight Calculation

```typescript
const totalWeight = cart.reduce((acc, item) => {
  return acc + item.quantity * (item.weight || 1000);
}, 0);
```

---

## Design Patterns

### Repository Pattern (Prisma)

```typescript
// Abstraction over database operations
const userRepository = {
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  create: (data) => prisma.user.create({ data }),
  update: (id, data) => prisma.user.update({ where: { id }, data }),
};
```

### Context Pattern (React)

```typescript
// Share state across components
<AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>
```

### Custom Hooks Pattern

```typescript
// Encapsulate reusable logic
function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
```

### Compound Component Pattern

```typescript
// Flexible component composition
<Dialog>
  <DialogTrigger />
  <DialogContent>
    <DialogHeader />
    <DialogFooter />
  </DialogContent>
</Dialog>
```

---

## Security Considerations

### Password Security

- **Hashing**: bcrypt with 10 rounds
- **No plain text storage**
- **Minimum length**: 8 characters (recommended)

### JWT Security

- **Secret key**: Strong random string
- **Expiration**: 7 days
- **Storage**: localStorage (consider httpOnly cookies for production)

### API Security

- **Authentication**: JWT tokens
- **Authorization**: Role-based access control
- **Input validation**: Zod schemas
- **SQL Injection**: Prevented by Prisma ORM
- **CORS**: Configured for specific origins

### Environment Variables

- **Never commit**: .env files
- **Use .env.example**: Template without secrets
- **Production**: Use environment-specific configs

---

## Performance Optimizations

### Frontend

- **Code splitting**: React.lazy() for routes
- **Image optimization**: Lazy loading
- **Caching**: React Query automatic caching
- **Memoization**: useMemo, useCallback

### Backend

- **Database indexes**: On frequently queried fields
- **Connection pooling**: Prisma connection pool
- **Transactions**: Atomic operations
- **Pagination**: Limit query results

### Database

- **Indexes**: On foreign keys and search fields
- **Query optimization**: Select only needed fields
- **Migrations**: Version-controlled schema changes

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless backend**: Can run multiple instances
- **Load balancer**: Distribute traffic
- **Database replication**: Read replicas

### Vertical Scaling

- **Increase resources**: CPU, RAM, storage
- **Database optimization**: Query tuning
- **Caching layer**: Redis for sessions

### Future Enhancements

- **CDN**: For static assets
- **Message queue**: For async tasks
- **Microservices**: Split into smaller services
- **Caching**: Redis for frequently accessed data

---

## Monitoring & Logging

### Recommended Tools

- **Application**: PM2, Winston
- **Database**: pgAdmin, Prisma Studio
- **Performance**: New Relic, DataDog
- **Errors**: Sentry
- **Logs**: ELK Stack

---

## Testing Strategy

### Unit Tests

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **Coverage**: Aim for 80%+

### Integration Tests

- **API endpoints**: Test full request/response cycle
- **Database**: Test with test database

### E2E Tests

- **User flows**: Cypress or Playwright
- **Critical paths**: Checkout, order placement

---

## Deployment Architecture

### Production Setup

```
┌─────────────┐
│   Nginx     │ ← Reverse Proxy
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│ App │ │ App │ ← Multiple instances
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │
┌──────▼──────┐
│  PostgreSQL │ ← Database
└─────────────┘
```

---

## Further Reading

- 📖 [Installation Guide](./INSTALLATION.md)
- 🔌 [API Documentation](./API.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🤝 [Contributing Guide](../CONTRIBUTING.md)

---

**Questions?** Open an issue or discussion on GitHub!
