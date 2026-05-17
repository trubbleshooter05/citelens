import type { Metadata } from "next";
import Link from "next/link";

import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingCta } from "@/components/seo/LandingCta";
import { SeoPageChrome } from "@/components/seo/SeoPageChrome";
import { SITE_URL } from "@/lib/site";

const PATH = "/chatgpt-citation-guide";

export const metadata: Metadata = {
  title:
    "How to Get ChatGPT to Cite Your Website | Practical GEO Guide — CiteLens",
  description:
    "Learn why ChatGPT cites some sites and not others, how citations differ across AI platforms, and what to change on your pages so assistants can retrieve and quote you responsibly.",
  keywords: [
    "how do i get chatgpt to cite my website",
    "ChatGPT citations",
    "GEO SEO",
    "AI citation optimization",
    "generative engine optimization",
    "LLM citations",
    "AI Overviews citations",
  ],
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: "How to Get ChatGPT to Cite Your Website",
    description:
      "Practical guidance on earning citations from ChatGPT and other AI assistants — structure, sources, and retrieval-friendly content.",
    url: PATH,
    siteName: "CiteLens",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Get ChatGPT to Cite Your Website",
    description:
      "Why ChatGPT cites competitors instead of you — and how to fix it with GEO-ready pages.",
  },
};

const FAQ_ITEMS = [
  {
    question: "Can I force ChatGPT to cite my website?",
    answer:
      "No. Assistants choose sources based on retrieval quality, policy constraints, and what fits the user question. What you can do is make your pages easy to retrieve, quote accurately, and justify as citations — clear titles, dated facts, primary claims backed by evidence, and structured summaries.",
  },
  {
    question: "Does traditional keyword stuffing help AI citations?",
    answer:
      "It usually hurts both humans and models. Modern retrieval favors passages that directly answer questions with specificity: definitions, comparisons, steps, constraints, pricing ranges where applicable, and citations to reputable sources.",
  },
  {
    question: "Why does ChatGPT cite Wikipedia or news instead of my homepage?",
    answer:
      "Those pages often consolidate neutral summaries with dates and outbound references — exactly what models use when they need a stable overview. Your site wins when it owns expert detail on your niche (how your product works, decision criteria, benchmarks you ran, FAQs competitors gloss over).",
  },
  {
    question: "How is this different from ranking #1 on Google?",
    answer:
      "Search rankings and AI citations overlap but are not identical. Google AI Overviews still tie strongly to indexed documents and SERP signals; ChatGPT-style assistants may emphasize retrieval snippets, training recall, tool-grounded browsing when enabled, and safety policies. You need pages that work as standalone answers, not only title-tag bait.",
  },
  {
    question: "Should I block AI crawlers?",
    answer:
      "Sometimes — if you have legal or licensing reasons — but blocking broadly can reduce visibility in AI-driven discovery. Many teams prefer selective robots rules plus licensing signals (for example structured permission metadata where applicable) rather than disappearing entirely from AI retrieval ecosystems.",
  },
];

export default function ChatgptCitationGuidePage() {
  const url = `${SITE_URL}${PATH}`;
  const faqEntities = FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline:
          "How to Get ChatGPT to Cite Your Website: A Practical GEO Guide",
        description:
          "How businesses can improve the odds that ChatGPT and similar assistants cite their websites — content structure, credibility signals, and platform nuances.",
        url,
        author: {
          "@type": "Organization",
          name: "CiteLens",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "CiteLens",
          url: SITE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqEntities,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ChatGPT citation guide",
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SeoPageChrome currentPath={PATH}>
        <section className="dashboard landing-intro">
          <p className="eyebrow">GEO · AI citations</p>
          <h1>How to get ChatGPT to cite your website</h1>
          <p className="lead">
            If you are searching for{" "}
            <strong style={{ color: "var(--ink)" }}>
              how do I get ChatGPT to cite my website
            </strong>
            , start here: citations are not pay-to-play placements — they emerge
            when your pages read like trustworthy, quotable answers across the AI
            systems people actually use.
          </p>
        </section>

        <article className="dashboard landing-body">
          <h2>What “getting cited” really means</h2>
          <p>
            In ChatGPT-class assistants, a citation is usually the model pointing
            to a URL, quoting a passage, or naming your brand as the source of a
            specific claim. That behavior depends on retrieval quality, policy,
            and whether your content survives scrutiny as clearer than competing
            pages — not on a single meta tag hack.
          </p>
          <p>
            Teams often confuse visibility with mentions: your brand can appear in
            prose without a link. Both matter for AI brand recall, but URLs and
            quotations carry more forensic trust for buyers researching vendors.
            See also our guides on{" "}
            <Link
              href="/ai-brand-visibility-tracker"
              className="inline-guide"
            >
              tracking AI search visibility
            </Link>{" "}
            and{" "}
            <Link href="/ai-brand-gap-analysis" className="inline-guide">
              why ChatGPT might skip your brand entirely
            </Link>
            .
          </p>

          <div className="example-callout">
            <strong>Real-world visibility problem</strong>
            <p>
              A B2B SaaS company ranks well for category terms but ChatGPT keeps
              recommending two competitors because their pricing, SLA table, and
              migration checklist appear on one canonical URL — easy for models to
              summarize without hallucinating numbers your site scattered across
              five blog posts.
            </p>
          </div>

          <h2>Signals that help assistants cite you instead of Wikipedia</h2>
          <p>
            Aim for passages that stand alone when pasted into an answer box:
            crisp definitions, comparisons, numbered steps, explicit limits (“we
            do not support …”), and currency (“Updated March 2026”). Models and
            search-derived snippets reward predictable headings and semantic HTML,
            but the decisive factor is whether an assistant can reuse your wording
            without contradicting itself.
          </p>
          <ul>
            <li>
              <strong style={{ color: "var(--ink)" }}>Answer-first openings:</strong>{" "}
              Lead sections with the direct reply to the prompt your buyers ask,
              then evidence — not a brand history essay.
            </li>
            <li>
              <strong style={{ color: "var(--ink)" }}>Comparable artifacts:</strong>{" "}
              Tables for pricing tiers, integrations, timelines, vs-competitor
              matrices — structured facts resist ambiguous paraphrase.
            </li>
            <li>
              <strong style={{ color: "var(--ink)" }}>Verifiable specifics:</strong>{" "}
              Reference methodologies, datasets, customer counts where allowed,
              regulation citations — anything that raises quote-worthiness.
            </li>
            <li>
              <strong style={{ color: "var(--ink)" }}>Stable canonical URLs:</strong>{" "}
              Avoid duplicating near-identical guides across vanity paths; AI
              retrieval frequently collapses duplicates unpredictably.
            </li>
          </ul>

          <h2>How ChatGPT, Gemini, Claude, Perplexity, and Google AI Overviews differ</h2>
          <p>
            Treat each surface as a slightly different evaluator: overlapping
            training corpora and retrieval stacks produce inconsistent mentions for
            the same brand. Long-term GEO strategy tracks them together instead of
            obsessing over one chatbot screenshot.
          </p>

          <div className="platform-callouts">
            <article>
              <h3>ChatGPT</h3>
              <p>
                Emphasizes conversational synthesis; citations appear when browsing
                or retrieval tooling surfaces trustworthy snippets that directly
                answer the prompt. Thin affiliate pages rarely survive skeptical
                summarization.
              </p>
            </article>
            <article>
              <h3>Google Gemini</h3>
              <p>
                Deep ties to Google&apos;s ecosystem mean structured data,
                freshness, and clarity on indexed pages matter alongside Helpful
                Content-style signals — especially when Gemini pulls live Google
                Search grounding.
              </p>
            </article>
            <article>
              <h3>Claude</h3>
              <p>
                Often prefers cautious language; dense technical docs with precise
                terminology can outperform marketing fluff because they reduce
                ambiguity when the model hedges liability-sensitive answers.
              </p>
            </article>
            <article>
              <h3>Perplexity</h3>
              <p>
                Built around citations — sources visible inline. Earn placements by
                combining topical authority pages with timely stats reporters (and
                users) query repeatedly.
              </p>
            </article>
            <article>
              <h3>Google AI Overviews</h3>
              <p>
                Pull from indexed documents matching SERP intent; featured-style
                summaries reward consolidated guidance plus credibility markers E-E-A-T
                evaluators recognize — especially on YMYL topics.
              </p>
            </article>
          </div>

          <h2>A practical weekly rhythm for citation-ready content</h2>
          <ol style={{ color: "var(--muted)", lineHeight: 1.65, paddingLeft: 22 }}>
            <li style={{ marginBottom: 10 }}>
              Inventory the twenty prompts where buyers compare vendors — record who
              AI assistants recommend today (
              <Link href="/ai-brand-gap-analysis" className="inline-guide">
                gap analysis walkthrough
              </Link>
              ).
            </li>
            <li style={{ marginBottom: 10 }}>
              Consolidate fragmented facts onto authoritative URLs with explicit H2/H3
              structure so humans and parsers skim identically.
            </li>
            <li style={{ marginBottom: 10 }}>
              Publish comparisons referencing named alternatives — neutrality boosts
              citation survival versus hollow superlatives.
            </li>
            <li style={{ marginBottom: 10 }}>
              Measure movement weekly (
              <Link
                href="/ai-brand-visibility-tracker"
                className="inline-guide"
              >
                tracker mindset
              </Link>
              ) — GEO rewards iteration, not one-shot audits.
            </li>
          </ol>

          <div className="example-callout">
            <strong>Another visibility problem pattern</strong>
            <p>
              Regional services brands publish duplicate city pages swapping only the
              metro name. Assistants frequently cite the first coherent competitor
              page that reads bespoke — even if your SEO footprint is larger —
              because templated copy scores lower on experiential signals.
            </p>
          </div>

          <h2>Optimize for humans first — retrieval second</h2>
          <p>
            The same prose that earns backlinks usually earns citations: precise,
            generous explanations that anticipate objections. Keyword-stuffed GEO
            pages decay fast once models refresh snapshots or humans bounce.
            Sustainable wins pair editorial expertise with instrumentation so you
            know which prompts moved — exactly what CiteLens focuses on for SMB and
            agency teams.
          </p>
        </article>

        <LandingCta
          title="Turn citation gaps into a weekly task list"
          description="Preview how CiteLens translates AI citation misses into prioritized fixes — demo uses sample data until early-access rollout completes."
        />

        <FaqSection items={FAQ_ITEMS} />
      </SeoPageChrome>
    </>
  );
}
