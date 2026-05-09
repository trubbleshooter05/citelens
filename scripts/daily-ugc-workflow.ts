import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

type PersonaKey =
  | "calm_expert"
  | "frustrated_business_owner"
  | "seo_nerd"
  | "agency_consultant"
  | "skeptical_founder";

type Persona = {
  key: PersonaKey;
  label: string;
  voice: string;
  pacing: string;
  captionRhythm: string;
  hookStyle: string;
};

type Topic = {
  keyword: string;
  pain: string;
  promise: string;
  proofPoint: string;
  callToAction: string;
};

type Shot = {
  time: string;
  framing: string;
  action: string;
  caption: string;
  notes: string;
};

type Scene = {
  id: string;
  durationSeconds: number;
  visual: string;
  voiceover: string;
  caption: string;
  pacing: "hold" | "beat" | "pause";
};

type UGCPlan = {
  date: string;
  persona: Persona;
  topic: Topic;
  hook: string;
  adCopy: string;
  voiceoverScript: string;
  captionText: string;
  shotList: Shot[];
  remotionScene: {
    format: "vertical_9x16";
    durationSeconds: number;
    style: string;
    scenes: Scene[];
  };
};

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "ugc");
const DOCS_DIR = path.join(ROOT, "docs", "ugc");

const PERSONAS: Persona[] = [
  {
    key: "calm_expert",
    label: "calm expert",
    voice: "measured operator explaining a pattern they keep seeing",
    pacing: "steady first sentence, then two longer holds after the proof point",
    captionRhythm: "short opener, two calm explanatory captions, soft CTA",
    hookStyle: "quiet authority",
  },
  {
    key: "frustrated_business_owner",
    label: "frustrated business owner",
    voice: "owner who is tired of guessing why AI tools ignore their brand",
    pacing: "sharp hook, one breath, then slower problem-solution read",
    captionRhythm: "complaint, diagnosis, fix, CTA",
    hookStyle: "raw frustration",
  },
  {
    key: "seo_nerd",
    label: "SEO nerd",
    voice: "technical marketer comparing classic SEO to AI citation behavior",
    pacing: "fast first insight, medium explanation, deliberate final beat",
    captionRhythm: "pattern interrupt, metric idea, execution step",
    hookStyle: "contrarian SEO insight",
  },
  {
    key: "agency_consultant",
    label: "agency consultant",
    voice: "consultant turning a vague client problem into a weekly deliverable",
    pacing: "consultative hook, clear three-part breakdown, confident close",
    captionRhythm: "client pain, audit finding, deliverable, next step",
    hookStyle: "client-call moment",
  },
  {
    key: "skeptical_founder",
    label: "skeptical founder",
    voice: "founder stress-testing whether AI visibility is worth building for",
    pacing: "skeptical hook, longer middle hold, honest CTA",
    captionRhythm: "doubt, test, result, invitation",
    hookStyle: "MVP reality check",
  },
];

const TOPICS: Topic[] = [
  {
    keyword: "why ChatGPT does not mention my brand",
    pain: "Your company exists, your competitors show up, and the answer skips you.",
    promise: "CiteLens turns that invisible gap into one page-level fix.",
    proofPoint: "The useful output is not a chart. It is the exact page section to rewrite next.",
    callToAction: "Run one AI visibility check before your next content sprint.",
  },
  {
    keyword: "AI SEO tracking for startups",
    pain: "Startups can publish fast, but they rarely know if AI systems can explain what they do.",
    promise: "CiteLens shows which prompt paths and citation gaps deserve attention first.",
    proofPoint: "A weekly task beats another dashboard tab nobody opens.",
    callToAction: "Try the workflow on one product page this week.",
  },
  {
    keyword: "LLM visibility tracking",
    pain: "Google ranking does not tell you what ChatGPT, Claude, Perplexity, or Gemini say.",
    promise: "CiteLens turns model-by-model visibility into a practical content queue.",
    proofPoint: "Different models miss different context. The fix should match the miss.",
    callToAction: "Check one brand prompt across models and ship one fix.",
  },
  {
    keyword: "AI brand mention monitoring",
    pain: "You only notice AI visibility when a lead says they found a competitor instead.",
    promise: "CiteLens makes brand mentions and missing mentions visible before they cost pipeline.",
    proofPoint: "The signal is strongest when it becomes a concrete rewrite, not a vanity score.",
    callToAction: "Use the next missing mention as your next content brief.",
  },
  {
    keyword: "GEO platform for agencies",
    pain: "Clients ask about AI search, but most reports stop at screenshots and vague advice.",
    promise: "CiteLens packages AI visibility into a repeatable client action plan.",
    proofPoint: "Every audit should end with the next paragraph, section, or page to ship.",
    callToAction: "Turn one client prompt into one publishable recommendation.",
  },
];

const HOOKS: Record<PersonaKey, string[]> = {
  calm_expert: [
    "Most brands are not invisible to AI because they are bad. They are invisible because they are unclear.",
    "Here is the quiet AI search problem I keep seeing on good websites.",
    "If AI can not summarize your company, it probably will not recommend it.",
  ],
  frustrated_business_owner: [
    "I searched my own category in ChatGPT and my brand was just... gone.",
    "Nothing is more annoying than seeing AI recommend everyone except you.",
    "Your site can rank on Google and still disappear inside AI answers.",
  ],
  seo_nerd: [
    "Classic SEO checks rankings. AI SEO checks whether the model understands you.",
    "The weird part about AI search is that the missing keyword is not always the missing signal.",
    "If your content only helps crawlers, it may still confuse answer engines.",
  ],
  agency_consultant: [
    "A client asked, 'Why does ChatGPT mention our competitor?' This is the audit I would run first.",
    "AI visibility reports are useless unless they become a client task.",
    "Here is how I would explain GEO to a client without turning it into another dashboard.",
  ],
  skeptical_founder: [
    "I do not want to build another analytics toy. I want to know what someone would fix next.",
    "My test for AI visibility is simple: would this create work worth shipping?",
    "If this does not become a weekly habit, the feature should not exist.",
  ],
};

function parseArgs(): { date: string; verbose: boolean } {
  const dateArg = process.argv.find((arg) => arg.startsWith("--date="));
  const date = dateArg?.split("=")[1] ?? new Date().toISOString().slice(0, 10);
  const verbose = process.argv.includes("--verbose");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid --date value "${date}". Expected YYYY-MM-DD.`);
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid calendar date "${date}".`);
  }

  return { date, verbose };
}

function dayNumber(date: string): number {
  return Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 86_400_000);
}

function pick<T>(items: T[], index: number): T {
  return items[((index % items.length) + items.length) % items.length];
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function makePlan(date: string): UGCPlan {
  const day = dayNumber(date);
  const persona = pick(PERSONAS, day);
  const topic = pick(TOPICS, Math.floor(day / PERSONAS.length));
  const hook = pick(HOOKS[persona.key], Math.floor(day / (PERSONAS.length * TOPICS.length)));

  const adCopy = [
    hook,
    topic.pain,
    topic.promise,
    topic.proofPoint,
    topic.callToAction,
  ].join(" ");

  const voiceoverLines = [
    hook,
    "",
    topic.pain,
    "",
    `That is the whole reason CiteLens exists. ${topic.promise}`,
    topic.proofPoint,
    "",
    topic.callToAction,
  ];

  const captionText = [
    hook.split(".")[0],
    topic.pain,
    topic.promise,
    "One gap. One fix. One page to improve.",
    topic.callToAction,
  ].join("\n");

  const shotList: Shot[] = [
    {
      time: "0.0-1.8s",
      framing: "handheld selfie, face close to camera",
      action: "deliver the hook without a cut; slight pause at the end",
      caption: hook.split(".")[0],
      notes: "strong first beat, no intro animation",
    },
    {
      time: "1.8-5.5s",
      framing: "screen recording or laptop over shoulder",
      action: "show a prompt or search result where the brand is missing",
      caption: topic.pain,
      notes: "hold long enough to read; avoid jump cuts",
    },
    {
      time: "5.5-10.0s",
      framing: "creator back on camera with screen visible",
      action: "explain what CiteLens turns the gap into",
      caption: topic.promise,
      notes: "calm middle section; let the voice breathe",
    },
    {
      time: "10.0-15.0s",
      framing: "simple UI mock or checklist card",
      action: "show one task: rewrite a section, add proof, clarify category, or compare competitors",
      caption: "One gap -> one fix",
      notes: "single visual idea, no over-cutting",
    },
    {
      time: "15.0-20.0s",
      framing: "selfie close, softer ending",
      action: "give the CTA like a real founder asking for feedback",
      caption: topic.callToAction,
      notes: "end conversational, not salesy",
    },
  ];

  const remotionScene: UGCPlan["remotionScene"] = {
    format: "vertical_9x16",
    durationSeconds: 20,
    style: `${persona.label}; creator-made; natural pauses; minimal kinetic text; ${persona.pacing}`,
    scenes: shotList.map((shot, index) => ({
      id: `scene_${String(index + 1).padStart(2, "0")}`,
      durationSeconds: index === 0 ? 1.8 : index === shotList.length - 1 ? 5 : 4,
      visual: `${shot.framing}: ${shot.action}`,
      voiceover: voiceoverLines.filter(Boolean)[index] ?? topic.callToAction,
      caption: shot.caption,
      pacing: index === 0 ? "beat" : index === 3 ? "hold" : "pause",
    })),
  };

  return {
    date,
    persona,
    topic,
    hook,
    adCopy,
    voiceoverScript: voiceoverLines.join("\n"),
    captionText,
    shotList,
    remotionScene,
  };
}

function markdownFor(plan: UGCPlan): string {
  const shots = plan.shotList
    .map(
      (shot, index) => `### Shot ${index + 1}: ${shot.time}
- Framing: ${shot.framing}
- Action: ${shot.action}
- Caption: ${shot.caption}
- Notes: ${shot.notes}`,
    )
    .join("\n\n");

  return `# CiteLens Daily UGC Brief - ${plan.date}

## Terminal Summary
- Persona: ${plan.persona.label}
- Topic: ${plan.topic.keyword}
- Hook: ${plan.hook}

## UGC Ad Copy
${plan.adCopy}

## Voiceover Script
${plan.voiceoverScript}

## Caption Text
${plan.captionText}

## Shot List
${shots}

## Remotion Scene Notes
- Format: ${plan.remotionScene.format}
- Duration: ${plan.remotionScene.durationSeconds}s
- Style: ${plan.remotionScene.style}

Saved JSON includes a Remotion-ready scene plan under \`remotionScene\`.
`;
}

function writeOutputs(plan: UGCPlan): { jsonPath: string; mdPath: string } {
  ensureDir(DATA_DIR);
  ensureDir(DOCS_DIR);

  const jsonPath = path.join(DATA_DIR, `citelens-ugc-${plan.date}.json`);
  const mdPath = path.join(DOCS_DIR, `citelens-ugc-${plan.date}.md`);

  writeFileSync(jsonPath, `${JSON.stringify(plan, null, 2)}\n`);
  writeFileSync(mdPath, markdownFor(plan));

  return { jsonPath, mdPath };
}

function main(): void {
  const { date, verbose } = parseArgs();
  const plan = makePlan(date);
  const { jsonPath, mdPath } = writeOutputs(plan);

  const relJson = path.relative(ROOT, jsonPath);
  const relMd = path.relative(ROOT, mdPath);
  const extra = verbose ? ` | hook="${plan.hook}"` : "";
  console.log(
    `UGC daily ${date}: ${plan.persona.label} / ${plan.topic.keyword} -> ${relMd}, ${relJson}${extra}`,
  );
}

main();
