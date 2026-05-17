import Link from "next/link";
import type { ReactNode } from "react";

const GUIDES = [
  { href: "/chatgpt-citation-guide", label: "ChatGPT citation guide" },
  { href: "/ai-brand-visibility-tracker", label: "AI brand visibility tracker" },
  { href: "/ai-brand-gap-analysis", label: "AI brand gap analysis" },
] as const;

export function SeoPageChrome({
  children,
  currentPath,
}: {
  children: ReactNode;
  currentPath: string;
}) {
  const related = GUIDES.filter((g) => g.href !== currentPath);

  return (
    <main className="app-shell seo-page">
      <header className="topbar">
        <Link href="/" className="brand">
          <span />
          CiteLens
        </Link>
        <nav>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#audit">Audit</Link>
        </nav>
      </header>

      {children}

      <footer className="seo-footer dashboard">
        <p className="eyebrow">Related guides</p>
        <div className="seo-related-grid">
          {related.map((g) => (
            <Link key={g.href} href={g.href} className="seo-related-card">
              <strong>{g.label}</strong>
              <span>Read guide →</span>
            </Link>
          ))}
        </div>
        <Link href="/" className="seo-back-home">
          ← Back to CiteLens home
        </Link>
      </footer>
    </main>
  );
}
