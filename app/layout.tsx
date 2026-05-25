import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://citelens.app"),
  title: "CiteLens | AI Citation Action Engine",
  description:
    "See why AI tools cite competitors instead of you, then get exact weekly content fixes to improve AI visibility.",
  keywords: [
    "GEO tracking",
    "AI search visibility",
    "LLM SEO",
    "ChatGPT rankings",
    "Perplexity citations",
    "AI Overviews",
    "generative engine optimization",
    "AI citation tracking"
  ],
  alternates: {
    canonical: "https://citelens.app"
  },
  openGraph: {
    title: "CiteLens | AI Citation Action Engine",
    description: "See why AI tools cite competitors instead of you, then get exact weekly content fixes to improve AI visibility.",
    url: "https://citelens.app",
    siteName: "CiteLens",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CiteLens | AI Citation Action Engine",
    description: "See why AI tools cite competitors instead of you, then get exact weekly content fixes."
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://citelens.app/#organization",
      "name": "CiteLens",
      "url": "https://citelens.app",
      "description": "AI citation tracking platform that shows when ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews recommend competitors instead of you.",
      "sameAs": []
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://citelens.app/#app",
      "name": "CiteLens",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "29",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "billingDuration": "P1M"
        }
      },
      "description": "Track AI citations across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews. Get weekly content fixes to win back AI-recommended traffic.",
      "url": "https://citelens.app"
    }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
