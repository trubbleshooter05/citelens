import { CopyTaskBriefButton } from "@/components/CopyTaskBriefButton";
import { EmailCapture } from "@/components/EmailCapture";
import { GeoAuditForm } from "@/components/GeoAuditForm";
import { platforms, prompts, weeklyActions } from "@/data/geo";

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span />
          CiteLens
        </div>
        <nav>
          <a href="#dashboard">Demo</a>
          <a href="#pricing">Pricing</a>
          <a href="#audit">Audit</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <div className="proof-pill">$29/mo AI citation tracker for SMBs</div>
          <p className="eyebrow">AI SEO tool · GEO platform</p>
          <h1>Win the prompts sending buyers elsewhere.</h1>
          <p>
            Use CiteLens as your GEO platform: trace how AI search surfaces your competitors, then ship the upgrades an{" "}
            <strong>AI SEO tool</strong> should prescribe—focused on citations in ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews,
            not vanity rank charts.
          </p>
          <p className="demo-note">
            MVP demo uses sample report data. Enter a site to preview the action report.
          </p>
          <GeoAuditForm />
        </div>

        <aside className="hero-product">
          <div className="product-top">
            <span>CiteLens report</span>
            <b>Weekly</b>
          </div>
          <div className="score-ring">
            <strong>34%</strong>
            <span>AI citation score</span>
          </div>
          <div className="urgent-fix">
            <b>Do this first</b>
            <span>Add comparison table to /card-grading</span>
            <small>They answer pricing and turnaround better than your page.</small>
          </div>
          <div className="mini-bars">
            {platforms.map((platform) => (
              <div key={platform.name}>
                <span>{platform.name}</span>
                <div>
                  <i style={{ width: `${platform.score}%` }} />
                </div>
                <b>{platform.score}%</b>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="dashboard" id="dashboard">
        <div className="section-head">
          <p className="eyebrow">Demo action report</p>
          <h2>Not just monitoring. A weekly AI citation task list.</h2>
        </div>

        <div className="this-week">
          <div>
            <span>Do this first</span>
            <h3>Create a competitor comparison page</h3>
            <p>
              AI tools cite PSA and TAG because they answer pricing, turnaround,
              guarantees, and trust signals in one scannable page. Copy the brief and hand it to a writer or assistant.
            </p>
          </div>
          <CopyTaskBriefButton task={weeklyActions[0]} />
        </div>

        <div className="metrics">
          <article>
            <span>Tracked prompts</span>
            <strong>25</strong>
          </article>
          <article>
            <span>Pages to update</span>
            <strong>6</strong>
          </article>
          <article>
            <span>Competitors found</span>
            <strong>11</strong>
          </article>
          <article>
            <span>Priority tasks</span>
            <strong>4</strong>
          </article>
        </div>

        <div className="report-grid">
          <div className="prompt-table">
            <h3>Prompt-to-page diagnosis</h3>
            {prompts.map((prompt) => (
              <article key={prompt.query}>
                <div>
                  <strong>{prompt.query}</strong>
                  <small>
                    Target page: {prompt.targetPage} · Competitors cited:{" "}
                    {prompt.competitors.join(", ")} · {prompt.effort} · {prompt.impact} impact
                  </small>
                </div>
                <span className={`status ${prompt.mention.toLowerCase()}`}>
                  {prompt.mention}
                </span>
                <p>{prompt.whyTheyWin} {prompt.fix}</p>
              </article>
            ))}
          </div>

          <aside className="fix-list">
            <h3>This week&apos;s actions</h3>
            <div className="action-stack">
              {weeklyActions.map((action) => (
                <article key={action.title}>
                  <strong>{action.title}</strong>
                  <p>{action.evidence}</p>
                  <span>{action.effort} · {action.impact} impact</span>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div>
          <p className="eyebrow">Simple pricing</p>
          <h2>Built for SMBs that need execution, not another analytics dashboard.</h2>
        </div>
        <div className="plans">
          <article>
            <h3>Starter</h3>
            <strong>$29/mo</strong>
            <p>10 prompts, 1 brand, weekly action report.</p>
          </article>
          <article className="featured">
            <h3>Growth</h3>
            <strong>$79/mo</strong>
            <p>50 prompts, competitor evidence, copy-ready task briefs.</p>
          </article>
          <article>
            <h3>Agency</h3>
            <strong>$149/mo</strong>
            <p>White-label action reports for up to 10 clients.</p>
          </article>
        </div>
      </section>

      <section className="email-banner">
        <div className="email-banner-inner">
          <div>
            <strong>Not ready to comment?</strong>
            <p>Get a sample CiteLens report sent to your inbox — no sign-up friction, no pitch.</p>
          </div>
          <EmailCapture />
        </div>
      </section>

      <section className="final-cta" id="audit">
        <h2>Want a sample AI citation action report?</h2>
        <p>
          Preview the workflow with sample data. Early access users get live
          prompt checks and copy-ready task briefs for their own site.
        </p>
        <GeoAuditForm />
      </section>
    </main>
  );
}
