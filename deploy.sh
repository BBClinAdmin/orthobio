#!/usr/bin/env bash
# Orthobio deploy: sync a Claude Design export into this repo, then commit & push.
#
# Usage:  ./deploy.sh /path/to/design_handoff_orthobio_export
# The export's actual site lives in a `site/` SUBFOLDER (index.html, *.css, *.js, assets/).
#
# IMPORTANT: the --exclude list below protects deploy-layer files that are NOT
# produced by the Claude Design export. Without these excludes, `rsync --delete`
# would wipe them on every deploy.
set -euo pipefail

EXPORT="${1:?Usage: ./deploy.sh /path/to/export (expects a site/ subfolder inside)}"
SRC="$EXPORT/site/"
DEST="$(cd "$(dirname "$0")" && pwd)/"

[ -d "$SRC" ] || { echo "ERROR: $SRC not found (export should contain a site/ subfolder)"; exit 1; }

echo "== DRY RUN =="
rsync -ai --delete \
  --exclude '.git' \
  --exclude '.nojekyll' \
  --exclude 'README.md' \
  --exclude 'robots.txt' \
  --exclude 'sitemap.xml' \
  --exclude 'CNAME' \
  --exclude 'deploy.sh' \
  --dry-run "$SRC" "$DEST"

read -r -p "Proceed with the real sync? [y/N] " ans
[ "$ans" = "y" ] || { echo "Aborted."; exit 0; }

rsync -a --delete \
  --exclude '.git' \
  --exclude '.nojekyll' \
  --exclude 'README.md' \
  --exclude 'robots.txt' \
  --exclude 'sitemap.xml' \
  --exclude 'CNAME' \
  --exclude 'deploy.sh' \
  "$SRC" "$DEST"

cd "$DEST"
git add -A
git status -s
echo "Review the changes above, then: git commit && git push"
