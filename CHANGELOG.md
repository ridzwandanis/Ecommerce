# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of Microsite Shop
- Product management system with CRUD operations
- Shopping cart with local storage persistence
- RajaOngkir API integration for shipping cost calculation
- Multi-courier support (JNE, TIKI, POS Indonesia)
- User authentication and authorization
- Admin dashboard with analytics
- Order management system
- Responsive design for mobile and desktop
- Docker support for easy deployment

### Features

#### Customer Features

- Browse product catalog
- Add products to cart
- Calculate shipping costs based on location
- Select courier and service type
- Place orders with automatic stock deduction
- View order history
- Track order status

#### Admin Features

- Manage products (create, update, delete)
- View and update order status
- Dashboard with revenue analytics
- Low stock alerts
- Store settings management

### Technical

- Full TypeScript implementation
- Prisma ORM with PostgreSQL
- JWT authentication
- React Query for data fetching
- Tailwind CSS with shadcn/ui components
- Database transactions for data consistency
- Environment-based configuration

## [1.0.0] - 2024-11-29

### Added

- Initial public release

---

## Version History

### How to Update

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install
cd backend && npm install

# Run migrations
cd backend && npx prisma migrate deploy

# Restart services
docker-compose restart
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
