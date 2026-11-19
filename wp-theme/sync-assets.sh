#!/usr/bin/env bash
# Copies the design-source CSS and JS from homepage-preview/ into the theme.
# The static preview stays the place to fine-tune styles; run this afterwards.
#   ./sync-assets.sh          copy files into the theme
#   ./sync-assets.sh --check  report any file that has drifted (exit 1 if so)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
src="$here/../homepage-preview"
dst="$here/mysbdc/assets"
files=(
  "about-motion.js:js/about-motion.js"
  "footer-reveal.js:js/footer-reveal.js"
  "about.css:css/about.css"
  "assets/about-golden-gate.webp:img/about-golden-gate.webp"
  "assets/about-redwoods-coast.webp:img/about-redwoods-coast.webp"
  "home-design.css:css/home-design.css"
  "home-design.js:js/home-design.js"
  "refined.css:css/refined.css"
  "impact.css:css/impact.css"
  "atlas.css:css/atlas.css"
  "app.js:js/app.js"
  "motion.js:js/motion.js"
  "atlas.js:js/atlas.js"
  "atlas-data.js:js/atlas-data.js"
  "signup.js:js/signup.js"
  "assets/partners/sbdc-accredited.png:img/partners/sbdc-accredited.png"
  "assets/partners/cal-poly-humboldt.png:img/partners/cal-poly-humboldt.png"
  "assets/partners/scale-calosba.png:img/partners/scale-calosba.png"
  "assets/partners/powered-by-sba.png:img/partners/powered-by-sba.png"
)
drift=0
for pair in "${files[@]}"; do
  from="$src/${pair%%:*}"; to="$dst/${pair##*:}"
  if [[ "${1:-}" == "--check" ]]; then
    cmp -s "$from" "$to" || { echo "drifted: ${pair##*:}"; drift=1; }
  else
    mkdir -p "$(dirname "$to")"; cp "$from" "$to"
  fi
done
if [[ "${1:-}" == "--check" ]]; then
  [[ $drift -eq 0 ]] && echo "Theme assets match homepage-preview."
  exit $drift
fi
echo "Synced ${#files[@]} files into mysbdc/assets."
