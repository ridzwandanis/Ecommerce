# 🚀 Deployment Guide

Complete guide to deploy Microsite Shop to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [VPS Deployment](#vps-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)
- Server with minimum specs:
  - 2 CPU cores
  - 4GB RAM
  - 20GB storage
  - Ubuntu 20.04+ or similar

### Recommended

- CDN for static assets
- Backup solution
- Monitoring tools

---

## Environment Setup

### 1. Production Environment Variables

#### Backend (`backend/.env`)

```env
# Database
DATABASE_URL="postgresql://user:strong_password@localhost:5432/micrositeshop?schema=public"

# Server
PORT=3000
NODE_ENV=production

# Authentication
ADMIN_PASSWORD="very-strong-admin-password"
JWT_SECRET="super-secret-jwt-key-min-32-characters-long"

# RajaOngkir
RAJAONGKIR_API_KEY="your-production-api-key"
RAJAONGKIR_BASE_URL="https://rajaongkir.komerce.id/api/v1"
```

#### Frontend (`.env.production`)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### 2. Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS
- [ ] Configure CORS for specific domains
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Regular security updates

---

## Docker Deployment

### Option 1: Docker Compose (Recommended)

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y
```

#### 2. Clone Repository

```bash
git clone https://github.com/yourusername/microsite-shop.git
cd microsite-shop
```

#### 3. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env  # Edit with production values

# Frontend (if needed)
cp .env.example .env.production
nano .env.production
```

#### 4. Build and Deploy

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose logs -f
```

#### 5. Setup Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/micrositeshop

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/micrositeshop /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## VPS Deployment

### Manual Deployment on Ubuntu

#### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

#### 2. Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE micrositeshop;
CREATE USER shopuser WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE micrositeshop TO shopuser;
\q
```

#### 3. Deploy Backend

```bash
# Clone repository
git clone https://github.com/yourusername/microsite-shop.git
cd microsite-shop/backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed

# Start with PM2
pm2 start npm --name "microsite-backend" -- start
pm2 save
pm2 startup
```

#### 4. Deploy Frontend

```bash
# Go to project root
cd ..

# Install dependencies
npm install

# Build for production
npm run build

# Serve with Nginx (configure as shown above)
sudo cp -r dist/* /var/www/micrositeshop/
```

#### 5. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Cloud Deployment

### Deploy to DigitalOcean

#### 1. Create Droplet

- Choose Ubuntu 20.04
- Select plan (minimum 2GB RAM)
- Add SSH key
- Create droplet

#### 2. Configure Droplet

Follow VPS deployment steps above

#### 3. Setup Managed Database (Optional)

- Create PostgreSQL database
- Update DATABASE_URL in backend/.env

### Deploy to AWS

#### Using EC2 + RDS

1. **Launch EC2 Instance**

   - Choose Ubuntu AMI
   - t2.small or larger
   - Configure security groups (80, 443, 22)

2. **Create RDS PostgreSQL**

   - Choose PostgreSQL 15
   - Configure security group
   - Note connection string

3. **Deploy Application**
   - Follow VPS deployment steps
   - Use RDS connection string

#### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create microsite-shop

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set ADMIN_PASSWORD=your_password
heroku config:set JWT_SECRET=your_secret
heroku config:set RAJAONGKIR_API_KEY=your_key

# Deploy
git push heroku main
```

---

## Post-Deployment

### 1. Database Backup

```bash
# Manual backup
pg_dump -U shopuser micrositeshop > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * pg_dump -U shopuser micrositeshop > /backups/backup_$(date +\%Y\%m\%d).sql
```

### 2. Setup Monitoring

#### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Setup PM2 web dashboard
pm2 web
```

#### System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop -y

# Check system resources
htop
```

### 3. Configure Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### 4. Setup Log Rotation

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/micrositeshop

# Add configuration
/var/log/micrositeshop/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Monitoring

### Application Monitoring

#### PM2 Plus (Recommended)

```bash
# Link to PM2 Plus
pm2 link <secret> <public>

# Monitor in dashboard
# https://app.pm2.io
```

#### Custom Monitoring

```javascript
// Add to backend/src/index.ts
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### Database Monitoring

```bash
# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('micrositeshop'));"
```

### Server Monitoring

```bash
# CPU and Memory
free -h
top

# Disk usage
df -h

# Network
netstat -tuln
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check system logs
sudo journalctl -xe
```

### Database Connection Issues

```bash
# Test connection
psql -U shopuser -d micrositeshop -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### High Memory Usage

```bash
# Check processes
pm2 list
htop

# Restart application
pm2 restart all

# Clear cache
pm2 flush
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run
```

---

## Maintenance

### Regular Tasks

#### Daily

- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Check disk space

#### Weekly

- [ ] Review performance metrics
- [ ] Check database size
- [ ] Review security logs

#### Monthly

- [ ] Update dependencies
- [ ] Security patches
- [ ] Database optimization
- [ ] Backup verification

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Backend
cd backend
npm install
npx prisma migrate deploy
pm2 restart microsite-backend

# Frontend
cd ..
npm install
npm run build
sudo cp -r dist/* /var/www/micrositeshop/

# Reload Nginx
sudo systemctl reload nginx
```

---

## Performance Optimization

### Enable Gzip Compression

```nginx
# Add to nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Enable Caching

```nginx
# Static files caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_order_created ON "Order"(created_at);
CREATE INDEX idx_product_category ON "Product"(category);

-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM ANALYZE;
```

---

## Rollback Strategy

### Quick Rollback

```bash
# Revert to previous version
git checkout <previous-commit>

# Rebuild and restart
npm run build
pm2 restart all
```

### Database Rollback

```bash
# Restore from backup
psql -U shopuser micrositeshop < backup_20241129.sql
```

---

## Support

- 📖 [Installation Guide](./INSTALLATION.md)
- 🔌 [API Documentation](./API.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🐛 [Report Issues](https://github.com/yourusername/microsite-shop/issues)

---

**Happy Deploying!** 🚀
