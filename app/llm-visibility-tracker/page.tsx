import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "LLM Visibility Tracker | CiteLens",
  description: "Track whether AI answer engines mention your brand, cite your pages, and understand your product positioning.",
};

const steps = ['Choose prompts that represent discovery, comparison, objection, and purchase intent.', 'Record whether each LLM mentions you, cites you, misstates you, or ignores you.', 'Prioritize fixes by revenue intent instead of chasing every model response.', 'Update the pages and entity signals that would give the model better evidence next time.'];

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
        <p className="eyebrow">AI visibility tracker</p>
        <h1>LLM Visibility Tracker</h1>
        <p>Monitor the AI answers that matter: brand mentions, citations, competitor recommendations, and positioning errors.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>A visibility tracker is only useful when it connects model answers to the pages, proof points, and entity signals you can actually improve.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Preview a CiteLens action report</h2>
          <p>CiteLens packages LLM visibility into a weekly action list so every miss becomes a specific page or proof update.</p>
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
