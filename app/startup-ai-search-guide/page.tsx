import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "AI Search Optimization for Startups | CiteLens",
  description: "A budget-friendly GEO guide for startups that need ChatGPT, Gemini, Claude, and Perplexity to understand and recommend them.",
};

const steps = ['Pick five bottom-funnel prompts your buyers would actually ask an AI assistant.', 'Create one direct answer page per prompt instead of a broad thought-leadership post.', 'Publish proof that machines can extract: pricing, ICP, use cases, integrations, comparisons, and examples.', 'Review AI answer changes weekly so small content edits happen before a competitor owns the answer.'];

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
        <p className="eyebrow">Startup GEO guide</p>
        <h1>AI Search Optimization for Startups</h1>
        <p>A lean workflow for getting your startup understood, compared, and cited by AI answer engines without buying a giant SEO stack.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>Startups lose AI-search demand when answer engines cannot tell who the product is for, what it replaces, and why a buyer should trust it.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Preview a CiteLens action report</h2>
          <p>CiteLens gives startup teams a short weekly action report: the prompts to monitor, the missing evidence, and the pages most likely to move AI visibility.</p>
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
