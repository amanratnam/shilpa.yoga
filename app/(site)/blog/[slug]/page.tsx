import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CTASection } from "@/components/layout/CTASection";
import { SmartImage } from "@/components/ui/SmartImage";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import { blogCover } from "@/content/images";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.description,
      publishedTime: post.meta.date,
      authors: [post.meta.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
    components: {
      a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        const href = props.href ?? "";
        const external = /^https?:\/\//.test(href);
        return external ? (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ) : (
          <a {...props} />
        );
      },
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    author: { "@type": "Person", name: post.meta.author },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
        <div className="absolute inset-0 -z-10">
          <SmartImage image={blogCover(post.meta.cover)} fill priority sizes="100vw" />
          <div className="absolute inset-0 bg-brand-green/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/55 to-brand-green/30" />
        </div>
        <div className="container-content max-w-3xl pb-12 pt-32 md:pb-16 md:pt-40">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-small font-medium uppercase tracking-[0.05em] text-brand-gold transition-colors hover:text-brand-cream"
          >
            <ArrowLeft className="h-4 w-4" /> All notes
          </Link>
          <Eyebrow>{post.meta.tags[0] ?? "Practice"}</Eyebrow>
          <h1 className="mt-4 text-h1">{post.meta.title}</h1>
          <p className="mt-5 text-small text-brand-cream/70">
            {post.meta.author} · {formatDate(post.meta.date)} · {post.meta.readingTime}
          </p>
        </div>
      </section>

      <Section tone="light">
        <article className="prose prose-brand mx-auto">{content}</article>
      </Section>

      <CTASection
        eyebrow="Practice with me"
        title="Bring this onto the mat"
        subtitle="Try a trial class, or explore training to teach this work yourself."
        actions={[
          { label: "Book a Trial Class", href: "/contact" },
          { label: "See Classes", href: "/classes", variant: "secondary" },
        ]}
      />
    </>
  );
}
