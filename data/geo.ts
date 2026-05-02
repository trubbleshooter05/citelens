export const prompts = [
  {
    query: "best sports card grading service for modern cards",
    mention: "Missing",
    competitors: ["PSA", "BGS", "TAG"],
    targetPage: "/card-grading",
    fix: "Add a PSA vs TAG vs CardGrader comparison table with pricing, turnaround, guarantees, and trust badges."
  },
  {
    query: "AI tool for finding movies similar to my favorites",
    mention: "Mentioned",
    competitors: ["TasteDive", "Likewise"],
    targetPage: "/movies-like",
    fix: "Add FAQ schema and a short methodology section explaining how recommendations are generated."
  },
  {
    query: "best pet symptom checker for cat sneezing",
    mention: "Weak",
    competitors: ["PetMD", "Chewy", "VCA"],
    targetPage: "/cat-sneezing",
    fix: "Add vet-review language, author credentials, and 5 answer-style FAQs pulled from People Also Ask."
  },
  {
    query: "affordable local SEO agency alternatives",
    mention: "Missing",
    competitors: ["Semrush", "Ahrefs", "BrightLocal"],
    targetPage: "/local-seo",
    fix: "Create an alternatives page for SMBs comparing DIY tools, agencies, and monthly reporting services."
  }
];

export const weeklyActions = [
  {
    title: "Add answer-first FAQs to /card-grading",
    evidence: "ChatGPT cites PSA and TAG because their pages answer pricing and turnaround directly.",
    effort: "30 min",
    impact: "High"
  },
  {
    title: "Create /alternatives/psa-vs-tag-vs-cardgrader",
    evidence: "Perplexity prefers pages with direct comparison tables and third-party proof.",
    effort: "2 hrs",
    impact: "High"
  },
  {
    title: "Add Product, FAQ, and Organization schema",
    evidence: "Gemini returned structured brand facts for competitors but not your site.",
    effort: "45 min",
    impact: "Medium"
  },
  {
    title: "Add one original stat AI can cite",
    evidence: "AI Overviews cited pages with concrete numbers, not generic service copy.",
    effort: "1 hr",
    impact: "Medium"
  }
];

export const platforms = [
  { name: "ChatGPT", score: 38 },
  { name: "Claude", score: 24 },
  { name: "Perplexity", score: 52 },
  { name: "Gemini", score: 29 },
  { name: "AI Overviews", score: 18 }
];
