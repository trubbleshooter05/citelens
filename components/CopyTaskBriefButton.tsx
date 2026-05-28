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

function formatBrief(task: TaskBrief) {
  return [
    `CiteLens task: ${task.title}`,
    `Prompt to win: ${task.prompt}`,
    `Target page: ${task.targetPage}`,
    `Competitors cited: ${task.competitors.join(", ")}`,
    `Evidence: ${task.evidence}`,
    `Exact fix: ${task.fix}`,
    `Effort: ${task.effort}`,
    `Impact: ${task.impact}`,
  ].join("\n");
}

export function CopyTaskBriefButton({ task }: { task: TaskBrief }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const brief = formatBrief(task);

  async function copyBrief() {
    setExpanded(true);

    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = brief;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }

    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="task-brief-control">
      <button type="button" onClick={copyBrief}>
        {copied ? "Copied to clipboard" : "Copy task brief"}
      </button>
      {expanded ? (
        <pre className="task-brief-preview" aria-live="polite">
          {brief}
        </pre>
      ) : null}
    </div>
  );
}
