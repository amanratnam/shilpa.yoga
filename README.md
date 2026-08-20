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

- **`/admin`** — overview home, with counts and links into each section.
  `/admin/login` is a separate route and stays reachable even when signed in,
  so there is always a way to log in or switch user.
- **`/admin/clients`** — the client repository, doubling as the newsletter
  list. Name, age, gender, optional email, how they found us, status
  (active / potential / churned) and notes. Each client has a detail page
  showing their full **subscription history** as an audit trail.
- **`/admin/subscriptions`** — every package sold. A subscription is always
  attached to an existing client, so add the person first. Each has a detail
  page with a **Generate receipt** button that downloads a branded PDF.

Both lists support adding and editing in place.

### One-time setup

1. Run `supabase/001_schema.sql` in the Supabase SQL editor. **It drops and
   recreates the `clients` and `subscriptions` tables**, so export anything you
   want to keep first.
2. Copy the admin variables from `.env.example` into your environment:

   | Variable | Notes |
   | --- | --- |
   | `ADMIN_USERNAME` | Defaults to `shilpa` |
   | `ADMIN_PASSWORD` | Defaults to `admin` — change this before going live |
   | `ADMIN_SESSION_SECRET` | Required. `openssl rand -base64 32` |
   | `SUPABASE_URL` | Supabase project URL (server-only, no `NEXT_PUBLIC_`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service-role key, server-only |

### How it works

- `proxy.ts` does an optimistic signed-cookie check on `/admin/*`;
  `verifySession()` in `lib/admin/auth.ts` is the authoritative guard and runs
  inside every admin page and Server Action.
- Email is optional, but unique when given — a partial unique index means any
  number of clients may have no email, while no two can share one.
- Receipts are drawn with `pdf-lib` in `lib/admin/receipt.ts` and served by
  `app/admin/subscriptions/[id]/receipt/route.ts`. The brand logo is fetched
  from the image CDN; if that fetch fails the receipt still renders, with a
  typographic wordmark instead. Amounts print as "Rs." because the PDF
  standard fonts have no rupee glyph.
- Yoga packages in the subscription form are generated from
  `content/pricing.ts`, the single source of truth that also drives the pricing
  cards on the classes pages and the enquiry form dropdown. Change a price
  there and it updates everywhere.
