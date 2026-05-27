import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Card, CardBody } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { getAllPosts, formatDate } from "@/lib/blog";
import { blogCover } from "@/content/images";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on anatomy-based yoga, building a lasting practice, and teaching well — from Shilpa Yoga Space.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Notes on practice"
        subtitle="Writing on anatomy, building a practice that lasts, and learning to teach with understanding."
      />

      <Section tone="light">
        {posts.length === 0 ? (
          <p className="text-body text-brand-stone">No posts yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06} className="h-full">
                <Card className="h-full">
                  <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <SmartImage
                        image={blogCover(post.cover)}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="transition-transform duration-500 ease-brand group-hover:scale-105"
                      />
                    </div>
                    <CardBody>
                      <Eyebrow>{post.tags[0] ?? "Practice"}</Eyebrow>
                      <h2 className="text-h3">{post.title}</h2>
                      <p className="text-body text-brand-stone">{post.description}</p>
                      <p className="mt-2 text-small text-brand-stone">
                        {formatDate(post.date)} · {post.readingTime}
                      </p>
                      <div className="mt-4">
                        <ArrowLink href={`/blog/${post.slug}`}>Read</ArrowLink>
                      </div>
                    </CardBody>
                  </Link>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
