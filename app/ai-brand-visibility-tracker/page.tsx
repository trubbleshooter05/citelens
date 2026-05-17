import type { Metadata } from "next";
import Link from "next/link";

import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingCta } from "@/components/seo/LandingCta";
import { SeoPageChrome } from "@/components/seo/SeoPageChrome";
import { SITE_URL } from "@/lib/site";

const PATH = "/ai-brand-visibility-tracker";

export const metadata: Metadata = {
  title:
    "Track Brand Visibility in AI Search | GEO Monitoring Guide — CiteLens",
  description:
    "How to measure brand visibility across ChatGPT, Gemini, Claude, Perplexity, and Google AI Overviews — prompts, evidence logging, scoring models, and operational workflows.",
  keywords: [
    "track brand visibility in ai search",
    "GEO tracking",
    "AI search monitoring",
    "ChatGPT brand tracking",
    "Perplexity visibility",
    "generative engine optimization metrics",
    "AI Overviews tracking",
  ],
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: "Track Brand Visibility in AI Search",
    description:
      "A practical framework for monitoring how often AI assistants mention, recommend, or cite your brand versus alternatives.",
    url: PATH,
    siteName: "CiteLens",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Track Brand Visibility in AI Search",
    description:
      "Measure mentions, citations, and competitor swaps across major AI surfaces — without drowning in screenshots.",
  },
};

const FAQ_ITEMS = [
  {
    question: "What should I track first — mentions or citations?",
    answer:
      "Start with prompts tied to revenue: comparisons, alternatives, pricing, implementation timelines. Log whether your brand appears, whether competitors appear first, whether URLs are cited, and whether facts match reality. Mentions prove recall; citations prove trusted sourcing.",
  },
  {
    question: "How many prompts are enough?",
    answer:
      "Ten thoughtfully chosen prompts beat two hundred generic ones. Expand coverage once your baseline stabilizes — usually after four consecutive weekly samples — so week-over-week noise does not lie to you.",
  },
  {
    question: "Why do scores swing week to week?",
    answer:
      "Model updates, retrieval index refreshes, browsing toggles, geographic variance, and safety filters all shift outputs. Track variance ranges instead of chasing single-session screenshots.",
  },
  {
    question: "Can I automate AI visibility tracking?",
    answer:
      "Partially via APIs where permitted plus disciplined scripts — but human review still catches subtle hallucinations or misleading paraphrases automation misses. Hybrid workflows tend to age better than screenshot-only audits.",
  },
  {
    question: "How does Google AI Overviews fit into GEO metrics?",
    answer:
      "Treat AI Overviews as blended search + synthesis: capture SERP placement, cited domains in the overview card, and whether your URL surfaces versus aggregator summaries. Often your SEO fixes lift Overviews before conversational assistants converge.",
  },
];

export default function AiBrandVisibilityTrackerPage() {
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
          "Track Brand Visibility in AI Search: GEO Monitoring Framework",
        description:
          "Operational guidance for measuring brand visibility across ChatGPT-class assistants and Google AI surfaces.",
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
            name: "AI brand visibility tracker",
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
          <p className="eyebrow">GEO · Measurement</p>
          <h1>Track brand visibility in AI search</h1>
          <p className="lead">
            Teams asking how to{" "}
            <strong style={{ color: "var(--ink)" }}>
              track brand visibility in AI search
            </strong>{" "}
            usually discover screenshots rot on Slack threads within days. Lasting
            GEO tracking pairs disciplined prompt lists with repeatable scoring —
            then connects deltas to concrete page fixes.
          </p>
        </section>

        <article className="dashboard landing-body">
          <h2>Define visibility beyond vanity mentions</h2>
          <p>
            Useful AI visibility metrics tie to buyer intent: recommendation order,
            factual accuracy of numeric claims, citation URLs, competitor swaps,
            and refusal patterns (“I can&apos;t browse”). Recording raw answers matters,
            but structured fields (
            <Link href="/chatgpt-citation-guide" className="inline-guide">
              citation readiness checklist
            </Link>
            ) turn anecdotes into sprint-ready priorities.
          </p>

          <div className="example-callout">
            <strong>Visibility failure teams overlook</strong>
            <p>
              A specialty ecommerce brand sees ChatGPT mention its trademark once in
              ten prompts — yet six answers hallucinate discontinued SKUs pulled from
              stale forum scrape snapshots. Mention counts looked fine while revenue
              leaked to competitors recommended as “safer defaults.”
            </p>
          </div>

          <h2>Core surfaces to monitor together</h2>
          <p>
            GEO strategies fragment when teams idolize one assistant. Buyers bounce
            between chat interfaces and classic Google sessions — especially after
            AI Overviews summarize comparisons above organic links.
          </p>

          <div className="platform-callouts">
            <article>
              <h3>ChatGPT</h3>
              <p>
                Track browsing-grounded versus knowledge-cutoff answers separately when
                possible — citation density shifts materially between modes.
              </p>
            </article>
            <article>
              <h3>Gemini</h3>
              <p>
                Watch overlap with Search grounding; spikes often correlate with
                indexing issues more than narrative storytelling tweaks on your blog.
              </p>
            </article>
            <article>
              <h3>Claude</h3>
              <p>
                Long-context chats drift across turns — snapshot baseline prompts as
                single-shot asks before diagnosing conversational degradation.
              </p>
            </article>
            <article>
              <h3>Perplexity</h3>
              <p>
                Inline citations simplify auditing — export domains cited per prompt
                weekly and compare against your canonical URLs.
              </p>
            </article>
            <article>
              <h3>Google AI Overviews</h3>
              <p>
                Measure inclusion alongside SERP rank for head prompts — Overviews can
                leapfrog blue-link winners when summaries consolidate competitor lists.
              </p>
            </article>
          </div>

          <h2>A lightweight GEO scorecard template</h2>
          <p>
            Assign each tracked prompt four integers weekly (0–2 scale keeps humans
            honest): recall (named?), placement (first paragraph vs buried?), citation
            (URL?), accuracy (facts OK?). Multiply by prompt revenue weight if known.
            Trends beat absolute totals — especially while models churn.
          </p>
          <ul>
            <li>
              <strong style={{ color: "var(--ink)" }}>Evidence clips:</strong> store
              anonymized excerpts referencing competitor wording models latch onto.
            </li>
            <li>
              <strong style={{ color: "var(--ink)" }}>Negative prompts:</strong> log
              refund risk, compliance, or outage scenarios — fragile reputations break
              here first.
            </li>
            <li>
              <strong style={{ color: "var(--ink)" }}>Regional prompts:</strong> track
              geo modifiers separately; retrieval caches diverge sharply by locale.
            </li>
          </ul>

          <h2>Closing the loop from visibility drops to fixes</h2>
          <p>
            Tracking without remediation becomes morale theater. Pair each regression
            with a hypothesis aligned to retrieval — thin comparison pages, outdated
            pricing PDFs, contradictory FAQs. Our{" "}
            <Link href="/ai-brand-gap-analysis" className="inline-guide">
              AI brand gap analysis guide
            </Link>{" "}
            walks common omission patterns when assistants refuse to mention you at
            all.
          </p>

          <div className="example-callout">
            <strong>B2B services pattern</strong>
            <p>
              Visibility climbs after consolidating ROI benchmarks onto one dated URL,
              even before backlinks arrive — assistants cite discrete figures faster
              than scattered anecdotes embedded in testimonials.
            </p>
          </div>

          <h2>Operational cadence that survives holidays and launches</h2>
          <p>
            Run weekly snapshots same weekday/time where feasible; freeze prompt text
            for month-long experiments; annotate engineering releases that alter crawl
            budgets or canonical tags. GEO visibility telemetry sits upstream of social
            analytics — align stakeholders early so experiments get landing-page
            resources.
          </p>

          <p>
            CiteLens exists because spreadsheets buckle once agencies manage dozens of
            prompts per client — we emphasize actionable weekly briefs instead of more
            dashboards. Pair monitoring discipline above with execution throughput your
            writers can absorb.
          </p>
        </article>

        <LandingCta
          title="Instrument AI visibility without drowning in screenshots"
          description="Try the CiteLens demo workflow — sample reports convert messy assistant outputs into prioritized fixes your team can ship."
        />

        <FaqSection items={FAQ_ITEMS} />
      </SeoPageChrome>
    </>
  );
}
