export async function GET() {
  const content = `# CiteLens

> AI citation tracking platform for businesses. See when ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews recommend competitors instead of you — and get exact content fixes to win those prompts.

## Pages

- /: Homepage with AI citation score demo and audit form
- /ai-brand-gap-analysis: Analysis of your AI brand visibility gaps
- /ai-brand-visibility-tracker: Track your AI citation score over time
- /chatgpt-citation-guide: Guide to getting cited by ChatGPT

## Pricing

$29/month for SMBs. Includes weekly AI citation reports and prioritized content fix recommendations.

## About

CiteLens monitors your brand across AI search engines weekly and delivers an action report — not just a score, but the exact content changes needed to improve your AI citation rate.`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
