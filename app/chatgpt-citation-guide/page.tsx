import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "How Do I Get ChatGPT To Cite My Website? | CiteLens",
  description: "A practical GEO guide for making your site easier for AI answer engines to discover, trust, and cite.",
};

const steps = ['Answer the buyer question directly near the top of the page.', 'Add clear evidence: pricing, process, guarantees, examples, and comparison tables.', 'Strengthen entity signals with author, organization, schema, and consistent external profiles.', 'Build pages around specific prompts instead of broad blog topics.'];

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
        <p className="eyebrow">ChatGPT citation guide</p>
        <h1>How Do I Get ChatGPT To Cite My Website?</h1>
        <p>A practical GEO guide for making your site easier for AI answer engines to discover, trust, and cite.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>ChatGPT usually cites pages that answer the question clearly, show entity trust, and make comparison details easy to extract.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Preview a CiteLens action report</h2>
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
