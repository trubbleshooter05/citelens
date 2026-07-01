import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getGeneratedBlogPosts } from "@/lib/generated-blog";

const TOPIC_SLUGS = [
  "chatgpt-citation-guide",
  "gemini-citation-tracker",
  "perplexity-citation-tracker",
  "startup-ai-search-guide",
  "claude-citation-guide",
  "llm-visibility-tracker",
  "ai-answer-monitor",
  "ai-brand-visibility-tracker",
  "ai-brand-gap-analysis",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const blogPosts = getGeneratedBlogPosts();
  return [
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...TOPIC_SLUGS.map((slug) => ({
      url: `${siteUrl}/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
