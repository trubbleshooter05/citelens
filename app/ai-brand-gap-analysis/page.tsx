import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "Why Doesn't ChatGPT Mention My Brand? | CiteLens",
  description: "Diagnose why AI answer engines cite competitors instead of your company, then turn the gap into copy-ready fixes.",
};

const steps = ['Find the prompts where buyers should see you.', 'Capture which competitors appear and what evidence they provide.', 'Identify the missing page, missing section, or missing proof on your site.', 'Rewrite the page so an AI answer can extract a confident recommendation.'];

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
        <p className="eyebrow">AI brand gap analysis</p>
        <h1>Why Doesn't ChatGPT Mention My Brand?</h1>
        <p>Diagnose why AI answer engines cite competitors instead of your company, then turn the gap into copy-ready fixes.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>Most missing-brand problems are not mysterious. The page is too vague, the evidence is thin, or competitors answer the comparison better.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Run a sample brand gap review</h2>
          <p>CiteLens turns AI search visibility into specific page updates, prompt evidence, and weekly tasks instead of another vague analytics dashboard.</p>
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
