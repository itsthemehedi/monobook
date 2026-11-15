#!/bin/bash
# Checks that every page, file and the contact form API of the MonoBook site is live. Usage: bash check-live.sh [https://monobook.co]
BASE="${1:-https://monobook.co}"; MISS=0; OK=0
for u in "/" "/404.html" "/about/" "/apple-touch-icon.png" "/assets/index--9GHwDKZ.js" "/assets/index-CVN9n3HJ.css" "/contact/" "/fonts/inter-latin.woff2" "/fonts/manrope-latin.woff2" "/icon-192.png" "/icon-48.png" "/icon-512.png" "/icon.svg" "/manifest.webmanifest" "/motion.js" "/og.png" "/privacy/" "/process/" "/questions/" "/robots.txt" "/sitemap.xml" "/what-you-get/" "/work/" "/work/gartnerabo/guideline-lg.jpg" "/work/gartnerabo/guideline-sm.jpg" "/work/gartnerabo/logotype-lg.jpg" "/work/gartnerabo/logotype-sm.jpg" "/work/gartnerabo/mark-lg.jpg" "/work/gartnerabo/mark-sm.jpg" "/work/gartnerabo/outdoor-lg.jpg" "/work/gartnerabo/outdoor-sm.jpg" "/work/gartnerabo/sketch-lg.jpg" "/work/gartnerabo/sketch-sm.jpg" "/work/gartnerabo/social-lg.jpg" "/work/gartnerabo/social-sm.jpg" "/work/gartnerabo/story-lg.jpg" "/work/gartnerabo/story-sm.jpg" "/work/mayfair/after-lg.jpg" "/work/mayfair/after-sm.jpg" "/work/mayfair/approved-lg.jpg" "/work/mayfair/approved-sm.jpg" "/work/mayfair/before-lg.jpg" "/work/mayfair/before-sm.jpg" "/work/mayfair/colour-lg.jpg" "/work/mayfair/colour-sm.jpg" "/work/mayfair/sketch-lg.jpg" "/work/mayfair/sketch-sm.jpg" "/work/mayfair/type-lg.jpg" "/work/mayfair/type-sm.jpg"; do
  code=$(curl -sL -o /dev/null -w "%{http_code}" "$BASE$u")
  if [ "$code" = "200" ]; then OK=$((OK+1)); else echo "MISSING ($code) $u"; MISS=$((MISS+1)); fi
done
code=$(curl -sL -o /dev/null -w "%{http_code}" "$BASE/this-page-does-not-exist-xyz"); [ "$code" = "404" ] || { echo "404 page returns $code, expected 404"; MISS=$((MISS+1)); }
# Each page must be its own prerendered HTML (not the Home page served for every URL).
curl -sL "$BASE/about/" | grep -qF '<title>About: Mehedi Hasan, Founder | MonoBook</title>' || { echo "WRONG PAGE /about/: its own HTML is not being served"; MISS=$((MISS+1)); }
curl -sL "$BASE/contact/" | grep -qF '<title>Contact: Email Your Brief | MonoBook</title>' || { echo "WRONG PAGE /contact/: its own HTML is not being served"; MISS=$((MISS+1)); }
curl -sL "$BASE/" | grep -qF '<title>Brand Identity Design for UK Trade Businesses | MonoBook</title>' || { echo "WRONG PAGE /: its own HTML is not being served"; MISS=$((MISS+1)); }
curl -sL "$BASE/privacy/" | grep -qF '<title>Privacy | MonoBook</title>' || { echo "WRONG PAGE /privacy/: its own HTML is not being served"; MISS=$((MISS+1)); }
curl -sL "$BASE/process/" | grep -qF '<title>How It Works: From Brief to Five Parts | MonoBook</title>' || { echo "WRONG PAGE /process/: its own HTML is not being served"; MISS=$((MISS+1)); }
curl -sL "$BASE/questions/" | grep -qF '<title>Questions: Fit, Scope, Time, Price and Trust | MonoBook</title>' || { echo "WRONG PAGE /questions/: its own HTML is not being served"; MISS=$((MISS+1)); }
curl -sL "$BASE/what-you-get/" | grep -qF '<title>What You Get: Logo, Colour, Typeface, Image Style, Guideline | MonoBook</title>' || { echo "WRONG PAGE /what-you-get/: its own HTML is not being served"; MISS=$((MISS+1)); }
curl -sL "$BASE/work/" | grep -qF '<title>Work: Mayfair Lumber and Gärtnerabo | MonoBook</title>' || { echo "WRONG PAGE /work/: its own HTML is not being served"; MISS=$((MISS+1)); }
# Contact form API must be live. Empty POST should be rejected with 400.
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{}' "$BASE/api/contact/"); [ "$code" = "400" ] || { echo "FORM API missing or broken: POST /api/contact/ returned $code, expected 400"; MISS=$((MISS+1)); }
curl -s "$BASE/api/contact/" | grep -q '"configured":true' || echo "WARNING: form is live but RESEND_API_KEY is not set in Vercel, so briefs will not arrive."
echo "OK: $OK  MISSING: $MISS"; [ $MISS -eq 0 ] && echo "PASS: site is complete" || { echo "FAIL: fix before calling it done"; exit 1; }
