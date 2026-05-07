import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

type CsvRow = Record<string, string>;

type TargetCluster = {
  keyword: string;
  cluster: string;
  preferredPath: string;
  assetType: "new_page" | "refresh" | "internal_links" | "ugc";
  why: string;
  nextAction: string;
  ugcAngle: string;
};

type Opportunity = {
  priority: "P0" | "P1" | "P2";
  opportunity: string;
  cluster: string;
  currentUrl: string;
  recommendedAsset: string;
  routeStatus: string;
  sourceSignal: string;
  nextAction: string;
  ugcAngle: string;
  ugcVoice: string;
  ugcHook: string;
  ugcScript: string;
  ugcReferenceVideo: string;
  freshnessNote: string;
  score: number;
};

const ROOT = process.cwd();
const OBSIDIAN_DIR = process.env.CITELENS_OBSIDIAN_GROWTH_DIR ?? "/Users/openclaw/ObsidianVault/projects/citelens/growth-intel";
const SITE = "https://citelens.app";
const UGC_REFERENCE_VIDEO = "citelens-score-reveal.mp4";
const UGC_VOICE = "founder MVP validation voice from citelens-score-reveal.mp4";
const UGC_HISTORY_FILE = path.join(ROOT, "data", "growth", "ugc-history.json");

const TARGETS: TargetCluster[] = [
  {
    keyword: "how do i get chatgpt to cite my website",
    cluster: "chatgpt_citations",
    preferredPath: "/chatgpt-citation-guide",
    assetType: "new_page",
    why: "Direct ChatGPT citation intent with high conversion value for users wanting AI visibility.",
    nextAction: "Create guide showing how websites appear in ChatGPT citations and factors that increase visibility.",
    ugcAngle: "I never knew ChatGPT could cite my website.",
  },
  {
    keyword: "track brand visibility in ai search",
    cluster: "ai_brand_tracking",
    preferredPath: "/ai-brand-visibility-tracker",
    assetType: "new_page",
    why: "Core CiteLens value prop: monitoring brand mentions across AI search results.",
    nextAction: "Build tracker dashboard showing brand mentions in ChatGPT, Claude, Perplexity, and Gemini.",
    ugcAngle: "I started tracking where my brand appears in AI answers.",
  },
  {
    keyword: "perplexity citations for my company",
    cluster: "perplexity_citations",
    preferredPath: "/perplexity-citation-tracker",
    assetType: "new_page",
    why: "Perplexity is a growth platform with strong citation transparency; niche audience needs dedicated guidance.",
    nextAction: "Create Perplexity-specific guide covering their citation display and how to optimize for it.",
    ugcAngle: "Perplexity is citing my competitors but not me.",
  },
  {
    keyword: "ai seo geo tool",
    cluster: "ai_seo_platform",
    preferredPath: "/",
    assetType: "refresh",
    why: "Homepage should claim the AI SEO / GEO positioning directly.",
    nextAction: "Ensure homepage hero copy explicitly says 'AI SEO tool' and 'GEO platform' and differentiates from traditional SEO.",
    ugcAngle: "AI SEO is completely different from traditional SEO.",
  },
  {
    keyword: "llm visibility tracking",
    cluster: "llm_monitoring",
    preferredPath: "/llm-visibility-tracker",
    assetType: "new_page",
    why: "LLM-specific terminology appeals to technical audiences; important wedge for developer/enterprise use cases.",
    nextAction: "Create page covering LLM model differences, tracking across multiple models, and optimization strategies.",
    ugcAngle: "I needed to track visibility across all LLMs, not just Google.",
  },
  {
    keyword: "why doesn't chatgpt mention my brand",
    cluster: "brand_gap_diagnosis",
    preferredPath: "/ai-brand-gap-analysis",
    assetType: "new_page",
    why: "High-intent question from users with a brand presence problem; natural funnel into CiteLens diagnosis.",
    nextAction: "Create diagnostic page helping users understand why their brand isn't cited and how to fix it.",
    ugcAngle: "My brand isn't appearing in AI answers and I don't know why.",
  },
  {
    keyword: "monitor ai answers for brand mentions",
    cluster: "mention_monitoring",
    preferredPath: "/ai-answer-monitor",
    assetType: "new_page",
    why: "Monitoring intent that goes beyond visibility tracking; users want alerts and historical data.",
    nextAction: "Build alert/monitoring guide showing how CiteLens can track mentions over time.",
    ugcAngle: "I want to know every time an AI mentions my brand.",
  },
  {
    keyword: "ai search optimization for startups",
    cluster: "startup_geo_strategy",
    preferredPath: "/startup-ai-search-guide",
    assetType: "new_page",
    why: "Startups are early GEO adopters and need step-by-step strategy guides; differentiate from enterprise content.",
    nextAction: "Create startup-focused guide with budget-friendly AI search optimization strategies.",
    ugcAngle: "Startups can win in AI search before traditional SEO catches up.",
  },
  {
    keyword: "claude citations for my website",
    cluster: "claude_citations",
    preferredPath: "/claude-citation-guide",
    assetType: "new_page",
    why: "Claude is growing rapidly; dedicated guide captures users optimizing for Claude-specific visibility.",
    nextAction: "Create Claude citation guide covering Anthropic's citation patterns and optimization.",
    ugcAngle: "Claude is citing my competitors but my content is better.",
  },
  {
    keyword: "google gemini ai citations",
    cluster: "gemini_citations",
    preferredPath: "/gemini-citation-tracker",
    assetType: "new_page",
    why: "Google's AI product; large potential audience that bridges traditional SEO and new GEO world.",
    nextAction: "Create guide on Gemini citations and how to position content for Google's AI overview system.",
    ugcAngle: "Google's AI is skipping my site for competitors.",
  },
];

function parseArgs(): { date: string } {
  const dateArg = process.argv.find((arg) => arg.startsWith("--date="));
  const date = dateArg?.split("=")[1] ?? new Date().toISOString().slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid --date value "${date}". Expected YYYY-MM-DD.`);
  }

  return { date };
}

function csvEscape(value: string | number): string {
  const text = String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);

  const [headers, ...records] = rows;
  if (!headers) return [];

  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), (record[index] ?? "").trim()]))
  );
}

function readCsvIfExists(filePath: string): CsvRow[] {
  if (!existsSync(filePath)) return [];
  return parseCsv(readFileSync(filePath, "utf8"));
}

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) return walkFiles(fullPath);
    return fullPath;
  });
}

function routeFromPage(filePath: string): string {
  const relative = path.relative(path.join(ROOT, "app"), filePath).replace(/\\/g, "/");
  const route = relative.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  return route ? `/${route}` : "/";
}

function getExistingRoutes(): Set<string> {
  const pages = walkFiles(path.join(ROOT, "app")).filter((file) => file.endsWith("page.tsx"));
  return new Set(pages.map(routeFromPage));
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

type UgcHistoryItem = { date: string; cluster: string; hook: string; script: string };

function readUgcHistory(): UgcHistoryItem[] {
  if (!existsSync(UGC_HISTORY_FILE)) return [];
  try {
    const parsed = JSON.parse(readFileSync(UGC_HISTORY_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUgcHistory(items: UgcHistoryItem[]): void {
  mkdirSync(path.dirname(UGC_HISTORY_FILE), { recursive: true });
  writeFileSync(UGC_HISTORY_FILE, JSON.stringify(items.slice(-120), null, 2));
}

function toNumber(value: string | undefined): number {
  if (!value) return 0;
  const parsed = Number(value.replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function previousDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() - 1);
  return parsed.toISOString().slice(0, 10);
}

function dailyVariant(date: string, cluster: string): number {
  const text = `${date}:${cluster}`;
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function buildUgcCreative(target: TargetCluster, date: string, history: UgcHistoryItem[]): Pick<Opportunity, "ugcVoice" | "ugcHook" | "ugcScript" | "ugcReferenceVideo"> {
  const hooks = [
    `I'm testing one thing: does ${target.keyword} turn into a real CiteLens task?`,
    `This is an MVP check, not a launch claim: ${target.keyword}.`,
    `I don't want another dashboard. I want to know if ${target.keyword} is painful enough to fix weekly.`,
  ];
  const bridges = [
    "Most AI visibility tools stop at reporting. We force one specific content action.",
    "The point isn't a prettier dashboard. The point is copy-ready work your team can ship.",
    "If a keyword cannot produce a practical next move, it doesn't belong in the workflow.",
    "We track whether this turns into a real execution queue, not vanity metrics.",
  ];
  const closes = [
    "If this feels useful, I build the live audit next. If it feels fake, I cut it.",
    "Try the demo and tell me if this is a real weekly pain or just a neat chart.",
    "The question is simple: would you use this every week, or ignore it after one look?",
  ];
  const recent = history.slice(-30);
  const usedHooks = new Set(recent.map((item) => normalize(item.hook)));
  const usedScripts = new Set(recent.map((item) => normalize(item.script)));
  const seed = dailyVariant(date, target.cluster);
  let hook = hooks[seed % hooks.length];
  let script = "";
  for (let i = 0; i < hooks.length * bridges.length * closes.length; i += 1) {
    hook = hooks[(seed + i) % hooks.length];
    const bridge = bridges[(seed + i * 2) % bridges.length];
    const close = closes[(seed + i * 3) % closes.length];
    script = `${hook} ${bridge} CiteLens turns that AI visibility gap into one copy-ready action: ${target.nextAction} Not another analytics dashboard. ${close}`;
    if (!usedHooks.has(normalize(hook)) && !usedScripts.has(normalize(script))) break;
  }

  return {
    ugcVoice: UGC_VOICE,
    ugcHook: hook,
    ugcScript: script,
    ugcReferenceVideo: UGC_REFERENCE_VIDEO,
  };
}

function getGscRows(): CsvRow[] {
  const growthDir = path.join(ROOT, "data", "growth");
  const rows = [
    ...readCsvIfExists(path.join(growthDir, "gsc-keyword-watch-template.csv")),
    ...readdirSync(growthDir)
      .filter((file) => file.includes("gsc") && file.endsWith(".csv") && file !== "gsc-keyword-watch-template.csv")
      .flatMap((file) => readCsvIfExists(path.join(growthDir, file))),
  ];

  return rows.filter((row) => row.query || row.Query || row.keyword || row.Keyword);
}

function sourceSignalFor(keyword: string, rows: CsvRow[]): { signal: string; scoreBoost: number } {
  const key = normalize(keyword);
  const matches = rows.filter((row) => {
    const query = normalize(row.query ?? row.Query ?? row.keyword ?? row.Keyword ?? "");
    return query.includes(key) || key.includes(query);
  });

  if (matches.length === 0) {
    return { signal: "Seed keyword from CiteLens AI visibility targets; no matching GSC row yet.", scoreBoost: 0 };
  }

  const impressions = matches.reduce((sum, row) => sum + toNumber(row.impressions ?? row.Impressions), 0);
  const clicks = matches.reduce((sum, row) => sum + toNumber(row.clicks ?? row.Clicks), 0);
  const bestPosition = Math.min(
    ...matches.map((row) => toNumber(row.position ?? row.Position)).filter((value) => value > 0),
    Number.POSITIVE_INFINITY
  );
  const positionText = Number.isFinite(bestPosition) ? `best position ${bestPosition.toFixed(1)}` : "position not available";

  return {
    signal: `Matched ${matches.length} GSC/watch row(s): ${impressions} impressions, ${clicks} clicks, ${positionText}.`,
    scoreBoost: impressions > 0 ? 20 : 8,
  };
}

function pageTextForRoute(route: string): string {
  if (route === "/") {
    const homePage = path.join(ROOT, "app", "page.tsx");
    const homeClient = path.join(ROOT, "components", "HomePage.tsx");
    const homeContent = path.join(ROOT, "components", "HomePageClient.tsx");
    return [homePage, homeClient, homeContent]
      .filter((file) => existsSync(file))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
  }

  const pagePath = path.join(ROOT, "app", route.slice(1), "page.tsx");
  return existsSync(pagePath) ? readFileSync(pagePath, "utf8") : "";
}

function mentionsKeyword(route: string, keyword: string): boolean {
  return normalize(pageTextForRoute(route)).includes(normalize(keyword));
}

function buildOpportunities(routes: Set<string>, gscRows: CsvRow[], date: string, history: UgcHistoryItem[]): Opportunity[] {
  return TARGETS.map((target) => {
    const exactRouteExists = routes.has(target.preferredPath);
    const dynamicRouteExists = Array.from(routes).some((route) => {
      const pattern = route.replace(/\[slug\]/g, "[^/]+");
      return new RegExp(`^${pattern}$`).test(target.preferredPath);
    });
    const routeExists = exactRouteExists || dynamicRouteExists;
    const keywordPresent = routeExists && mentionsKeyword(target.preferredPath, target.keyword);
    const { signal, scoreBoost } = sourceSignalFor(target.keyword, gscRows);
    const missingRouteBoost = routeExists ? 0 : 18;
    const missingCopyBoost = routeExists && !keywordPresent ? 12 : 0;
    const conversionBoost = ["chatgpt_citations", "ai_brand_tracking", "brand_gap_diagnosis"].includes(target.cluster)
      ? 20
      : 12;
    const score = 50 + scoreBoost + missingRouteBoost + missingCopyBoost + conversionBoost;

    let priority: Opportunity["priority"] = "P2";
    if (score >= 85) priority = "P0";
    else if (score >= 72) priority = "P1";

    const routeStatus = routeExists
      ? keywordPresent
        ? "Existing route covers exact keyword"
        : "Existing route, copy gap"
      : "Missing exact-fit route";

    const recommendedAsset = routeExists
      ? keywordPresent
        ? target.assetType === "internal_links"
          ? `Add internal links into ${target.preferredPath}`
          : `Monitor ${target.preferredPath}`
        : `Refresh ${target.preferredPath}`
      : target.assetType === "new_page"
        ? `Create ${target.preferredPath}`
        : target.assetType === "refresh"
          ? `Refresh ${target.preferredPath}`
          : target.assetType === "internal_links"
            ? `Add internal links into ${target.preferredPath}`
            : "Create UGC script";

    return {
      priority,
      opportunity: target.keyword,
      cluster: target.cluster,
      currentUrl: routeExists ? `${SITE}${target.preferredPath}` : "",
      recommendedAsset,
      routeStatus,
      sourceSignal: signal,
      nextAction: target.nextAction,
      ugcAngle: target.ugcAngle,
      ...buildUgcCreative(target, date, history),
      freshnessNote: "",
      score,
    };
  }).sort((a, b) => b.score - a.score || a.opportunity.localeCompare(b.opportunity));
}

function opportunitySignature(opp: Opportunity): string {
  return [
    opp.opportunity,
    opp.cluster,
    opp.recommendedAsset,
    opp.routeStatus,
    opp.sourceSignal,
    opp.nextAction,
    opp.score,
  ].join("||");
}

function staleSourceWarning(date: string, opportunities: Opportunity[]): string {
  const previousCsv = path.join(ROOT, "data", "growth", `citelens-growth-intel-${previousDate(date)}.csv`);
  const previousRows = readCsvIfExists(previousCsv);
  if (previousRows.length === 0 || previousRows.length !== opportunities.length) return "";

  const currentSignature = opportunities
    .map((opp) => opportunitySignature(opp))
    .sort()
    .join("\n");
  const previousSignature = previousRows
    .map((row) =>
      [
        row.opportunity,
        row.cluster,
        row.recommended_asset,
        row.route_status,
        row.source_signal,
        row.next_action,
        row.score,
      ].join("||")
    )
    .sort()
    .join("\n");

  return currentSignature === previousSignature
    ? `Freshness Warning: opportunity inputs are the same source inputs as ${previousDate(date)}. UGC scripts were re-voiced in the ${UGC_REFERENCE_VIDEO} style, but keyword/source data should be refreshed before treating this as new intel.`
    : "";
}

function toCsv(opportunities: Opportunity[]): string {
  const headers = [
    "priority",
    "opportunity",
    "cluster",
    "current_url",
    "recommended_asset",
    "route_status",
    "source_signal",
    "next_action",
    "ugc_angle",
    "ugc_voice",
    "ugc_hook",
    "ugc_script",
    "ugc_reference_video",
    "freshness_note",
    "score",
  ];

  const lines = opportunities.map((opp) =>
    [
      opp.priority,
      opp.opportunity,
      opp.cluster,
      opp.currentUrl,
      opp.recommendedAsset,
      opp.routeStatus,
      opp.sourceSignal,
      opp.nextAction,
      opp.ugcAngle,
      opp.ugcVoice,
      opp.ugcHook,
      opp.ugcScript,
      opp.ugcReferenceVideo,
      opp.freshnessNote,
      opp.score,
    ].map(csvEscape).join(",")
  );

  return `${headers.join(",")}\n${lines.join("\n")}\n`;
}

function buildMarkdown(date: string, routes: Set<string>, rows: CsvRow[], opportunities: Opportunity[], freshnessWarning: string): string {
  const top = opportunities.slice(0, 5);
  const missing = opportunities.filter((opp) => opp.routeStatus === "Missing exact-fit route");
  const copyGaps = opportunities.filter((opp) => opp.routeStatus === "Existing route, copy gap");

  return `# CiteLens Growth Intel Board — ${date}

Generated by \`npm run growth:intel\`.

## Inputs Used

- Local CiteLens route inventory from \`app/**/page.tsx\`.
- GSC/watch rows from \`data/growth/gsc-keyword-watch-template.csv\` and any \`data/growth/*gsc*.csv\` exports.
- Current AI citation/GEO targets: ChatGPT citations, Perplexity citations, Claude citations, Gemini citations, LLM visibility, brand gap analysis, startup strategy.
- No Ahrefs subscription or paid keyword API required.

## Snapshot

- Existing app routes found: ${routes.size}.
- GSC/watch rows read: ${rows.length}.
- Exact-fit missing route ideas: ${missing.length}.
- Existing routes with likely copy gaps: ${copyGaps.length}.
${freshnessWarning ? `\n## Freshness Warning\n\n${freshnessWarning}\n` : ""}

## Top Opportunities

${top.map((opp, index) => `${index + 1}. **${opp.opportunity}** (${opp.priority}, score ${opp.score})
   - Asset: ${opp.recommendedAsset}
   - Status: ${opp.routeStatus}
   - Why: ${opp.sourceSignal}
   - Next: ${opp.nextAction}
   - UGC angle: ${opp.ugcAngle}
   - UGC voice: ${opp.ugcVoice}
   - UGC script: ${opp.ugcScript}`).join("\n\n")}

## Recommended Build Queue

### Ship Next

${top.slice(0, 3).map((opp) => `- ${opp.recommendedAsset}: ${opp.opportunity}`).join("\n")}

### Watch In GSC

${opportunities.slice(0, 10).map((opp) => `- ${opp.opportunity} -> ${opp.currentUrl || `${SITE}${opp.recommendedAsset.replace("Create ", "")}`}`).join("\n")}

## How To Use This

1. Export fresh GSC query/page data as CSV when available.
2. Drop it into \`data/growth/\` with \`gsc\` in the filename.
3. Run \`npm run growth:intel\`.
4. Build the top 1-2 opportunities that show real search intent and align with CiteLens's GEO positioning.

## Guardrails

- Keep CiteLens focused on AI citation tracking, brand visibility in LLMs, and GEO (Generative Engine Optimization).
- Do not claim real-time monitoring unless it actually exists.
- Do not compare to traditional SEO tools — position as a new category (GEO).
- Prioritize routes that directly address "why isn't my brand cited?" or "how do I get cited?"
`;
}

function main(): void {
  const { date } = parseArgs();
  const routes = getExistingRoutes();
  const rows = getGscRows();
  const history = readUgcHistory();
  const opportunities = buildOpportunities(routes, rows, date, history);
  writeUgcHistory([
    ...history,
    ...opportunities.map((opp) => ({ date, cluster: opp.cluster, hook: opp.ugcHook, script: opp.ugcScript })),
  ]);

  const docsDir = path.join(ROOT, "docs", "growth");
  const dataDir = path.join(ROOT, "data", "growth");
  mkdirSync(docsDir, { recursive: true });
  mkdirSync(dataDir, { recursive: true });

  const mdPath = path.join(docsDir, `citelens-growth-intel-${date}.md`);
  const csvPath = path.join(dataDir, `citelens-growth-intel-${date}.csv`);
  const obsidianMdPath = path.join(OBSIDIAN_DIR, `citelens-growth-intel-${date}.md`);

  const freshnessWarning = staleSourceWarning(date, opportunities);
  const opportunitiesWithFreshness = opportunities.map((opp) => ({
    ...opp,
    freshnessNote: freshnessWarning,
  }));
  const markdown = buildMarkdown(date, routes, rows, opportunitiesWithFreshness, freshnessWarning);
  writeFileSync(mdPath, markdown);
  writeFileSync(csvPath, toCsv(opportunitiesWithFreshness));
  mkdirSync(OBSIDIAN_DIR, { recursive: true });
  writeFileSync(obsidianMdPath, markdown);

  const top = opportunitiesWithFreshness[0];
  console.log(`${top?.priority ?? "P2"} CiteLens growth intel: ${top?.opportunity ?? "none"} -> ${top?.recommendedAsset ?? "no action"}`);
}

main();
