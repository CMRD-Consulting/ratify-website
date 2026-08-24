#!/usr/bin/env bash
# Re-encode the captures in public/shots/src/ into what the site ships.
#
# `npm run shoot` writes 2x PNG stills and already-animated WebP into
# public/shots/src/, once per palette — Nocturne at the top level and
# C · Slate in a light/ subdirectory. This downsamples the stills to the
# 1440px the page uses, copies the animations across, and preserves that
# shape, because it is the shape Shot.vue derives its light path from.
#
# The output is committed, so a clean clone and `npm run build` need neither
# these tools nor the app repo:
#
#   brew install webp        # cwebp
#   npm run shoot && npm run shots
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src="$here/../public/shots/src"
out="$here/../public/shots"

command -v cwebp >/dev/null || { echo "missing cwebp — brew install webp" >&2; exit 1; }

[ -d "$src" ] || {
  echo "no captures in public/shots/src — run: npm run shoot" >&2
  exit 1
}

shopt -s nullglob

encode() {
  local from="$1" to="$2"
  mkdir -p "$to"

  # Stills are captured at 2x; the page never renders them wider than ~1180px,
  # so downsampling to 1440 is free sharpness rather than lost detail.
  for f in "$from"/*.png; do
    name="$(basename "$f" .png)"
    cwebp -quiet -q 82 -sharp_yuv -resize 1440 0 "$f" -o "$to/$name.webp"
    echo "  $name.png  →  $name.webp"
  done

  # Animations arrive from img2webp already encoded.
  for f in "$from"/*.webp; do
    name="$(basename "$f")"
    cp "$f" "$to/$name"
    echo "  $name (animated)"
  done
}

echo "dark"
encode "$src" "$out"

# The light pass is not optional, but it can legitimately be missing on a
# checkout that predates it. Say so rather than shipping half a themed page.
if [ -d "$src/light" ]; then
  echo
  echo "light"
  encode "$src/light" "$out/light"
else
  echo
  echo "no light captures in public/shots/src/light — the page will 404 on" >&2
  echo "every screenshot in light mode. Re-run: npm run shoot" >&2
  exit 1
fi

echo
du -sh "$out"
