import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "Claude Citations for My Website | CiteLens",
  description: "A practical guide to making your website easier for Claude and other AI answer engines to understand, trust, and cite.",
};

const steps = ['Write pages around specific questions Claude users ask before buying.', 'Make claims easy to verify with named sources, examples, methodology, and dated updates.', 'Add comparison and decision criteria in plain text so citations point to the right section.', 'Track when Claude cites competitors and update the missing evidence before the next review.'];

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
        <p className="eyebrow">Claude citation guide</p>
        <h1>Claude Citations for My Website</h1>
        <p>Make your pages easier for Claude to evaluate by giving it direct answers, verifiable claims, and clean buyer context.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>Claude tends to reward pages that are precise, well-scoped, and transparent about claims, especially for product and vendor research.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Preview a CiteLens action report</h2>
          <p>CiteLens turns Claude citation misses into concrete content tasks your team can review and ship without staring at raw prompt logs.</p>
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
