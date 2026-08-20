This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin panel

A password-gated client management tool lives at `/admin`.

### One-time setup

1. Run `supabase/001_clients.sql` in the Supabase SQL editor to create the
   `clients` table.
2. Copy the admin variables from `.env.example` into your environment and fill
   them in:

   | Variable | Notes |
   | --- | --- |
   | `ADMIN_USERNAME` | Defaults to `shilpa` |
   | `ADMIN_PASSWORD` | Defaults to `admin` — change this before going live |
   | `ADMIN_SESSION_SECRET` | Required. `openssl rand -base64 32` |
   | `SUPABASE_URL` | Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service-role key, server-only |

### How it works

- `proxy.ts` does an optimistic signed-cookie check on `/admin/*`;
  `verifySession()` in `lib/admin/auth.ts` is the authoritative guard and runs
  inside every admin page and Server Action.
- Yoga packages in the client form are generated from `content/pricing.ts`, the
  single source of truth that also drives the pricing cards on the classes
  pages and the enquiry form dropdown. Change a price there and it updates
  everywhere.
