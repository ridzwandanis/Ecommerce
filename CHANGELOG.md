# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Image Upload System:** Integrated Cloudflare R2 for cloud storage with automatic fallback to local storage
- **AVIF Conversion:** All uploaded images automatically converted to AVIF format (30-50% smaller files)
- **Blog System:** Complete blog/article management with featured images
- **Category Icons:** Added icon field to categories for better visual representation
- **Image Upload Component:** Reusable ImageUpload component with drag-and-drop support

### Changed

- **Image Processing:** Implemented Sharp library for image optimization and format conversion
- **Storage Strategy:** Dual storage support (Cloudflare R2 for production, local for development)
- **Admin Forms:** Fixed accessibility issues in ProductForm and BlogPostForm dialogs
- **Vite Configuration:** Added proxy for local image serving during development

### Technical

- Added Sharp dependency for image processing
- Integrated AWS SDK for S3-compatible storage
- Implemented automatic AVIF conversion with quality optimization
- Added Multer for multipart/form-data handling
- Updated documentation for image upload and storage architecture

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

## [1.1.0] - 2025-11-30

### Added

- **Mobile-First UI/UX:** Complete redesign of Home, Product Detail, and Checkout pages to provide a native app-like experience.
- **Navigation:** Added sticky Mobile Header, Bottom Navigation bar, and Drawer menu.
- **Location Caching:** Implemented database caching for RajaOngkir location data (Provinces, Cities, Districts) to significantly reduce API calls and prevent rate limiting.
- **Components:** Added `CategoryGrid`, `NewArrivals` horizontal carousel, `MobileHeader`, `BottomNav`, and modernized `ProductCard`.
- **Database:** Added `Province`, `City`, and `District` tables for location caching.

### Changed

- **Admin Dashboard:** Fully translated the Admin interface to Indonesian.
- **Product Card:** Updated to a borderless, portrait-aspect design with a floating cart button.
- **Cart:** Fixed rendering issues with category objects and standardized currency formatting to IDR.
- **Performance:** Optimized API usage by caching static location data in the database.

### Fixed

- Fixed `Objects are not valid as a React child` error in Cart.
- Fixed currency symbol consistency (changed `$` to `Rp`).
- Fixed API rate limiting (429) errors by implementing caching.

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
