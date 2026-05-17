import type { MetadataRoute } from "next";

import { SITE_URL, seoGuideRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = seoGuideRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...guides
  ];
}
