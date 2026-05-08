# Hermes cron: manual patch instructions (2026-05-07)

Fixes `'str' object has no attribute '.get'` when legacy `jobs.json` stores `schedule` as a plain string, and hardens cron delivery / `config.yaml` parsing.

Apply **on your Mac** (these paths live under `~/.hermes`, which may be read-only to remote tools).

---

## Step 0 — Open the two Python files

1. `~/.hermes/hermes-agent/cron/jobs.py`
2. `~/.hermes/hermes-agent/cron/scheduler.py`

If the editor reports permission denied:

```bash
ls -la ~/.hermes/hermes-agent/cron/jobs.py ~/.hermes/hermes-agent/cron/scheduler.py
chmod u+w ~/.hermes/hermes-agent/cron/jobs.py ~/.hermes/hermes-agent/cron/scheduler.py
```

Create backups:

```bash
cp ~/.hermes/hermes-agent/cron/jobs.py ~/Desktop/jobs.py.bak-20260507
cp ~/.hermes/hermes-agent/cron/scheduler.py ~/Desktop/scheduler.py.bak-20260507
```

---

## File 1: `cron/jobs.py`

### Patch 1A — Replace `_ensure_next_run_at` and insert `_coerce_job_schedule`

**Find this exact block:**

```python
def _ensure_next_run_at(job: Dict[str, Any]) -> Dict[str, Any]:
    """Compute next_run_at for jobs missing it."""
    if job.get("next_run_at"):
        return job
    if job.get("enabled", True) and job.get("state") != "paused":
        schedule = job.get("schedule", {})
        if isinstance(schedule, dict) and schedule.get("kind"):
            job["next_run_at"] = compute_next_run(schedule)
    return job


# =============================================================================
# Job CRUD Operations
# =============================================================================
```

**Replace with:**

```python
def _ensure_next_run_at(job: Dict[str, Any]) -> Dict[str, Any]:
    """Compute next_run_at for jobs missing it."""
    job = _coerce_job_schedule(job)
    if job.get("next_run_at"):
        return job
    if job.get("enabled", True) and job.get("state") != "paused":
        schedule = job.get("schedule", {})
        if isinstance(schedule, dict) and schedule.get("kind"):
            job["next_run_at"] = compute_next_run(schedule)
    return job


def _coerce_job_schedule(job: Dict[str, Any]) -> Dict[str, Any]:
    """Older jobs.json entries sometimes store `schedule` as a bare string; normalize to a dict."""
    sch = job.get("schedule")
    if isinstance(sch, dict) and sch.get("kind"):
        return job
    if isinstance(sch, str) and sch.strip():
        try:
            parsed = parse_schedule(sch.strip())
            normalized = dict(job)
            normalized["schedule"] = parsed
            if not normalized.get("schedule_display"):
                normalized["schedule_display"] = parsed.get("display", sch.strip())
            logger.info(
                "Normalized legacy string schedule for job '%s'",
                normalized.get("id", "?"),
            )
            return normalized
        except ValueError as exc:
            logger.warning(
                "Job '%s' has invalid schedule string %r: %s",
                job.get("id", "?"),
                sch,
                exc,
            )
    return job


# =============================================================================
# Job CRUD Operations
# =============================================================================
```

### Patch 1B — `load_jobs()` success path

**Find** (inside the first `try` after `data = json.load(f)`):

```python
            return data.get("jobs", [])
```

**Replace with:**

```python
            raw = data.get("jobs", [])
            return [_coerce_job_schedule(j) for j in raw if isinstance(j, dict)]
```

### Patch 1C — `load_jobs()` JSON repair path

**Find** (inside `except json.JSONDecodeError` → inner `try`, after `strict=False` load):

```python
                jobs = data.get("jobs", [])
```

**Replace with:**

```python
                jobs = [_coerce_job_schedule(j) for j in data.get("jobs", []) if isinstance(j, dict)]
```

Save **`jobs.py`**.

---

## File 2: `cron/scheduler.py`

### Patch 2A — Safe `origin` before `.get`

**Find:**

```python
    if origin and origin.get("platform") == platform_name:
```

**Replace with:**

```python
    if isinstance(origin, dict) and origin.get("platform") == platform_name:
```

### Patch 2B — Safe `cron` key in `config.yaml`

**Find:**

```python
        user_cfg = load_config()
        wrap_response = user_cfg.get("cron", {}).get("wrap_response", True)
```

**Replace with:**

```python
        user_cfg = load_config()
        _cron_cfg = user_cfg.get("cron", {})
        wrap_response = (
            _cron_cfg.get("wrap_response", True)
            if isinstance(_cron_cfg, dict)
            else True
        )
```

Save **`scheduler.py`**.

---

## Step 3 — Restart Hermes

Restart the long-running process that loads `hermes-agent` (gateway / cron). Use your usual method (LaunchAgent, systemd, manual terminal process, etc.) so Python reloads the edited modules.

---

## Step 4 — Verify logs

Use **only** this (no extra words after the path):

```bash
tail -f ~/.hermes/logs/errors.log
```

After the next `hermes-master-doctor-nightly` (or other cron) run, you should not see:

`Error processing job ... 'str' object has no attribute 'get'`

---

## Optional Step 5 — `jobs.json` cleanup

Edit `~/.hermes/cron/jobs.json`. For job `hermes-master-doctor-nightly`, if you have:

```json
"origin": "Hermes Master Doctor setup"
```

you may set:

```json
"origin": null
```

Keep valid JSON. Optional only.

---

## Checklist

| Step | Action |
|------|--------|
| 0 | Backup + open `jobs.py` and `scheduler.py` |
| 1A–1C | Three edits in `jobs.py` |
| 2A–2B | Two edits in `scheduler.py` |
| 3 | Restart Hermes gateway |
| 4 | `tail -f ~/.hermes/logs/errors.log` |
| 5 | (Optional) Fix string `origin` in `jobs.json` |

---

## Note: monitoring `tail`

Wrong (zsh treats extra tokens as filenames):

```bash
tail -f ~/.hermes/logs/errors.log to monitor in real-time
```

Correct:

```bash
tail -f ~/.hermes/logs/errors.log
```
