import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
  cover?: string;
};

export type Post = {
  meta: PostMeta;
  content: string;
};

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      author: String(data.author ?? "Shilpa"),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingTime: readingTime(content).text,
      cover: data.cover ? String(data.cover) : undefined,
    },
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => readPostFile(f).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Posts matching every word of `query`, searched across the title, summary,
 * tags and body. Posts that match in the title or tags rank above ones that
 * only mention a word in passing; ties stay newest first. An empty query
 * returns everything, newest first.
 */
export function searchPosts(query: string): PostMeta[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const all = getAllPosts();
  if (terms.length === 0) return all;

  const scored = all.map((meta) => {
    const title = meta.title.toLowerCase();
    const tags = meta.tags.join(" ").toLowerCase();
    const description = meta.description.toLowerCase();
    const body = (getPostBySlug(meta.slug)?.content ?? "").toLowerCase();
    let score = 0;
    for (const t of terms) {
      const termScore =
        (title.includes(t) ? 4 : 0) +
        (tags.includes(t) ? 3 : 0) +
        (description.includes(t) ? 2 : 0) +
        (body.includes(t) ? 1 : 0);
      // Every word has to appear somewhere.
      if (termScore === 0) return { meta, score: 0 };
      score += termScore;
    }
    return { meta, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.meta);
}

/** Up to `limit` other posts, preferring ones that share a tag with `slug`. */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  const others = all.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, limit);
  const shared = (p: PostMeta) => p.tags.filter((t) => current.tags.includes(t)).length;
  // Stable sort keeps newest-first within each overlap score.
  return [...others].sort((a, b) => shared(b) - shared(a)).slice(0, limit);
}

export function getPostBySlug(slug: string): Post | null {
  const mdx = path.join(BLOG_DIR, `${slug}.mdx`);
  const md = path.join(BLOG_DIR, `${slug}.md`);
  const file = fs.existsSync(mdx) ? `${slug}.mdx` : fs.existsSync(md) ? `${slug}.md` : null;
  if (!file) return null;
  return readPostFile(file);
}

export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
