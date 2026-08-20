# Nori Coffee — Drink Ordering & Delivery Website

A full-featured drink ordering and delivery web app built with **React + React Router**
on the frontend and **Firebase (Authentication + Firestore)** on the backend.
Firebase Storage is intentionally not used — drink images are plain URL strings.

## What's included

- Customer flow: register/login/reset password, browse & search drinks, cart,
  checkout with saved delivery information + QR payment, order placement,
  order history, and live order tracking.
- Admin dashboard: stats overview, full drink CRUD (with an Image URL field +
  live preview instead of file uploads), order management with status
  updates, and a customer list.
- All data (drinks, users, orders, order status, delivery information) is
  persisted in Firestore and survives refreshes/restarts — nothing is stored
  only in React state or localStorage (the cart is the one intentional
  exception, since it's a pre-checkout draft).
- **Order snapshots**: once a customer confirms an order, its items, prices,
  totals, and delivery information are frozen exactly as they were at that
  moment. Editing your Account's delivery info afterward never changes past
  orders — only future ones. Only admins can update an order's status.
- Role-based route protection: customers can never reach `/admin/*`.

## 1. Set up your Firebase project

1. Go to the Firebase Console (console.firebase.google.com) and create a new project.
2. **Authentication** -> Sign-in method -> enable **Email/Password**.
3. **Firestore Database** -> Create database (start in production mode).
4. Project settings -> General -> "Your apps" -> add a **Web app** -> copy the config values.

(No Storage setup needed — drink images are just URLs.)

## 2. Configure the app

```
cp .env.example .env
```

Paste your Firebase config values into `.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Deploy security rules

`firestore.rules` is included at the project root. Using the Firebase CLI:

```
npm install -g firebase-tools
firebase login
firebase init   # select Firestore, point to the existing firestore.rules file
firebase deploy --only firestore:rules
```

(Or paste its contents directly into the Firebase Console under Firestore -> Rules.)

## 4. Create your first admin account

The app only ever creates **customer** accounts through the Register page
(see `src/firebase/auth.js`) — this is intentional, so random visitors can't
grant themselves admin access. To create an admin:

1. Register a normal account through the app.
2. In the Firebase Console -> Firestore -> `users` collection, find that
   user's document and change its `role` field from `customer` to `admin`.
3. Log out and back in — you'll now be able to reach `/admin`.

## 5. Install and run

```
npm install
npm run dev
```

Build for production:

```
npm run build
```

## 6. Drink images

Instead of uploading files, admins paste an **Image URL** when adding or
editing a drink (Admin Dashboard -> Manage Drinks). The form shows a live
preview and validates that the link looks like a real URL before saving.
Any publicly reachable image URL works — your own hosting, Imgur, Unsplash,
Cloudinary, etc.

## 7. Other placeholder assets

Everything else stays centralized under `src/assets/` so you can drop in
real files without touching component code:

```
src/assets/logo.png        -> Nori Coffee logo (used in navbar, auth pages, admin sidebar)
src/assets/qr-code.png     -> your real payment QR code (used at Checkout)
src/assets/about/          -> About page photo(s)
```

Just keep the same filenames and everything updates automatically.

## Project structure

```
src/
├── assets/          # logo, qr code, about images (swap freely)
├── components/
│   ├── common/       # Navbar, Footer, route guards, dialogs, alerts...
│   ├── customer/      # DrinkCard, CartItemRow, DeliveryLocationForm, DeliveryInfoDisplay...
│   └── admin/         # AdminSidebar, DrinkFormModal, StatCard...
├── pages/
│   ├── customer/      # Home, About, Cart, Checkout, History, Account, auth...
│   └── admin/          # Dashboard, ManageDrinks, ManageOrders, ManageCustomers...
├── layouts/          # CustomerLayout, AdminLayout, AuthLayout
├── context/          # AuthContext (user/role), CartContext
├── firebase/          # config.js, auth.js, firestore.js — all Firebase logic
├── utils/            # formatPrice, constants (order statuses, categories)
└── styles/            # global.css — Nori Coffee design tokens
```

## Firestore data model

```
users/{uid}
  uid, name, email, phone, role
  description        # personal note on the account, unrelated to delivery
  delivery: {
    fullName, phone, city, address, googleMapsUrl, deliveryNote
  }
  createdAt

drinks/{id}
  name, description (optional), price, category, imageUrl, available, createdAt, updatedAt

orders/{id}
  userId, items[], subtotal, deliveryFee, total, status, createdAt, updatedAt
  deliveryInfo: {
    fullName, phone, city, address, googleMapsUrl, deliveryNote
  }
  # ^ a frozen snapshot of the customer's delivery info at order time —
  #   never a live reference to their current Account settings.
```
