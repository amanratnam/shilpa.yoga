import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { blogCover } from "@/content/images";
import { formatDate, type PostMeta } from "@/lib/blog";

/** "mobility" -> "Mobility", "pre-natal" -> "Pre-natal". */
function tagLabel(tag?: string) {
  if (!tag) return "Practice";
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

export function BlogCard({ post, priority }: { post: PostMeta; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white transition-[transform,box-shadow] duration-300 ease-brand hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(31,61,46,0.45)] active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          image={blogCover(post.cover)}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="transition-transform duration-700 ease-brand group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-brand bg-brand-cream/95 px-2.5 py-1 text-eyebrow uppercase tracking-[0.1em] text-brand-green backdrop-blur">
          {tagLabel(post.tags[0])}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-2 text-small text-brand-stone">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            {post.readingTime}
          </span>
        </p>
        <h2 className="text-h4 font-semibold leading-snug text-brand-ink transition-colors group-hover:text-brand-green">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-small text-brand-stone">{post.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-small font-medium text-brand-green">
          Read the note
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
