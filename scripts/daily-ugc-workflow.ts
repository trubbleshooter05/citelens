import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const VIDEO_DIR = path.join(ROOT, "video");
const OBSIDIAN_DIR =
  process.env.CITELENS_OBSIDIAN_GROWTH_DIR ??
  path.join(process.env.HOME ?? "", "ObsidianVault", "projects", "citelens", "growth-intel");

const COMPOSITION_ID = "CiteLensUgcDaily";

type DailyArgs = { date: string; skipRender: boolean; verbose: boolean };

function parseArgs(): DailyArgs {
  const dateArg = process.argv.find((a) => a.startsWith("--date="));
  const date = dateArg?.split("=")[1] ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Invalid --date: "${date}"`);
  return {
    date,
    skipRender: process.argv.includes("--skip-render"),
    verbose: process.argv.includes("--verbose"),
  };
}

function run(cmd: string, args: string[], cwd: string, verbose: boolean): string {
  try {
    const output = execFileSync(cmd, args, {
      cwd,
      encoding: "utf8",
      stdio: verbose ? "inherit" : ["pipe", "pipe", "pipe"],
      env: process.env,
    });
    return typeof output === "string" ? output.trim() : "";
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    process.stderr.write(`[error] ${cmd} ${args[0]}: ${err.stderr ?? err.stdout ?? err.message}\n`);
    throw e;
  }
}

function summarizeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function readTopOpportunity(date: string): { hook: string; script: string; angle: string } | null {
  const mdPath = path.join(ROOT, "docs", "growth", `citelens-growth-intel-${date}.md`);
  if (!existsSync(mdPath)) return null;
  const text = readFileSync(mdPath, "utf8");
  const block = text.split(/\n\d+\. \*\*/)[1];
  if (!block) return null;
  const hook = block.match(/UGC script: ([^\n]+)/)?.[1] ?? "";
  const angle = block.match(/UGC angle: ([^\n]+)/)?.[1] ?? "";
  const script = block.match(/UGC script: ([^\n]+(?:\n(?!   - )[^\n]+)*)/)?.[1]?.trim() ?? hook;
  return { hook, script, angle };
}

function platformCopy(opp: { hook: string; script: string; angle: string } | null): string {
  const angle = opp?.angle ?? "AI is citing your competitors — not you.";
  const script = opp?.script ?? "CiteLens turns missing AI citations into a weekly fix list.";

  const tiktok = `${angle}\n\n${script.slice(0, 120)}...\n\n👉 citelens.app (link in bio)\n\n#GEO #AISearch #SEO #CiteLens #ChatGPT #Perplexity #LLM #StartupMarketing`;
  const instagram = `${angle}\n\nMost brands have no idea their competitors are being cited by ChatGPT, Claude, and Perplexity instead of them.\n\nCiteLens shows exactly where you're missing in AI answers — and turns it into one weekly copy-ready action.\n\nNot a dashboard. A fix list.\n\n👉 Try the demo: citelens.app\n\n#GEO #GenerativeEngineOptimization #AIVisibility #SEO #AISearch #CiteLens #SMBMarketing #ContentMarketing`;
  const youtube = `${angle}\n\n${script}\n\nCaption-only vertical demo — no voiceover.\n\n🔗 citelens.app\n\n#GEO #AISearch #SEO #CiteLens #ChatGPT #ContentMarketing #StartupMarketing`;
  const twitter = `${angle.slice(0, 120)}\n\nCiteLens tracks where ChatGPT, Claude & Perplexity cite your competitors instead of you.\n\nFree demo → citelens.app`;

  return `#### TikTok / Reels Caption
\`\`\`
${tiktok}
\`\`\`

#### Instagram Caption
\`\`\`
${instagram}
\`\`\`

#### YouTube Description
\`\`\`
${youtube}
\`\`\`

#### X / Twitter
\`\`\`
${twitter}
\`\`\``;
}

function buildApprovalDoc(date: string, videoPath: string, opp: ReturnType<typeof readTopOpportunity>): string {
  return [
    `# CiteLens UGC Approval Pack — ${date}`,
    `Generated: ${new Date().toLocaleString()}`,
    ``,
    `Caption-only vertical video (no AI voiceover).`,
    ``,
    `## Video`,
    `- \`${videoPath}\``,
    ``,
    `## Platform Copy`,
    ``,
    platformCopy(opp),
    ``,
    `## Posting Checklist`,
    ``,
    `- [ ] Review video in \`video/out/\``,
    `- [ ] Add trending audio in TikTok/Reels if desired (video has no baked-in voice)`,
    `- [ ] Schedule TikTok + Reels: morning 8-10 AM or evening 7-9 PM`,
    `- [ ] YouTube: upload as Short (vertical 1080x1920)`,
    `- [ ] Pull fresh angles from \`docs/growth/citelens-growth-intel-${date}.md\` if needed`,
  ].join("\n");
}

async function main() {
  const args = parseArgs();
  const outputRel = `out/citelens-ugc-${args.date}.mp4`;
  const outputPath = path.join(VIDEO_DIR, outputRel);

  mkdirSync(path.join(ROOT, "docs", "growth"), { recursive: true });
  mkdirSync(path.join(VIDEO_DIR, "out"), { recursive: true });

  if (!existsSync(path.join(VIDEO_DIR, "node_modules"))) {
    process.stderr.write("[step] video deps (npm ci)\n");
    run("npm", ["ci"], VIDEO_DIR, args.verbose);
  }

  process.stderr.write("[step] growth:intel\n");
  run("node", ["--import", "tsx", "scripts/growth-intel.ts", `--date=${args.date}`], ROOT, args.verbose);

  if (!args.skipRender) {
    process.stderr.write(`[render] ${COMPOSITION_ID}\n`);
    run(
      "npx",
      [
        "remotion",
        "render",
        "--concurrency=1",
        "src/index.ts",
        COMPOSITION_ID,
        "--output",
        outputRel,
        "--overwrite",
        "--gl=swiftshader",
        "--chromium-flags=--no-sandbox",
      ],
      VIDEO_DIR,
      args.verbose,
    );
  }

  if (!args.skipRender && !existsSync(outputPath)) {
    throw new Error(`Expected video missing after render: ${outputPath}`);
  }

  const opp = readTopOpportunity(args.date);
  const doc = buildApprovalDoc(args.date, outputPath, opp);
  const localPath = path.join(ROOT, "docs", "growth", `daily-ugc-approval-${args.date}.md`);
  writeFileSync(localPath, doc);

  mkdirSync(OBSIDIAN_DIR, { recursive: true });
  writeFileSync(path.join(OBSIDIAN_DIR, `daily-ugc-approval-${args.date}.md`), doc);

  console.log(
    [
      `CiteLens UGC ready — 1 caption-only video for ${args.date}.`,
      `Approval doc: ${localPath}`,
      `Video: ${outputPath}`,
    ].join("\n"),
  );
}

main().catch((error) => {
  const { date } = parseArgs();
  process.stderr.write(`[fatal] ${summarizeError(error)}\n`);
  console.log(`CiteLens UGC pack failed for ${date}: ${summarizeError(error)}`);
  process.exit(1);
});
