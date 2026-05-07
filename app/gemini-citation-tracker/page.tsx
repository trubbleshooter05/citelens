import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "Google Gemini AI Citations Tracker | CiteLens",
  description: "A practical GEO guide for tracking whether Gemini finds, trusts, and cites your pages in AI answers.",
};

const steps = ['Map the Gemini prompts where buyers compare options or ask for recommendations.', 'Check whether Gemini cites your page, a competitor, or no source at all.', 'Add extractable evidence: definitions, comparison tables, pricing, examples, and named authors.', 'Refresh the page when Gemini cites stale or indirect sources instead of your best answer.'];

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
        <p className="eyebrow">Gemini citation tracker</p>
        <h1>Google Gemini AI Citations Tracker</h1>
        <p>Track the prompts where Gemini should cite your site, then turn missing citations into focused page updates.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>Gemini citations are easiest to win when a page directly answers the query, carries clear entity trust, and gives Google's AI systems structured evidence to quote.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Preview a CiteLens action report</h2>
          <p>CiteLens turns Gemini citation gaps into a weekly list of prompts, source misses, and copy-ready fixes your team can ship.</p>
        </article>
      </section>

      <section className="topic-steps">
        <h2>What to fix first</h2>
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
        <h2>Want the action report version?</h2>
        <p>Preview the workflow with sample data. Early users get live prompt checks and copy-ready task briefs for their own site.</p>
        <GeoAuditForm />
      </section>
    </main>
  );
}
