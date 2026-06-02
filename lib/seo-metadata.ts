import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export function buildPageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "CiteLens",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
