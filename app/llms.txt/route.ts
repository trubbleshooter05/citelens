import { getSiteUrl } from "@/lib/site-url";

export function GET() {
  const base = getSiteUrl();
  const body = `# CiteLens

> CiteLens tracks AI search citations across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews — and turns gaps into copy-ready weekly fix tasks.

## Site

- Canonical base URL: ${base}

## Primary URLs

- / — AI citation action engine (sample report + waitlist)
- /chatgpt-citation-guide — ChatGPT citation optimization
- /claude-citation-guide — Claude citation guide
- /perplexity-citation-tracker — Perplexity citations
- /gemini-citation-tracker — Gemini AI citations
- /llm-visibility-tracker — LLM visibility tracking
- /ai-brand-visibility-tracker — Brand visibility in AI search
- /ai-brand-gap-analysis — Why AI cites competitors instead of you
- /startup-ai-search-guide — GEO for startups
- /ai-answer-monitor — Monitor AI answers for brand mentions

## Machine notes

- /robots.txt and /sitemap.xml use ${base}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
