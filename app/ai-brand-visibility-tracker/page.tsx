import type { Metadata } from "next";
import { GeoAuditForm } from "@/components/GeoAuditForm";

export const metadata: Metadata = {
  title: "AI Brand Visibility Tracker | CiteLens",
  description: "Track brand visibility in AI search by checking whether ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews mention your brand or send buyers to competitors.",
};

const steps = ['Choose buyer prompts that matter before tracking generic keywords.', 'Record whether your brand is mentioned, ignored, or replaced by competitors.', 'Map each missed prompt to the page that should win it.', 'Ship one high-impact content fix every week.'];

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
        <p className="eyebrow">AI search visibility</p>
        <h1>AI Brand Visibility Tracker</h1>
        <p>Track brand visibility in AI search by checking whether ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews mention your brand or send buyers to competitors.</p>
        <GeoAuditForm />
      </section>

      <section className="topic-grid">
        <article className="topic-panel">
          <h2>The core problem</h2>
          <p>Traditional rankings do not tell you which brands AI tools recommend. CiteLens turns prompt visibility into a weekly action list.</p>
        </article>
        <article className="topic-panel dark-panel">
          <h2>Get the AI visibility checklist</h2>
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
