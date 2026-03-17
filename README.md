<div align="center">

<br/>

<!-- Logo / Brand Mark -->
<img src="https://recuvix.in/logo.png" alt="Recuvix Logo" width="80" />

<h1>
  <strong>Recuvix</strong>
</h1>

<p>
  <em>AI-Powered Content Engine for Modern Creators &amp; Businesses</em>
</p>

<!-- Shields -->
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](./LICENSE)

<br/>

<a href="https://recuvix.in">Live Product</a> &nbsp;·&nbsp;
<a href="https://recuvix.in/docs">Documentation</a> &nbsp;·&nbsp;
<a href="https://recuvix.in/pricing">Pricing</a> &nbsp;·&nbsp;
<a href="mailto:support@recuvix.in">Contact</a>

<br/><br/>

---

</div>

## Overview

**Recuvix** is a full-stack, enterprise-grade content platform that leverages state-of-the-art AI to automate blog creation, repurpose content for social media, transcribe voice to structured articles, and connect directly to WordPress. It is built for agencies, solo founders, and growth teams who need to produce high-quality content at scale — without sacrificing authenticity or SEO performance.

> **Multi-model AI** · **Rich Editing** · **Social Repurposing** · **Voice-to-Blog** · **Credit-based Billing** · **Analytics Dashboard**

---

## Features

<table>
<tr>
<td width="50%">

### AI Content Generation
Generate publication-ready blog articles using your choice of:
- **OpenAI** (GPT-4o)
- **Anthropic** (Claude 3.5 Sonnet)
- **Google** (Gemini 1.5 Pro)
- **xAI** (Grok 2)

</td>
<td width="50%">

### Voice-to-Blog
Record or upload audio files and let **OpenAI Whisper** transcribe and structure them into fully formatted blog posts — instantly.

</td>
</tr>
<tr>
<td width="50%">

### Social Repurposing
Convert long-form blogs into:
- LinkedIn articles
- Twitter/X threads
- Platform-optimized captions

</td>
<td width="50%">

### White Label & Workspaces
Multi-workspace architecture allows agencies to manage multiple brands, clients, and content pipelines from a single dashboard.

</td>
</tr>
<tr>
<td width="50%">

### Newsletter Engine
Full subscriber management with customizable campaigns, scheduling, and analytics — powered by **Resend**.

</td>
<td width="50%">

### Security-First Architecture
Encrypted API keys, CSP headers, Supabase Row-Level Security (RLS), and Razorpay-signed webhooks out of the box.

</td>
</tr>
</table>

---

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│            Next.js 15 · React 19 · Tailwind CSS              │
│            GSAP · Framer Motion · Tiptap Editor              │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTPS
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐  ┌────────────┐  ┌────────────────┐
│  Next.js API │  │  Express   │  │   Supabase     │
│  Routes      │  │  Backend   │  │  (Postgres +   │
│  (Serverless)│  │  (Media,   │  │  Auth + RLS)   │
└──────┬───────┘  │  SEO, Exp) │  └──────┬─────────┘
       │          └────────────┘         │
       ▼                                 ▼
┌──────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                  │
│  OpenAI · Claude · Gemini · Grok · Replicate         │
│  Cloudinary · Resend · Razorpay · Unsplash · Pexels  │
└──────────────────────────────────────────────────────┘
```

---

## Project Structure

This is a **monorepo** powered by npm workspaces:

```
recuvix/
├── frontend/                  # Next.js 15 App (Main Product)
│   ├── app/                   # App Router: pages, API routes
│   │   ├── (dashboard)/       # Protected user dashboard
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # 90+ serverless API route handlers
│   │   ├── auth/              # Login, Signup, Forgot Password
│   │   ├── blog/              # Public blog viewer
│   │   ├── workspace/         # Multi-workspace management
│   │   ├── voice/             # Voice-to-blog feature
│   │   └── white-label/       # White-label client tools
│   ├── components/            # Shared UI component library
│   ├── emails/                # React Email transactional templates
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Supabase client, utils, helpers
│   └── supabase/              # Migrations and type definitions
│
├── backend/                   # Express.js Media & Export Server
│   └── src/
│       └── routes/
│           ├── upload.ts      # File upload handling
│           ├── images.ts      # Image processing (Sharp / Vibrant)
│           ├── seo.ts         # SEO metadata extraction
│           ├── thumbnail.ts   # AI thumbnail generation
│           └── export.ts      # Blog export functionality
│
├── *.sql                      # Database schemas & migrations
└── package.json               # Root workspace config
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router) | SSR, SSG, Server Actions |
| **Language** | TypeScript 5 | Type safety across the stack |
| **Styling** | Tailwind CSS 3 | Utility-first design system |
| **UI Components** | Shadcn/UI + Radix UI | Accessible, headless components |
| **Animation** | GSAP 3 + Framer Motion 12 | Micro-animations & scroll effects |
| **Smooth Scroll** | Lenis | Premium scroll behavior |
| **Rich Text Editor** | Tiptap 3 | Extensible WYSIWYG editor |
| **3D Graphics** | Three.js + React Three Fiber | Hero section 3D elements |
| **Data Fetching** | SWR | Stale-while-revalidate caching |
| **Forms** | React Hook Form + Zod | Validation & form state |
| **Backend Server** | Express.js + TypeScript | Media, export, & image APIs |
| **Database** | Supabase (PostgreSQL) | Auth, RLS, real-time data |
| **Payments** | Razorpay | Subscriptions & one-time credits |
| **Email** | Resend + React Email | Transactional & newsletter emails |
| **Media CDN** | Cloudinary | Image hosting & transformation |
| **AI Core** | OpenAI / Claude / Gemini / Grok | Blog generation & voice transcription |
| **AI Images** | Replicate | AI-generated thumbnails |
| **Stock Media** | Unsplash + Pexels | Royalty-free image search |
| **Deployment** | Vercel + Node.js Host | Frontend + Backend hosting |
| **Analytics** | Google Analytics 4 + MS Clarity | User behaviour tracking |

---

## Getting Started

### Prerequisites

- **Node.js** `v18.x` or higher
- **npm** `v9.x` or higher
- Active accounts on: Supabase, Razorpay, Resend, Cloudinary

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/recuvix.git
cd recuvix
```

### 2. Install All Dependencies

```bash
npm install
```
> This installs dependencies for both `frontend` and `backend` workspaces via npm workspaces.

### 3. Configure Environment Variables

```bash
# Copy the example env file for the frontend
cp frontend/.env.example frontend/.env.local
```

Fill in the required values (see the full list below).

### 4. Run the Application

```bash
# Start both frontend (port 3000) and backend (port 5000) simultaneously
npm run dev
```

---

## Environment Variables

Create `frontend/.env.local` with the following values. Generate secret keys with `openssl rand -hex 32`.

### Required — App Will Not Start Without These

| Variable | Description | Where to Get It |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin) | Supabase Dashboard → Settings → API |
| `ADMIN_SECRET_KEY` | Protects internal admin API routes | `openssl rand -hex 32` |
| `INTERNAL_API_KEY` | Service-to-service auth token | `openssl rand -hex 32` |
| `PLATFORM_KEY_ENCRYPTION_SECRET` | Encrypts stored AI keys at rest | `openssl rand -hex 32` |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | Razorpay Dashboard |
| `RESEND_API_KEY` | Resend transactional email key | Resend Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | Cloudinary Dashboard |

### App Configuration

```env
NEXT_PUBLIC_APP_URL=https://recuvix.in
NEXT_PUBLIC_BASE_DOMAIN=recuvix.in
SUPABASE_JWT_SECRET=
```

### Payments (Razorpay)

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_PAYOUT_KEY_ID=
RAZORPAY_PAYOUT_KEY_SECRET=
```

### Email (Resend)

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@recuvix.in
```

### Media (Cloudinary)

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### AI & Platform Keys

```env
PLATFORM_WHISPER_KEY=           # OpenAI key for Whisper transcription
PLATFORM_KEY_ENCRYPTION_SECRET= # AES encryption secret for stored keys
PLATFORM_OPENAI_KEY_1=
PLATFORM_CLAUDE_KEY_1=
PLATFORM_GEMINI_KEY_1=
PLATFORM_GROK_KEY_1=
REPLICATE_API_TOKEN=            # For AI image generation
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
```

### Infrastructure

```env
VERCEL_API_TOKEN=
VERCEL_PROJECT_ID=
SUPABASE_STORAGE_BUCKET_VOICE=voice-recordings
```

### Analytics (Optional)

```env
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

---

## Deployment

### Frontend → Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/).
3. Set the **Root Directory** to `frontend`.
4. Add all environment variables from `frontend/.env.local` in the Vercel dashboard.
5. Deploy. Vercel handles CI/CD automatically on every push to `main`.

### Backend → Any Node Host (Railway, Render, Fly.io)

```bash
cd backend

# Build the TypeScript source
npm run build

# Start the production server (runs on PORT env var, defaults to 5000)
npm start
```

### Database → Supabase

Run the provided SQL migration files in order against your Supabase project:

```bash
# Example (Supabase CLI)
supabase db push
```

Or apply manually via the Supabase SQL editor in the following order:

1. `supabase_schema.sql`
2. `credit_system.sql`
3. `workspace_schema.sql`
4. `calendar_schema.sql`
5. `white_label_schema.sql`
6. `voice_recordings_schema.sql`

---

## Security

- **HTTP Security Headers** — HSTS, CSP, X-Frame-Options, Referrer-Policy configured in `next.config.mjs`
- **Supabase RLS** — Row-Level Security policies on all sensitive tables
- **Encrypted API Keys** — Third-party keys stored encrypted with AES-256-GCM
- **Webhook Verification** — All Razorpay webhook payloads are signature-verified
- **JWT Auth** — Supabase JWTs validate all server-side requests via middleware

---

## Contributing

We maintain a private internal development workflow. If you are part of the team, please refer to the internal CONTRIBUTING guide. For external inquiries, reach us at [dev@recuvix.in](mailto:dev@recuvix.in).

---

## License

This project is proprietary software. All rights reserved. Unauthorized use, distribution, or modification is prohibited.

---

<div align="center">

Built with care by the **Recuvix Team**

[recuvix.in](https://recuvix.in) &nbsp;·&nbsp; [LinkedIn](https://linkedin.com/company/recuvix) &nbsp;·&nbsp; [Twitter/X](https://x.com/recuvix)

</div>
