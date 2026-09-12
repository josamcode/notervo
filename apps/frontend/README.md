# Notervo Notebook Storefront (Frontend)

React + Tailwind frontend for Notervo, a notebook-focused ecommerce experience.

## Core Features

- Notebook catalog browsing with search and filters
- Product details with wishlist and cart actions
- Checkout and order confirmation flows
- User authentication and profile pages
- Support pages: shipping, returns, privacy, terms, and help center
- Notervo brand system:
  - Primary: `#222222`
  - Secondary: `#D8D8D8`
  - Headings: Ahsing (with DG Ghayaty fallback for Arabic)
  - Body: Poppins

## Run Locally

```bash
npm install
npm start
```

Create `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Build

```bash
npm run build
```

## Notes

- The app expects backend API routes for auth, products, cart, wishlist, orders, messages, and subscribers.
- UI is intentionally minimal and monochrome to match Notervo identity.
