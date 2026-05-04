export const prompts = [
  {
    query: "best sports card grading service for modern cards",
    mention: "Missing",
    competitors: ["PSA", "BGS", "TAG"],
    targetPage: "/card-grading",
    whyTheyWin: "They answer pricing, turnaround, guarantees, and trust signals in one scannable block.",
    fix: "Add a PSA vs TAG vs CardGrader comparison table with pricing, turnaround, guarantees, and trust badges.",
    effort: "2 hrs",
    impact: "High"
  },
  {
    query: "AI tool for finding movies similar to my favorites",
    mention: "Mentioned",
    competitors: ["TasteDive", "Likewise"],
    targetPage: "/movies-like",
    whyTheyWin: "They explain how recommendations are generated and give answer-ready examples.",
    fix: "Add FAQ schema and a short methodology section explaining how recommendations are generated.",
    effort: "45 min",
    impact: "Medium"
  },
  {
    query: "best pet symptom checker for cat sneezing",
    mention: "Weak",
    competitors: ["PetMD", "Chewy", "VCA"],
    targetPage: "/cat-sneezing",
    whyTheyWin: "They show medical trust signals before giving practical next steps.",
    fix: "Add vet-review language, author credentials, and 5 answer-style FAQs pulled from People Also Ask.",
    effort: "1 hr",
    impact: "High"
  },
  {
    query: "affordable local SEO agency alternatives",
    mention: "Missing",
    competitors: ["Semrush", "Ahrefs", "BrightLocal"],
    targetPage: "/local-seo",
    whyTheyWin: "They own comparison language for buyers deciding between software, agencies, and consultants.",
    fix: "Create an alternatives page for SMBs comparing DIY tools, agencies, and monthly reporting services.",
    effort: "90 min",
    impact: "Medium"
  }
];

export const weeklyActions = [
  {
    title: "Add answer-first FAQs to /card-grading",
    prompt: "best sports card grading service for modern cards",
    targetPage: "/card-grading",
    competitors: ["PSA", "BGS", "TAG"],
    evidence: "ChatGPT cites PSA and TAG because their pages answer pricing and turnaround directly.",
    fix: "Add 5 short FAQs that answer price, turnaround, raw-vs-graded value, PSA 9 downside, and when not to grade.",
    effort: "30 min",
    impact: "High"
  },
  {
    title: "Create /alternatives/psa-vs-tag-vs-cardgrader",
    prompt: "PSA vs TAG vs BGS card grading",
    targetPage: "/alternatives/psa-vs-tag-vs-cardgrader",
    competitors: ["PSA", "TAG", "BGS"],
    evidence: "Perplexity prefers pages with direct comparison tables and third-party proof.",
    fix: "Create a comparison page with pricing, turnaround, resale trust, grading transparency, and a decision table.",
    effort: "2 hrs",
    impact: "High"
  },
  {
    title: "Add Product, FAQ, and Organization schema",
    prompt: "is CardGrader a legit card grading tool",
    targetPage: "/card-grading",
    competitors: ["PSA", "TAG"],
    evidence: "Gemini returned structured brand facts for competitors but not your site.",
    fix: "Add Product, FAQ, and Organization schema so AI systems can extract brand facts without guessing.",
    effort: "45 min",
    impact: "Medium"
  },
  {
    title: "Add one original stat AI can cite",
    prompt: "is grading this card worth it",
    targetPage: "/card-grading",
    competitors: ["PSA", "BGS", "PriceCharting"],
    evidence: "AI Overviews cited pages with concrete numbers, not generic service copy.",
    fix: "Publish one simple data point from sample calculations, such as average PSA 9 downside after grading fees.",
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
