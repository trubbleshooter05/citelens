import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "Monitor AI Answers for Brand Mentions | CiteLens",
  description: "A practical workflow for monitoring AI answers, brand mentions, competitor recommendations, and citation gaps.",
};

const steps = ['List the prompts where your brand should be mentioned by category, use case, and alternative.', 'Capture the answer, cited sources, competitor mentions, and any positioning mistakes.', 'Turn repeated misses into page updates with clearer claims, schema, examples, and comparisons.', 'Review weekly so AI answer drift becomes a manageable content workflow.'];

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
        <p className="eyebrow">AI answer monitoring</p>
        <h1>Monitor AI Answers for Brand Mentions</h1>
        <p>See where AI assistants mention you, skip you, cite competitors, or describe your product incorrectly.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>Brand monitoring for AI search is about finding answer gaps early, then giving models stronger public evidence to work with.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Preview a CiteLens action report</h2>
          <p>CiteLens converts monitored AI answers into copy-ready fixes, so the next content task is obvious instead of speculative.</p>
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
