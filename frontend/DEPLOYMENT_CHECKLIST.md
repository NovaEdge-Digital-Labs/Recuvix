# Recuvix Deployment Checklist: Environment Variables

This document provides a complete audit of all environment variables required for Recuvix.

## Required Variables (Must be set for the app to start)

| Variable | Description | Source |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Admin) | Supabase Dashboard |
| `ADMIN_SECRET_KEY` | Secret key for admin-only API routes | Generate with `openssl rand -hex 32` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | Razorpay Dashboard |
| `RESEND_API_KEY` | Resend API Key for emails | Resend Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Cloudinary Dashboard |
| `PLATFORM_KEY_ENCRYPTION_SECRET` | Secret for encrypting platform keys | Generate with `openssl rand -hex 32` |
| `INTERNAL_API_KEY` | Secret key for internal service-to-service communication | Generate with `openssl rand -hex 32` |

## Suppabase Variables

- `SUPABASE_JWT_SECRET`: Used for authenticating Supabase requests.

## App Configuration

- `NEXT_PUBLIC_APP_URL`: The full URL of the application (e.g., `https://recuvix.in`).
- `NEXT_PUBLIC_BASE_DOMAIN`: The base domain (e.g., `recuvix.in`).

## Payments (Razorpay)

- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay Public Key.
- `RAZORPAY_WEBHOOK_SECRET`: Secret for verifying Razorpay webhooks.
- `RAZORPAY_PAYOUT_KEY_ID`: Razorpay Payouts Key ID.
- `RAZORPAY_PAYOUT_KEY_SECRET`: Razorpay Payouts Key Secret.

## Email (Resend)

- `RESEND_FROM_EMAIL`: The email address to send from (e.g., `noreply@recuvix.in`).

## Media (Cloudinary)

- `CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name.
- `CLOUDINARY_API_KEY`: Cloudinary API Key.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Public Cloudinary Cloud Name.

## AI & Storage

- `PLATFORM_WHISPER_KEY`: OpenAI API Key for Whisper transcription.
- `PLATFORM_OPENAI_KEY_1`, `PLATFORM_CLAUDE_KEY_1`, etc.: Keys used for seeding the `platform_api_keys` table.
- `SUPABASE_STORAGE_BUCKET_VOICE`: Name of the Supabase storage bucket for voice recordings (default: `voice-recordings`).
- `UNSPLASH_ACCESS_KEY`: Unsplash API Access Key.
- `PEXELS_API_KEY`: Pexels API Key.
- `REPLICATE_API_TOKEN`: Replicate API Token for image generation.

## Infrastructure (Vercel)

- `VERCEL_API_TOKEN`: Vercel Personal Access Token.
- `VERCEL_PROJECT_ID`: Vercel Project ID.

## Optional Analytics

- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`: Google Analytics 4 Measurement ID.
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`: Microsoft Clarity Project ID.

---

### How to generate secret keys

Run the following command in your terminal for each key:

```bash
openssl rand -hex 32
```
