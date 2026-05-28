import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.env.HOME ?? "", ".hermes", ".env") });

const ROOT = process.cwd();
const VIDEO_DIR = path.join(ROOT, "video");
const AUDIO_DIR = path.join(VIDEO_DIR, "public", "audio");
const OBSIDIAN_DIR =
  process.env.CITELENS_OBSIDIAN_GROWTH_DIR ??
  path.join(process.env.HOME ?? "", "ObsidianVault", "projects", "citelens", "growth-intel");

type RenderTarget = {
  id: string;
  slug: string;
  title: string;
  hook: string;
  remotionAudio: string;
};

const BASE_TARGETS: RenderTarget[] = [
  {
    id: "CompetitorHook",
    slug: "competitor-hook",
    title: "Competitor Hook",
    hook: "Quick reality check. Your brand might not be getting cited by ChatGPT, Claude, or Perplexity. Your competitors are.",
    remotionAudio: "audio/competitor.mp3",
  },
  {
    id: "TaskBriefDemo",
    slug: "task-brief",
    title: "Task Brief Demo",
    hook: "This is why I built CiteLens. Most GEO tools tell you your visibility score. Cool, but then what?",
    remotionAudio: "audio/task-brief.mp3",
  },
  {
    id: "ScoreReveal",
    slug: "score-reveal",
    title: "Score Reveal / Validation Hook",
    hook: "This is an MVP, not a finished platform. I'm testing one thing.",
    remotionAudio: "audio/validation-hook.mp3",
  },
];

type DailyArgs = { date: string; skipRender: boolean; verbose: boolean };

type DailyAsset = RenderTarget & {
  output: string;
  datedAudio: string;
  voiceText: string;
};

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

function renderTargetsForDate(date: string, opps: ReturnType<typeof readTopOpportunities>): DailyAsset[] {
  return BASE_TARGETS.map((target, index) => {
    const opp = opps[index];
    const voiceText = (opp?.script ? `${opp.hook} ${opp.script}` : target.hook).replace(/\s+/g, " ").trim();
    const datedAudio = `audio/daily/${date}/citelens-${target.slug}.mp3`;
    return {
      ...target,
      output: `out/citelens-${target.slug}-${date}.mp4`,
      datedAudio,
      voiceText,
    };
  });
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

async function synthesizeVoiceovers(assets: DailyAsset[], verbose: boolean): Promise<void> {
  process.stderr.write("[step] voiceovers\n");

  for (const asset of assets) {
    const datedPath = path.join(VIDEO_DIR, "public", asset.datedAudio);
    const remotionPath = path.join(VIDEO_DIR, "public", asset.remotionAudio);
    mkdirSync(path.dirname(datedPath), { recursive: true });

    if (verbose) process.stderr.write(`[voice] ${asset.id}\n`);

    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    if (openAiKey) {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: "nova",
          input: asset.voiceText,
          response_format: "mp3",
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI TTS HTTP ${res.status}: ${errText.slice(0, 280)}`);
      }

      writeFileSync(datedPath, Buffer.from(await res.arrayBuffer()));
    } else {
      const aiffPath = `${datedPath}.aiff`;
      execFileSync("say", ["-v", "Samantha", "-r", "176", "-o", aiffPath, asset.voiceText], { stdio: "pipe" });
      execFileSync(
        "ffmpeg",
        ["-y", "-i", aiffPath, "-ac", "2", "-ar", "44100", "-b:a", "192k", datedPath],
        { stdio: "pipe" },
      );
    }

    copyFileSync(datedPath, remotionPath);
  }
}

function platformCopy(asset: DailyAsset, opp: { hook: string; script: string; angle: string } | undefined): string {
  const angle = opp?.angle ?? asset.hook;
  const script = opp?.script ?? asset.hook;

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

function buildApprovalDoc(date: string, assets: DailyAsset[], opps: ReturnType<typeof readTopOpportunities>): string {
  const sections: string[] = [
    `# CiteLens UGC Approval Pack — ${date}`,
    `Generated: ${new Date().toLocaleString()}`,
    ``,
    `## Videos (with voiceover)`,
    ...assets.map((a) => `- \`${path.join(VIDEO_DIR, a.output)}\``),
    ``,
    `## Voice MP3s`,
    ...assets.map((a) => `- \`${path.join(VIDEO_DIR, "public", a.datedAudio)}\``),
    ``,
    `---`,
    ``,
  ];

  assets.forEach((asset, i) => {
    const opp = opps[i];
    sections.push(
      `## Video ${i + 1}: ${asset.title}`,
      `**File:** \`${path.join(VIDEO_DIR, asset.output)}\``,
      `**VO:** \`${asset.datedAudio}\``,
      `**Hook:** ${asset.hook}`,
      ``,
      `### Platform Copy`,
      ``,
      platformCopy(asset, opp),
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

function assertVideoOutputs(assets: DailyAsset[]): string[] {
  const outputs: string[] = [];
  for (const asset of assets) {
    const fullPath = path.join(VIDEO_DIR, asset.output);
    if (!existsSync(fullPath)) {
      throw new Error(`Expected video missing after render: ${fullPath}`);
    }
    outputs.push(fullPath);
  }
  return outputs;
}

async function main() {
  const args = parseArgs();

  mkdirSync(path.join(ROOT, "docs", "growth"), { recursive: true });
  mkdirSync(path.join(VIDEO_DIR, "out"), { recursive: true });

  if (!existsSync(path.join(VIDEO_DIR, "node_modules"))) {
    process.stderr.write("[step] video deps (npm ci)\n");
    run("npm", ["ci"], VIDEO_DIR, args.verbose);
  }

  process.stderr.write("[step] growth:intel\n");
  run("node", ["--import", "tsx", "scripts/growth-intel.ts", `--date=${args.date}`], ROOT, args.verbose);

  const opps = readTopOpportunities(args.date);
  const assets = renderTargetsForDate(args.date, opps);

  await synthesizeVoiceovers(assets, args.verbose);

  if (!args.skipRender) {
    for (const asset of assets) {
      process.stderr.write(`[render] ${asset.id}\n`);
      run(
        "npx",
        [
          "remotion",
          "render",
          "--concurrency=1",
          "src/index.ts",
          asset.id,
          "--output",
          asset.output,
          "--overwrite",
          "--gl=swiftshader",
          "--chromium-flags=--no-sandbox",
        ],
        VIDEO_DIR,
        args.verbose,
      );
    }
  }

  const videoOutputs = args.skipRender
    ? assets.map((a) => path.join(VIDEO_DIR, a.output))
    : assertVideoOutputs(assets);

  const doc = buildApprovalDoc(args.date, assets, opps);
  const localPath = path.join(ROOT, "docs", "growth", `daily-ugc-approval-${args.date}.md`);
  writeFileSync(localPath, doc);

  mkdirSync(OBSIDIAN_DIR, { recursive: true });
  writeFileSync(path.join(OBSIDIAN_DIR, `daily-ugc-approval-${args.date}.md`), doc);

  console.log(
    [
      `CiteLens UGC pack ready — ${videoOutputs.length} videos with voiceover for ${args.date}.`,
      `Approval doc: ${localPath}`,
      `Voice MP3s: ${assets.map((a) => path.join(VIDEO_DIR, "public", a.datedAudio)).join("\n")}`,
      `Videos:\n${videoOutputs.join("\n")}`,
    ].join("\n"),
  );
}

main().catch((error) => {
  const { date } = parseArgs();
  process.stderr.write(`[fatal] ${summarizeError(error)}\n`);
  console.log(`CiteLens UGC pack failed for ${date}: ${summarizeError(error)}`);
  process.exit(1);
});
