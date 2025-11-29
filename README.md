# 🛍️ Microsite Shop

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169e1?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2d3748?logo=prisma)

**A modern, full-stack e-commerce platform built for Indonesian market with integrated shipping cost calculation**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🛒 **Customer Features**

- **Product Catalog** - Browse products with beautiful, responsive design
- **Smart Shopping Cart** - Persistent cart using local storage
- **Real-time Shipping Cost** - Integrated with RajaOngkir API for accurate shipping rates
- **Multi-Courier Support** - Choose from JNE, TIKI, and POS Indonesia
- **Location-based Delivery** - Select province, city, and district for precise shipping calculation
- **Order History** - Track all your orders with detailed information
- **User Authentication** - Secure login and registration system

### 👨‍💼 **Admin Features**

- **Product Management** - Create, update, and delete products with ease
- **Inventory Tracking** - Real-time stock management with low-stock alerts
- **Order Management** - View and update order status
- **Dashboard Analytics** - Revenue charts and sales statistics
- **Store Settings** - Customize store name, logo, and social media links
- **Automatic Stock Deduction** - Prevents overselling with transaction safety

### 🚀 **Technical Highlights**

- **Type-Safe** - Full TypeScript implementation on both frontend and backend
- **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- **Optimistic Updates** - Smooth UX with React Query
- **Database Transactions** - Ensures data consistency with Prisma
- **Docker Ready** - One-command deployment with Docker Compose
- **Responsive Design** - Fully optimized for mobile and desktop

---

## 🎯 Demo

> **Note:** Add screenshots or GIF demos here

```bash
# Quick demo with Docker
docker-compose up --build
```

**Default Admin Credentials:**

- Email: `admin`
- Password: `admin123`

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend

- ⚛️ **React 18** - UI library
- 📘 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool
- 🎨 **Tailwind CSS** - Styling
- 🧩 **shadcn/ui** - UI components
- 🔄 **TanStack Query** - Data fetching
- 🛣️ **React Router** - Navigation
- 📝 **React Hook Form** - Form handling
- ✅ **Zod** - Schema validation

</td>
<td valign="top" width="50%">

### Backend

- 🟢 **Node.js** - Runtime
- 🚂 **Express** - Web framework
- 🗄️ **PostgreSQL** - Database
- 🔷 **Prisma** - ORM
- 🔐 **JWT** - Authentication
- 🔒 **bcrypt** - Password hashing
- 📦 **RajaOngkir API** - Shipping integration

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 15+ ([Download](https://www.postgresql.org/download/))
- RajaOngkir API Key ([Get Free Key](https://rajaongkir.com/))

### Option 1: Docker (Recommended) 🐳

The fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/yourusername/microsite-shop.git
cd microsite-shop

# Start all services
docker-compose up --build
```

**That's it!** 🎉 The app will be available at:

- 🌐 Frontend: http://localhost:8080
- 🔌 Backend API: http://localhost:3000
- 🗄️ Database: localhost:5432

### Option 2: Manual Installation 🔧

#### 1️⃣ Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Configure your .env file
# DATABASE_URL="postgresql://user:password@localhost:5432/micrositeshop"
# ADMIN_PASSWORD="your-secure-password"
# JWT_SECRET="your-jwt-secret"
# RAJAONGKIR_API_KEY="your-rajaongkir-key"

# Run database migrations
npx prisma migrate dev

# Seed initial data
npm run seed

# Start backend server
npm run dev
```

#### 2️⃣ Frontend Setup

```bash
# Open new terminal in project root
cd ..

# Copy environment file
cp .env.example .env

# Configure your .env file
# VITE_API_URL=http://localhost:3000/api

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access the app:**

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 📁 Project Structure

```
microsite-shop/
├── backend/                 # Backend application
│   ├── prisma/             # Database schema & migrations
│   │   ├── schema.prisma   # Prisma schema
│   │   └── seed.ts         # Database seeder
│   ├── src/
│   │   └── index.ts        # Express server & API routes
│   └── package.json
├── src/                    # Frontend application
│   ├── components/         # React components
│   │   ├── admin/         # Admin-specific components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities & API client
│   ├── pages/             # Page components
│   └── main.tsx           # App entry point
├── docker-compose.yml     # Docker configuration
└── README.md
```

---

## 🔒 Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/micrositeshop"
PORT=3000
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-me
RAJAONGKIR_API_KEY=your-rajaongkir-api-key
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📦 API Integration

### RajaOngkir Setup

This project uses RajaOngkir API for shipping cost calculation. To get your API key:

1. Visit [RajaOngkir](https://rajaongkir.com/)
2. Register for a free account
3. Get your API key from the dashboard
4. Add it to `backend/.env` as `RAJAONGKIR_API_KEY`

**Supported Couriers:**

- JNE (Jalur Nugraha Ekakurir)
- TIKI (Citra Van Titipan Kilat)
- POS Indonesia

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ..
npm test
```

---

## 🚢 Deployment

### Deploy with Docker

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build -d
```

### Deploy to VPS

1. Set up PostgreSQL database
2. Configure environment variables
3. Build frontend: `npm run build`
4. Start backend: `cd backend && npm start`
5. Serve frontend with Nginx

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎉 Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [RajaOngkir](https://rajaongkir.com/) - Shipping cost API
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization

---

## 📧 Contact & Support

- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/microsite-shop/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/microsite-shop/discussions)
- ⭐ **Star this repo** if you find it helpful!

---

<div align="center">

**Made with ❤️ for Indonesian E-commerce**

[⬆ Back to Top](#-microsite-shop)

</div>
