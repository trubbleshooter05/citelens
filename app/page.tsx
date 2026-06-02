import { CopyTaskBriefButton } from "@/components/CopyTaskBriefButton";
import { EmailCapture } from "@/components/EmailCapture";
import { GeoAuditForm } from "@/components/GeoAuditForm";
import { platforms, prompts, weeklyActions } from "@/data/geo";

const priorityTask = weeklyActions[0];
const competitorCount = new Set(prompts.flatMap((p) => p.competitors)).size;
const pageCount = new Set(prompts.map((p) => p.targetPage)).size;

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span />
          CiteLens
        </div>
        <nav>
          <a href="#dashboard">Sample</a>
          <a href="#pricing">Pricing</a>
          <a href="#waitlist">Waitlist</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <div className="proof-pill">$29/mo AI citation action reports for SMBs</div>
          <p className="eyebrow">AI citation monitoring · competitor tracking · GEO</p>
          <h1>
            See where AI cites your competitors—and get the weekly fix list.
          </h1>
          <p>
            ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews recommend
            someone in every buyer prompt. CiteLens shows{" "}
            <strong>which prompts you lose</strong>,{" "}
            <strong>who gets cited instead</strong>, and ships a{" "}
            <strong>copy-ready weekly task brief</strong> your team can execute—not
            another vanity visibility score.
          </p>
          <ul className="hero-outcomes">
            <li>
              <strong>Win AI search traffic</strong> — fix the pages and proof gaps
              behind high-intent prompts.
            </li>
            <li>
              <strong>Monitor competitor citations</strong> — see who AI recommends
              when buyers compare options.
            </li>
            <li>
              <strong>Ship one fix per week</strong> — prioritized tasks with effort
              and impact, ready for your backlog.
            </li>
          </ul>
          <p className="demo-note">
            Sample report below uses CardSnap data. Live audits for your domain are
            waitlist-only.
          </p>
          <GeoAuditForm />
        </div>

        <aside className="hero-product">
          <div className="product-top">
            <span>CardSnap · sample report</span>
            <b>Weekly</b>
          </div>
          <div className="urgent-fix prominent-fix">
            <b>Do this first (sample)</b>
            <span>{priorityTask.title}</span>
            <small>{priorityTask.evidence}</small>
          </div>
          <div className="score-ring muted-score">
            <strong>34%</strong>
            <span>citation gap score · demo</span>
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
          <p className="eyebrow">Sample action report</p>
          <h2>Not just monitoring. A weekly AI citation task list.</h2>
          <p className="section-note">
            Static example for CardSnap. This is what a weekly report looks like:
            which prompts you lose, who AI cites instead, and what to fix on each page.
          </p>
        </div>

        <div className="this-week">
          <div>
            <span>Do this first</span>
            <h3>{priorityTask.title}</h3>
            <p>
              {priorityTask.evidence} {priorityTask.fix} Copy the brief and hand it to a writer or assistant.
            </p>
          </div>
          <CopyTaskBriefButton task={priorityTask} />
        </div>

        <div className="metrics">
          <article>
            <span>Tracked prompts</span>
            <strong>{prompts.length}</strong>
          </article>
          <article>
            <span>Pages to update</span>
            <strong>{pageCount}</strong>
          </article>
          <article>
            <span>Competitors found</span>
            <strong>{competitorCount}</strong>
          </article>
          <article>
            <span>Priority tasks</span>
            <strong>{weeklyActions.length}</strong>
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
          <p className="section-note">Planned pricing at launch. Join the waitlist for early-access pilot rates.</p>
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

      <section className="final-cta" id="waitlist">
        <h2>Free AI visibility audit (waitlist)</h2>
        <p>
          Get a citation gap report for your site: prompts you lose, competitors AI
          cites, and the exact page updates to ship first.
        </p>
        <EmailCapture />
      </section>
    </main>
  );
}
