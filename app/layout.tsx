import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
