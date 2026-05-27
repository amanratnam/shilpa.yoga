import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ArrowRight } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getAllPosts, formatDate } from "@/lib/blog";
import { blogCover } from "@/content/images";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on anatomy-based yoga, building a lasting practice, and learning to teach with understanding, from Shilpa Yoga Space.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Compact header */}
      <section className="bg-brand-green text-brand-cream on-dark">
        <div className="container-content grid items-end gap-4 pb-10 pt-28 md:gap-8 md:pb-14 md:pt-32 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>Journal</Eyebrow>
            <h1 className="mt-3 text-h1">Notes on practice</h1>
          </div>
          <p className="max-w-md text-body text-brand-cream/80 lg:pb-1.5">
            Writing on anatomy, building a practice that lasts, and learning to
            move with understanding.
          </p>
        </div>
      </section>

      <Section tone="light" flush>
        <div className="container-content pb-section-sm pt-10 md:pb-section md:pt-14">
          {posts.length === 0 ? (
            <p className="text-body text-brand-stone">No posts yet, check back soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.06} className="h-full">
                  <Card className="h-full">
                    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <SmartImage
                          image={blogCover(post.cover)}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="transition-transform duration-500 ease-brand group-hover:scale-105"
                        />
                      </div>
                      <CardBody className="gap-3 p-7">
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
                        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-small font-medium uppercase tracking-[0.05em] text-brand-green transition-colors group-hover:text-brand-gold">
                          Read
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
                            strokeWidth={2}
                            aria-hidden
                          />
                        </span>
                      </CardBody>
                    </Link>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
