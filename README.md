# Rentogram — Setup Guide

Tech stack: **Next.js + Tailwind CSS + AOS + Supabase + Razorpay**

## 1. Install dependencies
```bash
npm install
```

## 2. Setup environment variables
Copy `.env.example` to `.env.local` and fill in your Supabase + Razorpay keys:
```bash
cp .env.example .env.local
```

## 3. Run the dev server
```bash
npm run dev
```
Visit http://localhost:3000

## 4. Folder structure
```
rentogram/
├── app/
│   ├── layout.js          → root layout (Navbar + Footer wrapper)
│   ├── page.js            → homepage (Hero + Features)
│   ├── products/          → product listing pages
│   ├── booking/           → rental booking flow
│   ├── servicing/         → servicing request pages
│   ├── about/
│   └── contact/
├── components/
│   ├── Navbar.js
│   └── Footer.js
├── lib/
│   └── supabaseClient.js  → Supabase connection
├── styles/
│   └── globals.css        → Tailwind + soft gradient theme
├── public/images/
├── tailwind.config.js      → custom soft gradient colors
└── .env.example
```

## 5. Next steps
- Create Supabase tables: `products`, `bookings`, `servicing_requests`, `users`
- Build out `/products`, `/booking`, `/servicing` pages (currently empty folders)
- Add Razorpay payment integration in booking flow
- Add product images to Supabase Storage or Cloudinary

## Notes
- Animations are kept **moderate**: Tailwind transitions + AOS (scroll-reveal) only — no heavy animation libraries, so the site stays light and fast.
- Color theme uses a soft multi-gradient light background (indigo → cyan → pink), defined in `tailwind.config.js` and `globals.css`.
