# TechSphere 🌐

> **A production-grade platform for discovering, creating, and managing developer events — built for scale.**

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-techsphere--app.vercel.app-brightgreen?style=for-the-badge)](https://tech-sphere-red.vercel.app/)
[![GitHub](https://img.shields.io/badge/💻_GitHub-Tanish196%2FtechSphere-blue?style=for-the-badge)](https://github.com/Tanish196/techSphere)

</div>

---

## 📖 Project Overview

TechSphere is a full-stack web application that bridges the gap between **event organizers and the developer community**. It delivers a streamlined experience for organizing events, managing registrations, and automatically engaging attendees — all backed by a modern, scalable architecture.

Built with **Next.js 16 App Router**, **MongoDB**, **Cloudinary**, and **Resend**, it demonstrates real-world engineering decisions: server-side media pipelines, transactional email workflows, idempotent booking logic, and production-safe analytics initialization.

---

## 💡 Problem Statement

Developer events are fragmented across Meetup, Eventbrite, Twitter threads, and Discord servers. Organizers have no lightweight, unified tool to publish events, collect registrations, and confirm attendees automatically. **TechSphere solves this** with a centralized, mobile-first platform that handles everything from image optimization to automated email confirmations.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Routing, SSR, Server Components |
| **React 19** | UI component model |
| **Tailwind CSS v4** | Utility-first styling, dark theme |
| **Lucide React** | Icon system |

### Backend & Data
| Technology | Purpose |
|---|---|
| **Next.js Server Actions** | Secure server-side mutations |
| **MongoDB + Mongoose** | Data persistence & schema validation |
| **Cloudinary** | CDN, image upload & optimization |
| **Resend** | Transactional email delivery |

### Analytics & Deployment
| Technology | Purpose |
|---|---|
| **PostHog** | Product analytics & event tracking |
| **Vercel** | Deployment & edge runtime |

---

## ✨ Key Features

- **Event Discovery** — Paginated listing with SSR for SEO-optimized pages; load-more UX without full page refreshes.
- **Event Creation** — Rich form with real-time auto-generated URL slugs, image upload via Cloudinary, and agenda management.
- **Idempotent Booking System** — Compound unique index on `(eventId, email)` prevents duplicate registrations at the database level with graceful client-side error handling.
- **Transactional Email Pipeline** — Booking triggers a styled HTML confirmation email via Resend containing date, time, venue, organizer, agenda, and a deep link to the event.
- **Optimized Media Pipeline** — Images are processed server-side with retry logic (3 attempts, exponential backoff) and a 120s upload timeout before the URL is stored in MongoDB.
- **Production-Safe Analytics** — PostHog initialized once in `instrumentation-client.ts` with a browser guard to prevent SSR double-initialization.
- **Dark-Theme UI** — Glassmorphism-inspired, fully responsive interface with accessible custom form controls and consistent design tokens.

---

## 🏗️ Architecture & Workflow

```
User Request
     │
     ▼
Next.js App Router (SSR / Server Components)
     │
     ├─── Event Pages → getAllEvents() Server Action → MongoDB
     │
     ├─── Event Creation
     │       ├─ Image → Cloudinary (server-side, retry logic)
     │       ├─ Slug auto-generated from title
     │       └─ Event metadata → MongoDB
     │
     └─── Booking Flow
             ├─ createBooking() Server Action
             ├─ Duplicate check (DB unique index)
             ├─ Booking → MongoDB
             └─ Event details fetched → Resend email → Attendee inbox
```

1. **Routing** — App Router handles nested layouts and persistent UI shells.
2. **Data Layer** — Mongoose models with validators, pre-save hooks, and compound indexes.
3. **Media** — Base64 upload to Cloudinary server-side; only the CDN URL is stored in the database.
4. **Booking** — Server Action validates uniqueness, persists the booking, then dispatches a transactional email. Booking success is decoupled from email delivery — email failure never blocks a confirmed registration.
5. **Analytics** — PostHog tracks `event_booked` and exceptions client-side, with a `__loaded` safety guard.

--- 

## ⚙️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tanish196/techSphere.git
cd techSphere/my-app

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env.local

# 4. Start the development server
npm run dev
# → http://localhost:3000

# 5. Production build
npm run build && npm start
```

---

## 🔑 Environment Variables

Create a `.env.local` file at the project root:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Cloudinary (Image CDN)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=TechSphere <you@yourdomain.com>

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🧭 Usage

| Role | Action |
|---|---|
| **Attendee** | Browse events → click to view details → enter email to register → receive confirmation email |
| **Organizer** | Navigate to **Create Event** → fill form (title, date, venue, image, agenda) → publish |

- The first 6 events are shown on the landing page. Click **"Explore All Events"** for paginated browsing.
- Duplicate registrations are blocked at the database level and surfaced as a clear UI message.
- Confirmation emails include the full event agenda, venue info, and a direct link back to the event page.

---

## 💡 Challenges & Learnings

- **Cloudinary Timeouts** — Large image uploads against Cloudinary's REST API hit default timeouts. Mitigated by migrating to base64 server-side upload, configuring a 120s timeout, and implementing 3-attempt exponential backoff retry logic.
- **Analytics Double Init** — PostHog initialized on both client and server due to `providers.tsx` running before hydration. Fixed by moving initialization exclusively to `instrumentation-client.ts` with an explicit `typeof window !== 'undefined'` guard.
- **Idempotent Bookings** — Relying solely on application-level uniqueness checks creates race condition windows. Applied a compound MongoDB unique index `{ eventId, email }` as the source of truth, with E11000 error handling mapped to user-friendly messages.
- **Module Resolution on Vercel** — `ExploreBtn` vs `ExploreButton` casing mismatch caused "Module Not Found" on Linux-based Vercel while passing locally on Windows (case-insensitive FS). Fixed by clearing `.next` cache and aligning import paths to exact filenames.
- **Body Size Limits** — Default Next.js API body limit was too small for event banner uploads. Configured custom `10MB` limit in the API route config.

---

## 🚀 Future Improvements

- **Authentication** — Integrate Clerk or NextAuth for organizer accounts, protected dashboards, and attendee profiles.
- **QR Code Tickets** — Generate unique QR codes per booking for on-site check-in verification.
- **Advanced Search & Filters** — Full-text search, location filtering, and tag-based discovery.
- **Social Sharing** — One-click event sharing to LinkedIn and Twitter.
- **Test Coverage** — Unit tests for Server Actions and integration tests for booking/email workflows.
- **Rate Limiting** — Protect booking endpoints from spam registrations using Upstash or middleware-level rate limiting.

---

## 👤 Author

**Tanish Jagetiya**

[![GitHub](https://img.shields.io/badge/GitHub-Tanish196-black?style=flat-square&logo=github)](https://github.com/Tanish196)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/tanishjagetiya/)

---
