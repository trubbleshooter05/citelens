import type { MetadataRoute } from "next";

const siteUrl = "https://citelens.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...[
      "chatgpt-citation-guide",
      "gemini-citation-tracker",
      "perplexity-citation-tracker",
      "startup-ai-search-guide",
      "claude-citation-guide",
      "llm-visibility-tracker",
      "ai-answer-monitor",
      "ai-brand-visibility-tracker",
      "ai-brand-gap-analysis"
    ].map((slug) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
