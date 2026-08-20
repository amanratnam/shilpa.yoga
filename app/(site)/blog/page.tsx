import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getAllPosts, formatDate } from "@/lib/blog";
import { blogCover } from "@/content/images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on yoga, mindfulness, fitness and peace of mind, from the mat to the rest of your life, by Shilpa Yoga Space.",
  alternates: { canonical: "/blog" },
};

const PAGE_SIZE = 3;
const topics = ["Yoga", "Mindfulness", "Fitness", "Peace of mind", "Pre & post-natal"];

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const posts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pagePosts = posts.slice(start, start + PAGE_SIZE);

  return (
    <>
      {/* Creative, compact header */}
      <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl"
        />
        <div className="container-content relative grid items-end gap-6 pb-12 pt-28 md:gap-10 md:pb-16 md:pt-32 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Eyebrow>The Journal</Eyebrow>
            <h1 className="mt-3 text-h1 text-balance">
              Yoga, mindfulness &amp; a quieter mind
            </h1>
          </div>
          <div className="flex flex-col gap-5 lg:pb-2">
            <p className="max-w-md text-body text-brand-cream/80">
              Notes on movement, breath, fitness and peace of mind, from the mat
              to the rest of your life.
            </p>
            <ul className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <li
                  key={t}
                  className="rounded-brand border border-brand-cream/25 px-3 py-1 text-eyebrow uppercase tracking-[0.1em] text-brand-cream/80"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section tone="light" flush>
        <div className="container-content pb-section-sm pt-10 md:pb-section md:pt-14">
          {pagePosts.length === 0 ? (
            <p className="text-body text-brand-stone">No posts yet, check back soon.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {pagePosts.map((post, i) => {
                const imageLeft = i % 2 === 0;
                return (
                  <Reveal key={post.slug} delay={i * 0.05}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group grid overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(31,61,46,0.4)] md:grid-cols-[2fr_3fr]"
                    >
                      <div
                        className={cn(
                          "relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[260px]",
                          !imageLeft && "md:order-2",
                        )}
                      >
                        <SmartImage
                          image={blogCover(post.cover)}
                          fill
                          sizes="(min-width: 768px) 40vw, 100vw"
                          className="transition-transform duration-500 ease-brand group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-3 p-7 md:p-9">
                        <div className="flex items-center gap-3 text-small text-brand-stone">
                          <span className="text-eyebrow uppercase tracking-[0.1em] text-brand-gold">
                            {post.tags[0] ?? "Practice"}
                          </span>
                          <span aria-hidden>·</span>
                          <span>{formatDate(post.date)}</span>
                          <span aria-hidden>·</span>
                          <span>{post.readingTime}</span>
                        </div>
                        <h2 className="text-h3">{post.title}</h2>
                        <p className="text-body text-brand-stone">{post.description}</p>
                        <span className="mt-1 inline-flex items-center gap-2 text-small font-medium uppercase tracking-[0.05em] text-brand-green transition-colors group-hover:text-brand-gold">
                          Read
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
                            strokeWidth={2}
                            aria-hidden
                          />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}

          {totalPages > 1 ? (
            <nav
              aria-label="Blog pagination"
              className="mt-12 flex items-center justify-center gap-2"
            >
              <PageLink
                page={current - 1}
                disabled={current === 1}
                aria-label="Previous page"
              >
                <ArrowLeft className="h-4 w-4" />
              </PageLink>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
                <PageLink key={n} page={n} active={n === current}>
                  {n}
                </PageLink>
              ))}
              <PageLink
                page={current + 1}
                disabled={current === totalPages}
                aria-label="Next page"
              >
                <ArrowRight className="h-4 w-4" />
              </PageLink>
            </nav>
          ) : null}
        </div>
      </Section>
    </>
  );
}

function PageLink({
  page,
  active,
  disabled,
  children,
  ...rest
}: {
  page: number;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.AriaAttributes) {
  const className = cn(
    "inline-flex h-10 min-w-10 items-center justify-center rounded-brand border px-3 text-small font-medium transition-colors",
    active
      ? "border-brand-green bg-brand-green text-brand-cream"
      : "border-brand-ink/15 text-brand-ink hover:border-brand-green hover:text-brand-green",
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
    <Link href={page === 1 ? "/blog" : `/blog?page=${page}`} className={className} {...rest}>
      {children}
    </Link>
  );
}
