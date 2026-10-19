# Clothing Store Demo — WMAX Gaming Apparel

A modern, high-performance streetwear & gaming apparel e-commerce store built for **Max Gaming** (`@WmaxGaming6`), featuring an esports-inspired dark aesthetic, responsive catalog, dynamic shopping cart, and a full multi-step checkout workflow.

---

## 🎮 Features

- **Dark Mode Esports Aesthetic:** Custom visual design system featuring obsidian dark backgrounds (`#0a0b10`), neon crimson (`#ff3b53`), cyber gold (`#ffb830`), and cyan accents.
- **Product Catalog & Filtering:** Dynamic category filtering for Hoodies, Oversized T-Shirts, and Tactical Gear.
- **Persistent Shopping Cart:** Fully featured client-side cart (`localStorage`) with real-time badge counters, subtotal calculation, quantity management, and toast notifications.
- **Complete Multi-Step Checkout:**
  - Contact information with auto-updating order confirmation details.
  - Delivery address input with country and state selection.
  - Dynamic shipping options (Standard ₹199 / Express ₹350 / Free shipping on orders over ₹2,999).
  - Multiple payment methods: Credit/Debit Card, UPI / Instant QR, and Cash on Delivery (COD).
  - Promo code discounts (`WMAX10`, `FORME10`, `BGMI10`).
  - Order success modal with dynamic order ID (`#WMAX-XXXXX`), email confirmation note, and delivery estimate.
- **Official Creator Integration:** Creator showcase featuring Max Gaming's YouTube avatar, streamer bio, and social links.
- **Modular Code Architecture:** Separated styling (`css/common.css`, `css/shop.css`, `css/checkout.css`) and logic (`js/config.js`, `js/cart.js`, `js/shop.js`, `js/checkout.js`).

---

## 📁 Project Structure

```text
clothing-store-demo/
├── index.html            # Main storefront & product catalog
├── checkout.html         # Multi-step checkout page
├── style.css             # Storefront styles bundle
├── checkout.css          # Checkout styles bundle
├── script.js             # Storefront loader
├── checkout.js           # Checkout loader
├── css/
│   ├── common.css        # Design tokens, typography, header, footer, toast
│   ├── shop.css          # Hero, category pills, product grid, creator showcase
│   └── checkout.css      # Checkout form, order summary sidebar, order modal
├── js/
│   ├── config.js         # Store configuration, shipping fees, promo codes
│   ├── cart.js           # Cart service (add, remove, update, localStorage)
│   ├── shop.js           # Catalog filters, quick add, search, mobile menu
│   └── checkout.js       # Checkout form validation, totals, order submission
└── images/
    └── gamer-img.jpg     # Creator / banner asset
```

---

## 🚀 Getting Started

No build tools or external dependencies required. Simply clone and open:

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/clothing-store-demo.git
   cd clothing-store-demo
   ```
2. Open `index.html` in your browser or run with any local static server:
   ```bash
   # Using Python 3
   python -m http.server 3000
   
   # Or using Node.js / npx
   npx serve .
   ```
3. Navigate to `http://localhost:3000`.

---

## 📧 Contact & Support

- **Store Inquiries:** `growwithmax6@gmail.com`
- **YouTube:** [@WmaxGaming6](https://www.youtube.com/@WmaxGaming6)
- **Instagram:** [@wmaxfromhell](https://instagram.com/wmaxfromhell)

