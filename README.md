# LD Watches

A premium luxury watch e-commerce website built with **Next.js 15**, **MongoDB**, and **Tailwind CSS**. Features a black/grey/gold theme, admin panel for watch management, and WhatsApp integration for orders.

## Features

- **Beautiful UI** — Black, grey, and gold theme with Framer Motion animations
- **Watch Catalog** — Browse watches by category with filtering
- **Watch Details** — Full product pages with specifications and image gallery
- **WhatsApp Integration** — One-click order inquiry with pre-filled watch details
- **Admin Panel** — Full CRUD for watches with image upload
- **Responsive Design** — Mobile-first, works on all devices

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Auth:** JWT-based admin authentication

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (country code, no +) |
| `NEXT_PUBLIC_SITE_URL` | Your site URL |

3. **Create the admin account:**

```bash
npm run create-admin
```

This creates (or updates) an admin in MongoDB with:
- Email: `admin@ldwatches.com`
- Password: `admin123`

4. **Start the development server:**

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Admin Panel

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin) — shows login if not authenticated, dashboard if logged in
- Use the credentials from your `.env.local` file

## Project Structure

```
src/
├── app/
│   ├── (site)/              # Public pages
│   │   ├── page.tsx         # Home page
│   │   └── watches/         # Catalog & detail pages
│   ├── admin/               # Admin panel
│   │   ├── login/           # Admin login
│   │   └── (dashboard)/     # Protected admin routes
│   └── api/                 # API routes
│       ├── watches/         # Watch CRUD
│       ├── auth/            # Admin authentication
│       └── upload/          # Image upload
├── components/
│   ├── admin/               # Admin components
│   ├── home/                # Home page sections
│   ├── layout/              # Navbar, Footer
│   ├── ui/                  # Reusable UI components
│   └── watches/             # Watch-related components
├── lib/                     # Utilities & database
├── models/                  # Mongoose models
└── types/                   # TypeScript types
```

## Watch Model

Each watch includes:

- Name, slug, brand, category
- Description & short description
- Price & original price (for discounts)
- Multiple images
- Stock status & featured flag
- Specifications (movement, case material, strap, water resistance, dial color, case size)

## WhatsApp Integration

Every watch has an "Order via WhatsApp" button that opens a chat with pre-filled details including watch name, brand, category, price, and a link to the product page.

## Production

```bash
npm run build
npm start
```

For production, ensure you:
- Use a strong `JWT_SECRET`
- Set `NEXT_PUBLIC_SITE_URL` to your domain
- Use MongoDB Atlas or a managed MongoDB instance
- Set Cloudinary credentials so watch images upload to the cloud

## License

Private — LD Watches
