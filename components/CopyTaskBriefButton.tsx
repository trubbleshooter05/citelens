"use client";

import { useState } from "react";

type TaskBrief = {
  title: string;
  prompt: string;
  targetPage: string;
  competitors: string[];
  evidence: string;
  fix: string;
  effort: string;
  impact: string;
};

export function CopyTaskBriefButton({ task }: { task: TaskBrief }) {
  const [copied, setCopied] = useState(false);

  async function copyBrief() {
    const brief = [
      `CiteLens task: ${task.title}`,
      `Prompt to win: ${task.prompt}`,
      `Target page: ${task.targetPage}`,
      `Competitors cited: ${task.competitors.join(", ")}`,
      `Evidence: ${task.evidence}`,
      `Exact fix: ${task.fix}`,
      `Effort: ${task.effort}`,
      `Impact: ${task.impact}`,
    ].join("\n");

    await navigator.clipboard.writeText(brief);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button type="button" onClick={copyBrief}>
      {copied ? "Brief copied" : "Copy task brief"}
    </button>
  );
}
