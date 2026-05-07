import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, cpSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const repo = path.resolve(import.meta.dirname, "..");

function fixture() {
  const dir = mkdtempSync(path.join(tmpdir(), "citelens-growth-"));
  cpSync(path.join(repo, "scripts"), path.join(dir, "scripts"), { recursive: true });
  cpSync(path.join(repo, "app"), path.join(dir, "app"), { recursive: true });
  cpSync(path.join(repo, "package.json"), path.join(dir, "package.json"));
  cpSync(path.join(repo, "node_modules"), path.join(dir, "node_modules"), { recursive: true });
  mkdirSync(path.join(dir, "data", "growth"), { recursive: true });
  mkdirSync(path.join(dir, "docs", "growth"), { recursive: true });
  return dir;
}

function runGrowthIntel(dir, date) {
  execFileSync(process.execPath, ["--import", "tsx", "scripts/growth-intel.ts", `--date=${date}`], {
    cwd: dir,
    env: {
      ...process.env,
      CITELENS_OBSIDIAN_GROWTH_DIR: path.join(dir, "obsidian-growth"),
    },
    encoding: "utf8",
  });
}

test("daily CiteLens UGC scripts use score-reveal voice and avoid repeating yesterday", () => {
  const dir = fixture();
  runGrowthIntel(dir, "2026-05-05");
  runGrowthIntel(dir, "2026-05-06");

  const today = readFileSync(path.join(dir, "data/growth/citelens-growth-intel-2026-05-06.csv"), "utf8");
  const yesterday = readFileSync(path.join(dir, "data/growth/citelens-growth-intel-2026-05-05.csv"), "utf8");

  assert.match(today, /ugc_script/);
  assert.match(today, /citelens-score-reveal\.mp4/);
  assert.match(today, /I'm testing one thing/i);
  assert.notEqual(today, yesterday);
});

test("growth intel surfaces duplicate-day freshness warnings when source inputs are stale", () => {
  const dir = fixture();
  runGrowthIntel(dir, "2026-05-05");
  runGrowthIntel(dir, "2026-05-06");

  const report = readFileSync(path.join(dir, "docs/growth/citelens-growth-intel-2026-05-06.md"), "utf8");
  assert.match(report, /Freshness Warning/);
  assert.match(report, /same source inputs as 2026-05-05/);
});
