#!/bin/zsh
# CiteLens UGC Daily Job — Hermes runner
# Full pipeline: growth intel + voiceovers + Remotion renders + approval doc
#
# Manual run:
#   zsh ~/projects/CiteLens/seo-engine/hermes/ugc-daily.sh
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

CITELENS_DIR="${CITELENS_DIR:-$HOME/projects/CiteLens}"
LOG_DIR="${CITELENS_DIR}/logs"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DATE="$(date +%Y-%m-%d)"
LOG_FILE="${LOG_DIR}/ugc-daily-${TIMESTAMP}.log"

mkdir -p "${LOG_DIR}"
exec > >(tee -a "${LOG_FILE}") 2>&1

echo "[$(date)] === CiteLens UGC Daily Start ==="

LOCK="${CITELENS_DIR}/.ugc-daily.lock"
if ! mkdir "${LOCK}" 2>/dev/null; then
  echo "Another UGC daily run is active. Exiting."
  exit 0
fi
trap 'rmdir "${LOCK}" 2>/dev/null || true' EXIT

cd "${CITELENS_DIR}"

if [[ -f "${HOME}/.hermes/.env" ]]; then
  set -o allexport
  source "${HOME}/.hermes/.env"
  set +o allexport
fi

if [[ ! -d "${CITELENS_DIR}/video/node_modules" ]]; then
  echo "[$(date)] Installing Remotion deps..."
  (cd "${CITELENS_DIR}/video" && npm ci)
fi

echo "[$(date)] Running ugc:daily..."
npm run ugc:daily -- --date="${DATE}"

VIDEO_COUNT=$(ls -1 "${CITELENS_DIR}/video/out/citelens-"*"-${DATE}.mp4" 2>/dev/null | wc -l | tr -d ' ')
echo "=== CiteLens UGC Daily Done ==="
echo "Date: ${DATE}"
echo "Videos rendered: ${VIDEO_COUNT}/3"
echo "Approval: docs/growth/daily-ugc-approval-${DATE}.md"
echo "Videos: video/out/citelens-{competitor-hook,task-brief,score-reveal}-${DATE}.mp4"
echo "Log: ${LOG_FILE}"

if [[ "${VIDEO_COUNT}" -lt 3 ]]; then
  echo "ERROR: expected 3 videos, got ${VIDEO_COUNT}"
  exit 1
fi
