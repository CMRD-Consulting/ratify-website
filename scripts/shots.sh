#!/usr/bin/env bash
# Re-encode the captures in public/shots/src/ into what the site ships.
#
# `npm run shoot` writes 2x PNG stills and already-animated WebP into
# public/shots/src/. This downsamples the stills to the 1440px the page uses
# and copies the animations across.
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

# Stills are captured at 2x; the page never renders them wider than ~1180px,
# so downsampling to 1440 is free sharpness rather than lost detail.
for f in "$src"/*.png; do
  name="$(basename "$f" .png)"
  cwebp -quiet -q 82 -sharp_yuv -resize 1440 0 "$f" -o "$out/$name.webp"
  echo "  $name.png  →  $name.webp"
done

# Animations arrive from img2webp already encoded.
for f in "$src"/*.webp; do
  name="$(basename "$f")"
  cp "$f" "$out/$name"
  echo "  $name (animated)"
done

echo
du -sh "$out"
