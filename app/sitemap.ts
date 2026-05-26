import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/classes", priority: 0.9, changeFrequency: "monthly" },
    { path: "/classes/online-vinyasa", priority: 0.9, changeFrequency: "monthly" },
    { path: "/classes/personal-gurgaon", priority: 0.9, changeFrequency: "monthly" },
    { path: "/teacher-training", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/yoga-classes-gurgaon", priority: 0.8, changeFrequency: "monthly" },
    { path: "/online-yoga-classes-india", priority: 0.8, changeFrequency: "monthly" },
    { path: "/yoga-teacher-training-online", priority: 0.8, changeFrequency: "monthly" },
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...routes, ...posts];
}
