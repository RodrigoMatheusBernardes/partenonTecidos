# 🏛️ Project Context: Parthenon Tecidos

Parthenon Tecidos is an exclusive, high-end e-commerce platform dedicated to selling premium, sophisticated fabrics. Standard retail approaches do not fit this brand; instead, the system is designed to simulate the elegant, deliberate selection of luxury fashion houses (like Loro Piana, Hermès, and Brunello Cucinelli). It caters specifically to architects, interior designers, premium tailors, and direct consumers seeking absolute quality and craftsmanship.

---

## 🛠️ Complete Technology Stack

### Frontend
- **Framework:** Next.js 15+ (App Router, Server & Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (configured with luxury design tokens in `tailwind.config.js` and responsive typography in `globals.css`)
- **Icons:** Lucide React
- **State Management:** React Context (AuthContext for user sessions, CartContext for shopping cart state)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose (defined in `backend/src/database.js`)
- **Storage/CDN:** Cloudinary (configured in `backend/package.json` for persistent media storage, as well as a local fallback in `backend/uploads/`)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing

---

## 📁 Repository Structure & Key Entry Points

- **`/frontend`**: Next.js client-side application.
  - **`/app`**: App router containing page routes (e.g., `/admin`, `/loja`, `/produto`, `/categoria/[slug]`).
  - **`/components`**: Reusable visual parts. UI elements are structured inside `/ui/` (such as `Button.tsx`, `ProductCard.tsx`) while layout compositions reside in `/layout/` (like `Header.tsx`, `Footer.tsx`).
  - **`/context`**: Global states for user session authentication (`AuthContext.tsx`) and cart state management (`CartContext.tsx`).
- **`/backend`**: Express.js backend.
  - **`/src`**: REST API containing route mappings (`/routes`), business logic (`/controllers`), Mongoose database connection schema, and models.
  - **`/uploads`**: Fallback folder for uploaded product images.

---

## 💼 Core Business Rules & Objectives

1. **Understated Luxury Branding:**
   Avoid urgent marketing tricks. There are no "HURRY BUY NOW" triggers. All copy, fonts, layouts, and animations must breathe luxury, elegance, and durability.
   
2. **Premium B2B/B2C Pricing & Quantity:**
   Fabrics are investments. The product page provides complete details of fibers, weight, texture, and origins.

3. **High-Value Integrations:**
   - **Cloudinary:** Used to host and deliver high-definition product imagery with optimized sizes and quick load times.
   - **Mongoose / MongoDB:** Provides the flexibility to organize complex product structures (compositions, colors, variants, and stock measurements).
   - **PIX & Correios (Upcoming):** Directly planned for instant checkout payment and integrated premium delivery services.
