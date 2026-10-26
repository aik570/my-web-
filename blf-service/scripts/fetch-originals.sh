#!/usr/bin/env bash
# Download the original assets listed in references/asset-manifest.tsv from
# the live site. Read-only: GET requests only, nothing is sent to the site.
#
# - Requests only the URLs in the manifest, over https. Redirects are not
#   followed: a 3xx is logged as a failure with its target, for review.
# - Fetches only the largest file per image; the -p-500/-p-800/-p-1080
#   srcset variants are derivatives and are deliberately skipped.
# - Never overwrites: a path that already exists (file or link) is left alone.
# - Rejects anything that is not a non-empty image (HTML error pages etc.).
# - Writes one line per manifest entry to docs/research/download-log.tsv,
#   with the reason for every failure.
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
size_of() { wc -c <"$1" | tr -d ' '; }

# id status http content_type bytes sha256 path url note utc
log() { printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$@" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$LOG"; }

printf 'id\tstatus\thttp\tcontent_type\tbytes\tsha256\tpath\turl\tnote\tutc\n' > "$LOG"
ok=0; fail=0; skip=0

while IFS=$'\t' read -r id dir file url; do
  [[ -z "$id" || "$id" == \#* ]] && continue
  dest="$dir/$file"

  if [[ -e "$dest" || -L "$dest" ]]; then
    if [[ -f "$dest" ]]; then log "$id" exists - - "$(size_of "$dest")" "$(hash "$dest")" "$dest" "$url" "left untouched"
    else log "$id" exists - - - - "$dest" "$url" "path exists but is not a regular file; left untouched"; fi
    skip=$((skip+1)); continue
  fi

  mkdir -p "$dir"
  tmp=$(mktemp)
  meta=$(curl -sS --proto =https --max-time 60 \
           -A "$UA" -o "$tmp" -w '%{http_code}\t%{content_type}\t%{redirect_url}' "$url" 2>"$tmp.err")
  rc=$?
  code=$(cut -f1 <<<"$meta"); ctype=$(cut -f2 <<<"$meta"); target=$(cut -f3 <<<"$meta")
  code=${code:-000}; ctype=${ctype:--}

  note=""
  if (( rc != 0 )); then note="curl exit $rc: $(head -c 200 "$tmp.err" | tr '\t\n' '  ')"
  elif [[ "$code" == 3* ]]; then note="HTTP $code redirect to ${target:-?} (not followed)"
  elif [[ "$code" != 200 ]]; then note="HTTP $code"
  elif [[ "$ctype" != image/* ]]; then note="not an image ($ctype)"
  elif [[ ! -s "$tmp" ]]; then note="empty response"
  fi

  if [[ -z "$note" ]] && mv -n "$tmp" "$dest" && [[ ! -e "$tmp" ]]; then
    log "$id" ok "$code" "$ctype" "$(size_of "$dest")" "$(hash "$dest")" "$dest" "$url" ""
    ok=$((ok+1))
  else
    log "$id" failed "$code" "$ctype" - - "$dest" "$url" "${note:-destination appeared during download; left untouched}"
    fail=$((fail+1))
  fi
  rm -f "$tmp" "$tmp.err"
  sleep 0.5
done < "$MANIFEST"

echo "retrieved: $ok   failed: $fail   already present: $skip   (log: $LOG)"
