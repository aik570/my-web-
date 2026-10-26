#!/usr/bin/env bash
# Download the original assets listed in references/asset-manifest.tsv from
# the live site. Read-only: GET requests only, nothing is sent to the site.
#
# - Fetches only the largest file per image; the -p-500/-p-800/-p-1080
#   srcset variants are derivatives and are deliberately skipped.
# - Never overwrites: a file that already exists is left alone.
# - Rejects anything that is not served as an image (HTML error pages etc.).
# - Writes a result line per asset to docs/research/download-log.tsv.
#
# Usage, from the blf-service/ directory:   bash scripts/fetch-originals.sh
# Needs: bash, curl, sha256sum (or shasum on macOS).

set -u
cd "$(dirname "$0")/.."

MANIFEST=references/asset-manifest.tsv
LOG=docs/research/download-log.tsv
UA="BLF-redesign-asset-inventory/1.0 (read-only)"

if command -v sha256sum >/dev/null; then hash() { sha256sum "$1" | cut -d' ' -f1; }
else hash() { shasum -a 256 "$1" | cut -d' ' -f1; }; fi

printf 'id\tstatus\thttp\tcontent_type\tbytes\tsha256\tpath\tutc\n' > "$LOG"
ok=0; fail=0; skip=0

while IFS=$'\t' read -r id dir file url; do
  [[ -z "$id" || "$id" == \#* ]] && continue
  mkdir -p "$dir"
  dest="$dir/$file"
  now=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  if [[ -e "$dest" ]]; then
    printf '%s\texists\t-\t-\t%s\t%s\t%s\t%s\n' "$id" "$(wc -c <"$dest" | tr -d ' ')" "$(hash "$dest")" "$dest" "$now" >> "$LOG"
    skip=$((skip+1)); continue
  fi

  tmp=$(mktemp)
  meta=$(curl -sS -L --max-time 60 -A "$UA" -o "$tmp" -w '%{http_code}\t%{content_type}' "$url" 2>/dev/null) || meta=$'000\t'
  code=${meta%%$'\t'*}; ctype=${meta#*$'\t'}; ctype=${ctype:--}

  if [[ "$code" == 200 && "$ctype" == image/* ]]; then
    mv "$tmp" "$dest"
    printf '%s\tok\t%s\t%s\t%s\t%s\t%s\t%s\n' "$id" "$code" "$ctype" "$(wc -c <"$dest" | tr -d ' ')" "$(hash "$dest")" "$dest" "$now" >> "$LOG"
    ok=$((ok+1))
  else
    rm -f "$tmp"
    printf '%s\tfailed\t%s\t%s\t-\t-\t%s\t%s\n' "$id" "$code" "$ctype" "$url" "$now" >> "$LOG"
    fail=$((fail+1))
  fi
  sleep 0.5
done < "$MANIFEST"

echo "retrieved: $ok   failed: $fail   already present: $skip   (log: $LOG)"
