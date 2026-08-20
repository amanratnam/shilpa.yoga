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

1. Set up the database:
   - **New project:** run `supabase/001_schema.sql`. It creates both tables
     from scratch, dropping any that exist first.
   - **Existing database:** run `supabase/002_align_schema.sql` instead. It
     adds whatever is missing — including the `phone` column and the
     `subscriptions` table — **without deleting any data**, migrates rows off
     the original single-table layout, and is safe to run more than once.

   If a save still fails with "column not found in the schema cache" straight
   after migrating, PostgREST is holding a stale column list; run
   `notify pgrst, 'reload schema';` (already the last line of `002`).
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
- **Sessions last one hour**, as an absolute lifetime from sign-in rather than
  an idle timeout. The signed cookie carries its own expiry and the server
  rejects it once past, so security never depends on the browser. In the tab,
  `SessionWatcher` warns for the last five minutes and then sends you to
  `/admin/login?expired=1`, so an open tab never sits on a dead session. To
  change the length, edit `SESSION_MAX_AGE` in `lib/admin/session.ts`.
- The cookie is scoped to the whole site, so **one sign-in covers every tab**.
  Signing out in one tab clears the rest: the login page broadcasts on a
  `BroadcastChannel` once the session is genuinely gone. It deliberately does
  not announce at sign-out time, which would race the request that clears the
  cookie.
- When the database cannot be read, admin pages catch the error and render an
  actionable diagnosis (`lib/admin/errors.ts`) rather than a bare 500 — Next.js
  strips Server Component error messages in production, so the pages must
  explain the problem themselves.
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
