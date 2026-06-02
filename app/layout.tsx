import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalyticsInit } from "@/components/google-analytics-init";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CiteLens | AI Citation Action Engine",
    template: "%s",
  },
  description:
    "Own your AI citations with a weekly copy-ready task brief—exact fixes for ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews. Not vanity scores.",
  alternates: { canonical: "/" },
  keywords: [
    "GEO tracking",
    "AI search visibility",
    "LLM SEO",
    "ChatGPT rankings",
    "Perplexity citations",
    "AI Overviews",
    "generative engine optimization",
    "AI citation tracking",
  ],
  openGraph: {
    title: "CiteLens | AI Citation Action Engine",
    description:
      "Track where AI cites your competitors instead of you — get a weekly copy-ready fix list for ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews.",
    url: "/",
    type: "website",
    siteName: "CiteLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "CiteLens | AI Citation Action Engine",
    description:
      "AI citation tracking with weekly copy-ready tasks — not another vanity score dashboard.",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalyticsInit />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
