# Hermes Codex Context

Permanent reference for Hermes-related work in this project.

## Scope

This file is the source of truth for Hermes paths, Obsidian paths, Telegram delivery, cron behavior, gateway behavior, and environment loading rules for this project.

Current repo path:

```text
/Users/openclaw/projects/CiteLens
```

Expected repo path is `~/projects/CiteLens`. Always verify with `pwd` before editing files.

## Hermes Critical Paths

- Hermes root: `~/.hermes`
- Hermes agent: `~/.hermes/hermes-agent/`
- Hermes venv CLI: `~/.hermes/hermes-agent/.venv/bin/hermes`
- Hermes config: `~/.hermes/config.yaml`
- Hermes cron jobs: `~/.hermes/cron/jobs.json`
- Hermes env: `~/.hermes/.env`
- Gateway launchd plist: `~/Library/LaunchAgents/ai.hermes.gateway.plist`
- Gateway logs: `~/.hermes/logs/gateway.log` and `~/.hermes/logs/gateway.error.log`
- Gateway state DB: `~/.hermes/state.db`
- Master Doctor skill: `~/.hermes/skills/hermes-master-doctor/`
- Master Doctor script: `~/.hermes/skills/hermes-master-doctor/scripts/doctor.py`
- Master Doctor reports: `~/.hermes/logs/master_doctor_reports/`

## Obsidian Paths

- Obsidian root: `~/ObsidianVault`
- Master Doctor audit log: `~/ObsidianVault/logs/hermes_master_doctor.md`
- Hermes system reports: `~/ObsidianVault/hermes_system/reports/`
- FursBliss output example: `~/ObsidianVault/fursbliss/pet_symptom_content/`
- MoviesLike output example: `~/ObsidianVault/movieslike/seo/`
- CardSnap output example: `~/ObsidianVault/cardsnap/ads/`

Full reports should be saved to Obsidian. Telegram should receive only concise summaries through Hermes delivery.

## Telegram Delivery Rules

- Scripts must not send Telegram directly unless explicitly instructed.
- Hermes jobs should use `deliver: telegram`.
- Standard job flow:
  1. Script runs logic.
  2. Full report is saved to Obsidian.
  3. Script prints one concise summary to stdout.
  4. Hermes sends stdout to Telegram via `deliver: telegram`.
- Master Doctor prompt rule: do not send Telegram directly; Hermes `deliver: telegram` handles delivery.
- Telegram verification diagnostic: source `~/.hermes/.env`, then call Telegram `getMe`.
- If Telegram stops delivering, check `~/.hermes/logs/gateway.error.log` for dependency errors and `~/.hermes/logs/gateway.log` for current gateway activity.

## Cron Job Behavior

- Cron triggers a Hermes job on schedule.
- Hermes job defines skill/script and delivery method.
- Skill/script runs logic and generates data.
- Full output goes to Obsidian.
- Short stdout summary goes to Telegram via Hermes.

Master Doctor cron:

- Job id: `hermes-master-doctor-nightly`
- Schedule: daily `11:30 PM`
- Cron expression: `30 23 * * *`
- Delivery: `telegram`
- Command:

```bash
source ~/.hermes/.env && python3 ~/.hermes/skills/hermes-master-doctor/scripts/doctor.py --safe-fix
```

Repeated `[SILENT]` behavior was fixed for Job Hunter jobs. Job Hunter should return best ranked matches instead of literal `[SILENT]`.

## Gateway Behavior

- Gateway is launchd-managed through `~/Library/LaunchAgents/ai.hermes.gateway.plist`.
- Gateway can be restarted with launchctl unload/load or stop/start.
- If scheduling breaks, deleting `~/.hermes/state.db` and restarting gateway may be required.
- Gateway requires Python 3.10+; Python 3.11 venv was used.
- `python-telegram-bot[webhooks]` must include webhook dependencies such as Tornado.
- A conflicting separate Node/openclaw gateway previously caused Hermes gateway shutdowns.
- `gateway.error.log` may be stale; check `gateway.log` for current gateway activity.

Useful recovery commands:

```bash
pkill -f "hermes_cli.main"
launchctl unload "$HOME/Library/LaunchAgents/ai.hermes.gateway.plist"
launchctl load "$HOME/Library/LaunchAgents/ai.hermes.gateway.plist"
```

Manual Hermes run fallback:

```bash
~/.hermes/hermes-agent/.venv/bin/hermes cron run
```

## Env Loading Rules

- `launchd` strips environment variables from background jobs.
- Scripts spawned by Hermes must explicitly load required env values from `~/.hermes/.env`.
- Some scripts may also check `~/.env`, but Hermes env source of truth is `~/.hermes/.env`.
- Use `source ~/.hermes/.env` before manual cron/script tests when env is needed.
- Subprocesses need explicit env loading, especially for `OPENAI_API_KEY`, `VERCEL_TOKEN`, and `VERCEL_BLOB_TOKEN`.
- `VERCEL_BLOB_TOKEN` must be a `vercel_blob_rw_...` token, not a `vcp_...` deploy token.
- Do not edit or auto-fix secrets/API keys unless explicitly instructed.

## Codex Must Always Know

- Current repo path is `/Users/openclaw/projects/CiteLens`.
- Always verify the working directory with `pwd` before editing files.
- Hermes root is `~/.hermes`.
- Obsidian root is `~/ObsidianVault`.
- Telegram delivery is handled by Hermes `deliver: telegram`.
- Scripts should not send Telegram directly unless explicitly told.
- After Hermes reinstall or upgrade, ensure `~/.hermes/config.yaml` has:
  - `agent.reasoning_effort: none`
  - `cron.wrap_response: false`
  - terminal timeout around `600`
- Known failure signal: `Encrypted content not supported` means reasoning params are being sent to an incompatible model; fix with `reasoning_effort: none`.
- Prefer safe fixes only:
  - no secrets
  - no unknown code changes
  - no destructive deletes
  - no force pushes
- Jobs with null or broken prompt/command may need deletion from `~/.hermes/cron/jobs.json`; disabling alone may not stop scheduler errors.
