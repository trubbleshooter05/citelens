import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const VIDEO_DIR = path.join(ROOT, "video");
const OBSIDIAN_DIR =
  process.env.CITELENS_OBSIDIAN_GROWTH_DIR ??
  "/Users/openclaw/ObsidianVault/projects/citelens/growth-intel";

// Remotion compositions in video/
const RENDERS = [
  {
    id: "CompetitorHook",
    output: "out/citelens-competitor-hook.mp4",
    title: "Competitor Hook",
    hook: "Quick reality check. Your brand might not be getting cited by ChatGPT, Claude, or Perplexity. Your competitors are.",
    vo: "competitor.mp3",
  },
  {
    id: "TaskBriefDemo",
    output: "out/citelens-task-brief.mp4",
    title: "Task Brief Demo",
    hook: "This is why I built CiteLens. Most GEO tools tell you your visibility score. Cool, but then what?",
    vo: "task Brief.mp3",
  },
  {
    id: "ScoreReveal",
    output: "out/citelens-score-reveal.mp4",
    title: "Score Reveal / Validation Hook",
    hook: "This is an MVP, not a finished platform. I'm testing one thing.",
    vo: "Validation Hook.mp3",
  },
];

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
    return execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    process.stderr.write(`[error] ${cmd} ${args[0]}: ${err.stderr ?? err.stdout ?? err.message}\n`);
    throw e;
  }
}

function synthesizeVoiceovers(opps: ReturnType<typeof readTopOpportunities>, verbose: boolean): void {
  const audioDir = path.join(VIDEO_DIR, "public", "audio");
  mkdirSync(audioDir, { recursive: true });

  const voiceText = RENDERS.map((render, i) => {
    const opp = opps[i];
    if (!opp) return render.hook;
    return `${opp.hook} ${opp.script}`;
  });

  for (let i = 0; i < RENDERS.length; i += 1) {
    const render = RENDERS[i];
    const aiffPath = path.join(audioDir, `${render.id}.aiff`);
    const mp3Path = path.join(audioDir, render.vo);
    const text = voiceText[i].replace(/\s+/g, " ").trim();

    if (verbose) process.stderr.write(`[voice] ${render.id}\n`);
    execFileSync("say", ["-v", "Samantha", "-r", "176", "-o", aiffPath, text], { stdio: "pipe" });
    execFileSync("ffmpeg", ["-y", "-i", aiffPath, "-ac", "2", "-ar", "44100", "-b:a", "192k", mp3Path], {
      stdio: "pipe",
    });
  }
}

/** Read top opportunities from today's growth-intel markdown */
function readTopOpportunities(date: string): { hook: string; script: string; angle: string }[] {
  const mdPath = path.join(ROOT, "docs", "growth", `citelens-growth-intel-${date}.md`);
  if (!existsSync(mdPath)) return [];
  const text = readFileSync(mdPath, "utf8");
  const opps: { hook: string; script: string; angle: string }[] = [];
  const blocks = text.split(/\n\d+\. \*\*/);
  for (const block of blocks.slice(1, 4)) {
    const hook = block.match(/UGC script: ([^\n]+)/)?.[1] ?? "";
    const angle = block.match(/UGC angle: ([^\n]+)/)?.[1] ?? "";
    const script = block.match(/UGC script: ([^\n]+(?:\n(?!   - )[^\n]+)*)/)?.[1]?.trim() ?? hook;
    opps.push({ hook, script, angle });
  }
  return opps;
}

function platformCopy(render: typeof RENDERS[0], opp: { hook: string; script: string; angle: string } | undefined, date: string): string {
  const angle = opp?.angle ?? render.hook;
  const script = opp?.script ?? render.hook;
  const shortDate = date.slice(5).replace("-", "/");

  const tiktok = `${angle}\n\n${script.slice(0, 120)}...\n\n👉 citelens.app (link in bio)\n\n#GEO #AISearch #SEO #CiteLens #ChatGPT #Perplexity #LLM #StartupMarketing`;

  const instagram = `${angle}\n\nMost brands have no idea their competitors are being cited by ChatGPT, Claude, and Perplexity instead of them.\n\nCiteLens shows exactly where you're missing in AI answers — and turns it into one weekly copy-ready action.\n\nNot a dashboard. A fix list.\n\n👉 Try the demo: citelens.app\n\n#GEO #GenerativeEngineOptimization #AIVisibility #SEO #AISearch #CiteLens #SMBMarketing #ContentMarketing`;

  const youtube = `${angle}\n\n${script}\n\nIn this video I show you how CiteLens tracks your brand mentions across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews — and turns missing citations into exact weekly content tasks.\n\n⏱ Timestamps:\n0:00 The problem\n0:08 What CiteLens shows\n0:16 The action output\n0:21 Try the demo\n\n🔗 citelens.app — free demo, no account required\n\n#GEO #AISearch #SEO #CiteLens #ChatGPT #ContentMarketing #StartupMarketing`;

  const twitter = `${angle.slice(0, 120)}\n\nCiteLens tracks where ChatGPT, Claude & Perplexity cite your competitors instead of you — and gives you exact fixes.\n\nFree demo → citelens.app`;

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

function buildApprovalDoc(date: string, videoOutputs: string[], opps: ReturnType<typeof readTopOpportunities>): string {
  const sections: string[] = [
    `# CiteLens UGC Approval Pack — ${date}`,
    `Generated: ${new Date().toLocaleString()}`,
    ``,
    `## Videos (with voiceover)`,
    ...videoOutputs.map((p) => `- \`${p}\``),
    ``,
    `---`,
    ``,
  ];

  RENDERS.forEach((render, i) => {
    const opp = opps[i];
    const videoPath = path.join(VIDEO_DIR, render.output);
    sections.push(
      `## Video ${i + 1}: ${render.title}`,
      `**File:** \`${videoPath}\``,
      `**VO:** \`${render.vo}\``,
      `**Hook:** ${render.hook}`,
      ``,
      `### Platform Copy`,
      ``,
      platformCopy(render, opp, date),
      ``,
      `---`,
      ``,
    );
  });

  sections.push(
    `## Posting Checklist`,
    ``,
    `- [ ] Review each video in \`video/out/\``,
    `- [ ] Pick best performing hook variant per platform`,
    `- [ ] Schedule TikTok + Reels: morning 8-10 AM or evening 7-9 PM`,
    `- [ ] YouTube: upload as Short (vertical 1080x1920)`,
    `- [ ] X/Twitter: clip to 60s if needed`,
    `- [ ] Update captions with any fresh growth-intel angles from \`docs/growth/citelens-growth-intel-${date}.md\``,
  );

  return sections.join("\n");
}

async function main() {
  const args = parseArgs();

  mkdirSync(path.join(ROOT, "docs", "growth"), { recursive: true });
  mkdirSync(path.join(VIDEO_DIR, "out"), { recursive: true });

  // 1. Growth intel
  process.stderr.write("[step] growth:intel\n");
  run("node", ["--import", "tsx", "scripts/growth-intel.ts", `--date=${args.date}`], ROOT, args.verbose);

  const videoOutputs: string[] = [];

  // 2. Remotion renders from video/ (has voiceovers + captions)
  if (!args.skipRender) {
    for (const r of RENDERS) {
      process.stderr.write(`[render] ${r.id}\n`);
      run(
        "npx",
        [
          "remotion", "render", "--concurrency=1",
          "src/index.ts", r.id,
          "--output", r.output,
          "--overwrite",
          "--gl=swiftshader",
          "--chromium-flags=--no-sandbox",
        ],
        VIDEO_DIR,
        args.verbose,
      );
      videoOutputs.push(path.join(VIDEO_DIR, r.output));
    }
  } else {
    for (const r of RENDERS) videoOutputs.push(path.join(VIDEO_DIR, r.output));
  }

  // 3. Read growth-intel output for copy
  const opps = readTopOpportunities(args.date);
  synthesizeVoiceovers(opps, args.verbose);

  // 4. Approval doc
  const doc = buildApprovalDoc(args.date, videoOutputs, opps);
  const localPath = path.join(ROOT, "docs", "growth", `daily-ugc-approval-${args.date}.md`);
  writeFileSync(localPath, doc);

  if (existsSync(OBSIDIAN_DIR) || true) {
    mkdirSync(OBSIDIAN_DIR, { recursive: true });
    writeFileSync(path.join(OBSIDIAN_DIR, `daily-ugc-approval-${args.date}.md`), doc);
  }

  console.log(
    [
      `CiteLens UGC pack ready — ${videoOutputs.length} videos with voiceover for ${args.date}.`,
      `Approval doc: ${localPath}`,
      `Videos:\n${videoOutputs.join("\n")}`,
    ].join("\n")
  );
}

main().catch((e) => { process.stderr.write(`[fatal] ${e}\n`); process.exit(1); });
