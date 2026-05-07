import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalyticsInit } from "@/components/google-analytics-init";
import { GoogleAnalytics } from "@/components/google-analytics";

export const metadata: Metadata = {
  title: "CiteLens | AI Citation Action Engine",
  description:
    "Own your AI citations with a weekly copy-ready task brief—exact fixes for ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews. Not vanity scores.",
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
