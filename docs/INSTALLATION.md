# 📦 Installation Guide

Complete guide to install and run Microsite Shop on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Docker Installation](#docker-installation-recommended)
- [Manual Installation](#manual-installation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** 15 or higher ([Download](https://www.postgresql.org/download/))

### Optional (for Docker)

- **Docker** ([Download](https://www.docker.com/get-started))
- **Docker Compose** (included with Docker Desktop)

### API Keys

- **RajaOngkir API Key** - Get free key at [rajaongkir.com](https://rajaongkir.com/)

---

## Docker Installation (Recommended)

The easiest way to get started. Docker will handle all dependencies automatically.

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/microsite-shop.git
cd microsite-shop
```

### Step 2: Configure Environment

```bash
# Backend environment
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your RajaOngkir API key:

```env
RAJAONGKIR_API_KEY=your-api-key-here
```

### Step 3: Start with Docker Compose

```bash
docker-compose up --build
```

This will:

- ✅ Start PostgreSQL database
- ✅ Run database migrations
- ✅ Seed initial data
- ✅ Start backend server
- ✅ Build and serve frontend

### Step 4: Access Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### Default Admin Credentials

- Email: `admin`
- Password: `admin123` (or as set in `backend/.env`)

---

## Manual Installation

For developers who prefer to run services individually.

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/microsite-shop.git
cd microsite-shop
```

### Step 2: Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE micrositeshop;

# Exit
\q
```

### Step 3: Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install
```

#### Configure Backend Environment

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/micrositeshop?schema=public"
PORT=3000
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production
RAJAONGKIR_API_KEY=your-rajaongkir-api-key
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1
```

#### Run Migrations and Seed

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npm run seed
```

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run at: http://localhost:3000

### Step 4: Frontend Setup

Open a new terminal in project root:

```bash
# Copy environment file
cp .env.example .env

# Install dependencies
npm install
```

#### Configure Frontend Environment

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

#### Start Frontend Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will run at: http://localhost:5173

---

## Verification

### Check Backend

```bash
curl http://localhost:3000/api/products
```

Should return JSON array of products.

### Check Frontend

Open browser and navigate to:

- http://localhost:8080 (Docker)
- http://localhost:5173 (Manual)

You should see the homepage with products.

### Check Database

```bash
cd backend
npx prisma studio
```

Opens Prisma Studio at http://localhost:5555 to view database.

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

**Windows:**

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Linux/Mac:**

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

1. Verify PostgreSQL is running:

   ```bash
   # Windows
   pg_ctl status

   # Linux/Mac
   sudo service postgresql status
   ```

2. Check connection string in `backend/.env`
3. Ensure database exists:
   ```bash
   psql -U postgres -l
   ```

### Prisma Migration Errors

Reset database and re-run migrations:

```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npm run seed
```

### Docker Issues

**Container won't start:**

```bash
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild
docker-compose up --build
```

**View logs:**

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
```

### RajaOngkir API Errors

1. Verify API key is correct in `backend/.env`
2. Check API quota at [RajaOngkir Dashboard](https://rajaongkir.com/)
3. Ensure `RAJAONGKIR_BASE_URL` is correct

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

- 📖 Read [API Documentation](./API.md)
- 🎨 Check [Architecture Guide](./ARCHITECTURE.md)
- 🚀 Learn about [Deployment](./DEPLOYMENT.md)
- 🤝 See [Contributing Guide](../CONTRIBUTING.md)

---

## Need Help?

- 🐛 [Report Issues](https://github.com/yourusername/microsite-shop/issues)
- 💬 [Ask Questions](https://github.com/yourusername/microsite-shop/discussions)
- 📧 Contact maintainers
