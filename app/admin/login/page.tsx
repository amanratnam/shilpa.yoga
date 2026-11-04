import { redirect } from "next/navigation";

/** The sign-in page moved to /admin. Old links and bookmarks still land. */
export default async function LegacyLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  const qs = params.toString();
  redirect(`/admin${qs ? `?${qs}` : ""}`);
}
