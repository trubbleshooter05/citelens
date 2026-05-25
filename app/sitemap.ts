import type { MetadataRoute } from "next";

import { SITE_URL, seoGuideRoutes } from "@/lib/site";

const lastModified = new Date("2026-05-25T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = seoGuideRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    ...guides
  ];
}
