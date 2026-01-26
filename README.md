# ByteForge Webshop

A full-stack e-commerce webshop built for a web development course. Browse, filter, and purchase gaming gear with user authentication, reviews, and admin controls.

## Tech Stack

**Frontend:**

- React 18+ with TypeScript
- Vite (build tool)
- SCSS (styling)
- Context API (state management)
- React Router (navigation)

**Backend:**

- Node.js with Express
- Supabase (PostgreSQL database)
- JWT authentication

**Deployment:**

- Vercel (frontend)
- Supabase (database)
- Git (version control)

## Features

- Product catalog with category filtering
- Shopping cart with checkout
- User authentication & account management
- Product reviews and ratings
- Admin dashboard (product/promo/discount management)
- Responsive design (mobile, tablet, desktop)
- Toast notifications
- Order history tracking

## Project Structure

```
byteForge/
├── src/
│   ├── components/      # Organized by feature (category, product, shop, etc.)
│   ├── pages/           # Route pages
│   ├── context/         # State management
│   ├── styles/          # SCSS organized by feature
│   ├── api/             # API helpers
│   ├── utils/           # Utility functions
│   └── App.tsx
├── public/              # Static assets
└── index.html

byteForge-backend/
├── routes/              # API endpoints
├── api/                 # Vercel serverless functions
└── server.js            # Express server
```

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

**Frontend:**

```bash
cd byteForge
npm install
```

**Backend:**

```bash
cd byteForge-backend
npm install
```

### Environment Variables

Create `.env.local` in `byteForge/`:

```
VITE_API_URL=http://localhost:5000
```

Create `.env` in `byteForge-backend/`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
ADMIN_PASSWORD=your_admin_password
```

## Build & Run

### Development

**Frontend (with Vite):**

```bash
cd byteForge
npm run dev
```

**Backend (Express):**

```bash
cd byteForge-backend
npm start
```

### Production

**Build frontend:**

```bash
cd byteForge
npm run build
```

**Deploy:**

- Frontend: Push to GitHub → Vercel auto-deploys
- Backend: Deploy to Vercel or your hosting platform

## Notes

- Components and styles are organized by feature (category, product, shop, etc.)
- All 5 context providers handle state: Cart, Product, User, Toast, Review
- Admin dashboard protected with password
- Product images stored on Supabase
- Cart persisted to localStorage and database

---

Built for learning purposes as part of a web development course.
