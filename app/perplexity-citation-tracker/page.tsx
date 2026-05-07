import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "Perplexity Citations for Your Company | GEO Guide",
  description:
    "How Perplexity picks sources, displays inline citations, and what to change on site so answers reference your pages instead of competitors.",
};

const steps = [
  "Identify buyer prompts where Perplexity should surface your entity (comparison, alternatives, definitions).",
  "Run those prompts and note whether your domain appears in Sources, is quoted inline, or is missing.",
  "Add verifiable snippets Perplexity can excerpt: factual bullets, comparisons, citations to primary docs, dates, authors.",
  "When Perplexity cites aggregates or forums, tighten your canonical page until it satisfies the citation pattern users see.",
];

export default function Page() {
  return (
    <main className="app-shell topic-page">
      <header className="topbar">
        <a className="brand" href="/">
          <span />
          CiteLens
        </a>
        <nav>
          <a href="/#dashboard">Demo</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#audit">Audit</a>
        </nav>
      </header>

      <section className="topic-hero">
        <p className="eyebrow">Perplexity citations</p>
        <h1>Perplexity citations for my company — what to optimize</h1>
        <p>
          Perplexity answers with visible source cards and numbered references. GEO work here is proving your page is the
          most quotable primary source—not the most keyword-stuffed.
        </p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>How Perplexity usually cites</h2>
          <p>
            Perplexity tends to cite pages that encode direct answers early, summarize choices clearly, and look like stable
            documents instead of gated marketing fluff. Structured lists, comparison contrasts, and named statistics top the
            stack.
          </p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Translate rankings into citations</h2>
          <p>
            Winning Perplexity is less about SERP dominance and more about extractability: snippets an LLM assistant can cite
            without disclaimers or hedging—exactly where CiteLens task briefs focus.
          </p>
        </article>
      </section>

      <section className="topic-steps">
        <h2>What to ship first</h2>
        <div>
          {steps.map((step, index) => (
            <article key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Want the citation task list view?</h2>
        <p>
          Preview a CiteLens action report against your URL. Weekly prompts plus copy-ready GEO fixes—not another vanity
          citation ticker.
        </p>
        <GeoAuditForm />
      </section>
    </main>
  );
}
