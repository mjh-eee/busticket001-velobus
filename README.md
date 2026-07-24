# 🚌 VeloBus — Premium Bus Ticket Booking Platform

A modern, premium bus ticket booking website built with **Next.js 14 (App Router)**, **MongoDB**, and **Tailwind CSS**. Designed with the polish and confidence of a well-funded travel-tech startup — bold, fast, and effortless to use.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- **Animated Route Search** — bold gradient hero with From/To/Date/Passengers widget
- **Smart Search Results** — filter by bus type, price, timing, operator & amenities
- **Interactive Seat Map** — real-time color-coded seat selection with live seat locking
- **Seamless Checkout** — passenger details, boarding points, coupons & fare breakdown
- **Digital Tickets** — QR-coded e-tickets with PDF download & calendar sync
- **User Dashboard** — manage upcoming/past bookings, cancellations & refunds
- **Operator/Admin Panel** — manage routes, schedules, pricing & revenue analytics
- **Buttery Animations** — scroll reveals, skeleton loaders, and smooth page transitions
- **Fully Responsive** — mobile-first with sticky bottom CTAs for on-the-go booking

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router, Server Actions) |
| Database | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| Auth | [NextAuth.js](https://next-auth.js.org/) (Email/Password + Google) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Forms & Validation | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Payments | Stripe / SSLCommerz |

---

## 📁 Project Structure

```
ridebook/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (main)/
│   │   ├── page.tsx                # Landing page
│   │   ├── search/
│   │   ├── seats/[scheduleId]/
│   │   ├── checkout/
│   │   └── confirmation/[bookingId]/
│   ├── dashboard/
│   │   ├── bookings/
│   │   └── profile/
│   ├── admin/
│   │   ├── routes/
│   │   ├── schedules/
│   │   └── analytics/
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── search/
│       ├── seats/
│       ├── bookings/
│       └── payments/
├── components/
│   ├── ui/                         # Button, Card, Modal, Stepper
│   ├── SearchWidget.tsx
│   ├── BusCard.tsx
│   ├── SeatMap.tsx
│   ├── FareSummary.tsx
│   └── Navbar.tsx
├── models/
│   ├── User.ts
│   ├── Bus.ts
│   ├── Route.ts
│   ├── Schedule.ts
│   ├── Booking.ts
│   └── Payment.ts
├── lib/
│   ├── db.ts                       # MongoDB connection
│   └── validators/                 # Zod schemas
├── scripts/
│   └── seed.ts                     # Dummy data seeder
├── public/
├── .env.example
├── tailwind.config.ts
├── next.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+
- MongoDB Atlas cluster or local MongoDB instance
- Stripe / SSLCommerz account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ridebook.git
cd ridebook

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Seed the Database

```bash
npm run seed
```

This populates MongoDB with realistic dummy routes, buses, and schedules so the app is demo-ready immediately.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🎟 Booking Flow

```
Search  →  Select Bus  →  Choose Seats  →  Passenger Details  →  Payment  →  Confirmation
```

Each step includes a progress indicator, inline validation, and optimistic UI updates for a smooth, frustration-free experience.

---

## 🎨 Customization

- **Colors & Fonts** — edit `tailwind.config.ts` (default: indigo → teal gradients with Space Grotesk headings + Inter body text)
- **Seat Map Layout** — configure rows/columns and seat types in `components/SeatMap.tsx`
- **Payment Gateway** — swap between Stripe and SSLCommerz in `lib/payments/`
- **Branding** — update logo, favicon, and copy across `components/Navbar.tsx` and the landing page

---

## 📱 Responsiveness

Mobile-first design with sticky bottom action bars, swipeable filters, and touch-optimized seat selection — tested across:
- Mobile (< 640px)
- Tablet (640px – 1024px)
- Desktop (> 1024px)

---

## ♿ Accessibility

- Semantic HTML & ARIA labels throughout
- Fully keyboard-navigable seat map
- Sufficient color contrast on all interactive elements
- Screen-reader-friendly form error messaging

---

## 📄 License

This project is licensed under the MIT License — free to use and modify for personal or commercial projects.

---

## 🙌 Credits

Design & UX inspired by modern travel-tech platforms. Built with ❤️ using Next.js, MongoDB, and Tailwind CSS.