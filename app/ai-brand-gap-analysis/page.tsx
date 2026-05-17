import type { Metadata } from "next";
import Link from "next/link";

import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingCta } from "@/components/seo/LandingCta";
import { SeoPageChrome } from "@/components/seo/SeoPageChrome";
import { SITE_URL } from "@/lib/site";

const PATH = "/ai-brand-gap-analysis";

export const metadata: Metadata = {
  title:
    "Why Doesn’t ChatGPT Mention My Brand? AI Gap Analysis Guide — CiteLens",
  description:
    "Diagnose why ChatGPT, Gemini, Claude, Perplexity, or Google AI Overviews omit your brand — entity clarity, topical authority gaps, conflicting signals, policy friction, and remediation priorities.",
  keywords: [
    "why doesn't chatgpt mention my brand",
    "AI brand gap analysis",
    "GEO diagnostics",
    "ChatGPT brand omission",
    "AI assistant visibility",
    "generative engine optimization audit",
    "AI Overviews missing brand",
  ],
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: "Why Doesn’t ChatGPT Mention My Brand?",
    description:
      "Structured gap analysis for AI assistants that recommend competitors — entity signals, authority gaps, retrieval conflicts, and fixes.",
    url: PATH,
    siteName: "CiteLens",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Doesn’t ChatGPT Mention My Brand?",
    description:
      "From omission patterns to GEO-ready remediation — practical diagnostics beyond guessing prompts.",
  },
};

const FAQ_ITEMS = [
  {
    question: "Is omission always about weak SEO?",
    answer:
      "Often authority overlaps — but omission also stems from ambiguous branding (similar names across industries), contradictory messaging across domains, stale structured data, aggressive geo-page duplication, or safety filters around regulated categories.",
  },
  {
    question: "Why does ChatGPT mention competitors but \"forget\" us?",
    answer:
      "Assistants gravitate toward brands with clearer definitional footprints: consistent naming in reputable corpora, comparison articles naming both sides, third-party validation, and pages that survive summarization without hedging.",
  },
  {
    question: "Does Gemini behave differently than ChatGPT here?",
    answer:
      "Yes — Gemini frequently mirrors Search-visible narratives faster. If indexed snippets skew toward competitors or aggregators, Gemini may consolidate those summaries unless your authoritative pages leapfrog them.",
  },
  {
    question: "Can Claude omit brands for caution reasons?",
    answer:
      "Claude sometimes minimizes vendor endorsements on sensitive prompts — medical, legal, finance — preferring descriptive categories instead of named startups unless sourcing is impeccable.",
  },
  {
    question: "What about Perplexity and AI Overviews?",
    answer:
      "Perplexity highlights citations explicitly — omission often correlates with missing quotable facts or competitor pages dominating citation graphs for that intent. AI Overviews omission may reflect SERP summaries excluding your domain entirely until SEO fundamentals recover.",
  },
];

export default function AiBrandGapAnalysisPage() {
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
          "Why Doesn’t ChatGPT Mention My Brand? AI Gap Analysis Framework",
        description:
          "Diagnostics for AI assistants omitting your brand — authority, entity clarity, retrieval conflicts, and remediation sequencing.",
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
            name: "AI brand gap analysis",
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
          <p className="eyebrow">GEO · Diagnostics</p>
          <h1>Why doesn&apos;t ChatGPT mention my brand?</h1>
          <p className="lead">
            Founders typing{" "}
            <strong style={{ color: "var(--ink)" }}>
              why doesn&apos;t ChatGPT mention my brand
            </strong>{" "}
            into search usually assume one broken tactic. In reality, omissions map
            to a handful of repeatable gaps — entity confusion, comparative thinness,
            retrieval conflicts, freshness decay, or cautious assistant policies —
            solvable once separated.
          </p>
        </section>

        <article className="dashboard landing-body">
          <h2>Five omission archetypes we see in GEO audits</h2>
          <p>
            Treat each archetype as a hypothesis you falsify with prompts + landing
            page evidence rather than vibes. Combine this diagnostic lens with{" "}
            <Link
              href="/ai-brand-visibility-tracker"
              className="inline-guide"
            >
              structured visibility tracking
            </Link>{" "}
            so fixes tie to measurable deltas.
          </p>

          <h3>1 · Entity ambiguity</h3>
          <p>
            Models hesitate when trademarks collide — think city names reused by SaaS,
            generically titled apps, or subsidiaries publishing inconsistent legal names.
            Consolidate naming across profiles, Wikipedia/Wikidata where warranted,
            press references, schema Organization markup, and definitive About copy.
          </p>

          <h3>2 · Comparative thinness</h3>
          <p>
            Buyers ask “versus” questions; assistants quote whoever answered cleanly.
            If competitors publish matrices covering integrations, SLA penalties, audit
            logs — while you rely on slogan-grade differentiation — omission follows.
            Align narrative specs with tables engineers can defend (
            <Link href="/chatgpt-citation-guide" className="inline-guide">
              citation-friendly formatting tips
            </Link>
            ).
          </p>

          <div className="example-callout">
            <strong>Omission plus hallucination combo</strong>
            <p>
              A health-adjacent marketplace sees ChatGPT skip its brand entirely while
              quietly recommending two aggregators — partly caution bias, partly because
              its documentation lacked clinician-reviewed disclaimers competitors
              surfaced plainly on one URL.
            </p>
          </div>

          <h3>3 · Retrieval conflicts</h3>
          <p>
            Duplicate localized pages, contradictory pricing across CMS vs PDF,
            unresolved HTTPS/www splits — retrieval indices favor whichever snippet looks
            coherent. Merge duplicates, synchronize facts, retire zombie URLs emitting
            conflicting schema.
          </p>

          <h3>4 · Freshness cliffs</h3>
          <p>
            Assistants downgrade stale specs faster than humans forgive them — shipping
            calendars stuck on 2024 signal abandonment. Date visible sections when you
            materially revise guidance; stale blogs hurt less than stale docs labeled
            “current.”
          </p>

          <h3>5 · Policy and category friction</h3>
          <p>
            Certain regulated narratives trigger softer wording — assistants substitute
            categories (“consider consulting a licensed …”) instead of vendor shout-outs.
            Compliance-ready sourcing does not eliminate mentions but raises the bar for
            named endorsements.
          </p>

          <h2>Platform angles on the same omission symptom</h2>
          <p>
            Identical omissions rarely imply identical remedies — tailor diagnostics per
            AI stack component powering each assistant family.
          </p>

          <div className="platform-callouts">
            <article>
              <h3>ChatGPT</h3>
              <p>
                Check whether browsing-enabled answers diverge from offline snapshots —
                omission may disappear once retrieval accesses fresher bundles of your
                help center.
              </p>
            </article>
            <article>
              <h3>Gemini</h3>
              <p>
                Cross-reference omission prompts with Search snippets Google itself
                summarizes — Gemini gap analyses often inherit classical SEO defects.
              </p>
            </article>
            <article>
              <h3>Claude</h3>
              <p>
                Inspect hedging density — Claude may omit brands when sourcing density is
                thin relative to caution thresholds on medical/legal prompts.
              </p>
            </article>
            <article>
              <h3>Perplexity</h3>
              <p>
                Study citation graphs — if competitor domains dominate SERP-derived
                citations, omission correlates with absent quotable statistics on your
                domain.
              </p>
            </article>
            <article>
              <h3>Google AI Overviews</h3>
              <p>
                If Overviews omit you while organic ranks lag page two, prioritize merged
                authoritative hubs — summaries synthesize winners, not buried crumbs.
              </p>
            </article>
          </div>

          <h2>Gap analysis sprint checklist</h2>
          <ul>
            <li>
              Freeze twenty buyer prompts spanning discovery, evaluation, risk review —
              note omission vs downgrade vs hallucination separately.
            </li>
            <li>
              Map each failing prompt to the URL assistants should logically cite —
              validate headings answer the prompt verbatim within two scrolls.
            </li>
            <li>
              Inventory competitor pages cited instead — clone their informational
              completeness without plagiarizing narrative voice.
            </li>
            <li>
              Ship consolidated fixes weekly; rerun prompts under identical wording for
              apples-to-apples GEO comparisons.
            </li>
          </ul>

          <div className="example-callout">
            <strong>Mid-market SaaS turnaround signal</strong>
            <p>
              Mentions returned within three weekly cycles after publishing an
              engineer-signed architecture FAQ debunking latency myths — no paid links,
              just retrieval-grade specificity competitors lacked.
            </p>
          </div>

          <h2>When omission is actually defensive upside</h2>
          <p>
            Occasionally brands benefit short-term when assistants omit them from risky
            prompts due to incomplete compliance copy — fix substance before chasing
            vanity mentions that amplify liability. GEO maturity separates hype cycles
            from durable buyer trust.
          </p>
        </article>

        <LandingCta
          title="Stop guessing why assistants ghost your brand"
          description="Use CiteLens to translate omission patterns into prioritized landing-page tasks — demo showcases sample workflows until live audits unlock."
        />

        <FaqSection items={FAQ_ITEMS} />
      </SeoPageChrome>
    </>
  );
}
