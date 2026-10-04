import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts, searchPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on yoga, mindfulness, fitness and peace of mind, from the mat to the rest of your life, by Shilpa Yoga Space.",
  alternates: { canonical: "/blog" },
};

const PAGE_SIZE = 6;

/** Keeps the query when paging, and lands the reader on the results. */
function pageHref(page: number, q: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/blog${qs ? `?${qs}` : ""}#articles`;
}

/** 1 … 4 5 6 … 12 — every page when there are few, a window when there are many. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ["gap" as const, n] : [n]));
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q: rawQuery } = await searchParams;
  const q = (rawQuery ?? "").trim().slice(0, 80);
  const totalPosts = getAllPosts().length;
  const posts = searchPosts(q);

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pagePosts = posts.slice(start, start + PAGE_SIZE);
  const end = start + pagePosts.length;

  return (
    <>
      <BlogHero postCount={totalPosts}>
        <BlogSearch initialQuery={q} />
      </BlogHero>

      <Section tone="light" flush>
        <div
          id="articles"
          className="container-content scroll-mt-20 pb-section-sm pt-10 md:pb-section md:pt-14"
        >
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-h3">
              {q ? (
                <>
                  Results for <span className="text-brand-green">“{q}”</span>
                </>
              ) : (
                "Latest notes"
              )}
            </h2>
            {posts.length > 0 ? (
              <p className="text-small tabular-nums text-brand-stone" aria-live="polite">
                Showing {start + 1}–{end} of {posts.length}{" "}
                {posts.length === 1 ? "note" : "notes"}
              </p>
            ) : null}
          </div>

          {pagePosts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-brand border border-dashed border-brand-ink/20 bg-brand-white px-6 py-14 text-center">
              <SearchX className="h-8 w-8 text-brand-gold" strokeWidth={1.75} aria-hidden />
              <p className="text-h4">
                {q ? <>Nothing matches “{q}” yet.</> : "No notes yet, check back soon."}
              </p>
              {q ? (
                <>
                  <p className="max-w-md text-body text-brand-stone">
                    Try a simpler word like &ldquo;breath&rdquo;, &ldquo;back&rdquo; or
                    &ldquo;beginner&rdquo;, or browse everything.
                  </p>
                  <Link
                    href="/blog#articles"
                    className="inline-flex min-h-11 items-center rounded-brand bg-brand-green px-5 text-small font-medium text-brand-cream transition-colors hover:bg-brand-ink"
                  >
                    See all notes
                  </Link>
                </>
              ) : null}
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post, i) => (
                <li key={post.slug}>
                  <Reveal delay={(i % 3) * 0.07} className="h-full">
                    <BlogCard post={post} priority={i < 3} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 ? (
            <nav
              aria-label="Journal pages"
              className="mt-12 flex items-center justify-between gap-3 border-t border-brand-ink/10 pt-8 sm:justify-center"
            >
              <PageLink href={pageHref(current - 1, q)} disabled={current === 1} rel="prev">
                <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
                <span>Newer</span>
              </PageLink>

              {/* Numbers need room; phones get a plain "2 of 3" instead. */}
              <ol className="hidden items-center gap-2 sm:flex">
                {pageWindow(current, totalPages).map((n, i) =>
                  n === "gap" ? (
                    <li key={`gap-${i}`} aria-hidden className="px-1 text-brand-stone">
                      …
                    </li>
                  ) : (
                    <li key={n}>
                      <PageLink
                        href={pageHref(n, q)}
                        active={n === current}
                        aria-label={`Page ${n}`}
                      >
                        {n}
                      </PageLink>
                    </li>
                  ),
                )}
              </ol>
              <p className="whitespace-nowrap text-small tabular-nums text-brand-stone sm:hidden">
                Page {current} of {totalPages}
              </p>

              <PageLink
                href={pageHref(current + 1, q)}
                disabled={current === totalPages}
                rel="next"
              >
                <span>Older</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </PageLink>
            </nav>
          ) : null}
        </div>
      </Section>
    </>
  );
}

function PageLink({
  href,
  active,
  disabled,
  rel,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  rel?: string;
  children: React.ReactNode;
} & React.AriaAttributes) {
  const className = cn(
    "inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-brand border px-4 text-small font-medium transition-colors duration-300 ease-brand",
    active
      ? "border-brand-green bg-brand-green text-brand-cream"
      : "border-brand-ink/15 bg-brand-white text-brand-ink hover:border-brand-green hover:text-brand-green",
    disabled && "pointer-events-none opacity-40",
  );
  if (disabled) {
    return (
      <span className={className} aria-disabled {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      rel={rel}
      className={className}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
