#!/usr/bin/env bash

set -Eeuo pipefail

APP_NAME="${APP_NAME:-ezequiel-web-site}"
APP_DIR="${APP_DIR:-/var/www/ezequiel-web-site}"
BRANCH="${BRANCH:-main}"
SERVICE_NAME="${SERVICE_NAME:-ezequiel-web-site}"
ENV_FILE="${ENV_FILE:-/etc/ezequiel-web-site.env}"
DATA_DIR="${DATA_DIR:-/var/lib/ezequiel-web-site}"
DB_PATH="${DB_PATH:-$DATA_DIR/blog.db}"
APP_HOST="${APP_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-4321}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1:8080/}"
NODE_ENV="${NODE_ENV:-production}"

log() {
  printf '\n[%s] %s\n' "$APP_NAME" "$1"
}

fail() {
  printf '\n[%s] ERROR: %s\n' "$APP_NAME" "$1" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

require_cmd git
require_cmd node
require_cmd npm
require_cmd systemctl
require_cmd curl

[[ -d "$APP_DIR" ]] || fail "APP_DIR does not exist: $APP_DIR"
[[ -f "$ENV_FILE" ]] || fail "ENV_FILE does not exist: $ENV_FILE"

mkdir -p "$DATA_DIR"

log "Updating repository"
git -C "$APP_DIR" fetch --prune origin
git -C "$APP_DIR" checkout "$BRANCH"
git -C "$APP_DIR" pull --ff-only origin "$BRANCH"

log "Installing dependencies"
npm --prefix "$APP_DIR" ci

log "Building application"
NODE_ENV="$NODE_ENV" npm --prefix "$APP_DIR" run build

log "Ensuring runtime data directory"
touch "$DB_PATH"

log "Restarting systemd service"
sudo systemctl daemon-reload
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl --no-pager --full status "$SERVICE_NAME"

log "Waiting for local app"
for attempt in $(seq 1 20); do
  if curl -fsS "http://$APP_HOST:$APP_PORT/" >/dev/null; then
    break
  fi
  if [[ "$attempt" -eq 20 ]]; then
    fail "App did not become healthy on http://$APP_HOST:$APP_PORT/"
  fi
  sleep 1
done

log "Checking nginx-facing endpoint"
curl -fIsS "$HEALTHCHECK_URL" >/dev/null || fail "Healthcheck failed at $HEALTHCHECK_URL"

log "Checking built asset through nginx"
homepage_html="$(curl -fsS "$HEALTHCHECK_URL")"
asset_path="$(printf '%s' "$homepage_html" | grep -oE '/_astro/[^"'"'"' ]+\.(css|js)' | head -n 1 || true)"
[[ -n "$asset_path" ]] || fail "Could not find an Astro asset in $HEALTHCHECK_URL"

asset_origin="$(node -e "console.log(new URL(process.argv[1]).origin)" "$HEALTHCHECK_URL")"
asset_url="$asset_origin$asset_path"
curl -fIsS "$asset_url" >/dev/null || fail "Asset check failed at $asset_url"

log "Deploy completed successfully"
printf '[%s] DB_PATH=%s\n' "$APP_NAME" "$DB_PATH"
printf '[%s] Healthcheck=%s\n' "$APP_NAME" "$HEALTHCHECK_URL"
printf '[%s] AssetCheck=%s\n' "$APP_NAME" "$asset_url"
