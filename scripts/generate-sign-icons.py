#!/usr/bin/env python3
"""Generate original constellation-style zodiac icons for 별빛연구소.

Not Unicode zodiac glyphs — abstract star maps per sign.
Output: assets/signs/{id}.svg
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SIGNS_JSON = ROOT / "data" / "signs.json"
OUT_DIR = ROOT / "assets" / "signs"

# Each entry: list of (x, y, radius) stars + list of (i, j) line pairs (0-based indices)
CONSTELLATIONS: dict[str, dict] = {
    "aries": {
        "stars": [(24, 8, 2.2), (14, 22, 1.6), (34, 22, 1.6), (24, 32, 1.8), (24, 40, 1.4)],
        "lines": [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4)],
    },
    "taurus": {
        "stars": [(10, 28, 1.5), (20, 20, 1.8), (30, 16, 2.0), (38, 22, 1.6), (32, 34, 1.5), (18, 36, 1.4)],
        "lines": [(0, 1), (1, 2), (2, 3), (2, 4), (1, 5), (4, 5)],
    },
    "gemini": {
        "stars": [(16, 10, 1.8), (16, 22, 1.5), (16, 34, 1.6), (32, 10, 1.8), (32, 22, 1.5), (32, 34, 1.6), (24, 22, 1.2)],
        "lines": [(0, 1), (1, 2), (3, 4), (4, 5), (1, 6), (4, 6)],
    },
    "cancer": {
        "stars": [(8, 24, 1.4), (16, 16, 1.6), (24, 14, 1.8), (32, 18, 1.6), (38, 26, 1.5), (30, 34, 1.4), (18, 32, 1.4)],
        "lines": [(0, 1), (1, 2), (2, 3), (3, 4), (3, 5), (1, 6), (5, 6)],
    },
    "leo": {
        "stars": [(24, 24, 2.6), (24, 10, 1.5), (34, 16, 1.4), (38, 28, 1.4), (30, 38, 1.4), (18, 38, 1.4), (10, 28, 1.4), (14, 16, 1.4)],
        "lines": [(0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (0, 6), (0, 7)],
    },
    "virgo": {
        "stars": [(24, 8, 1.6), (24, 18, 1.4), (24, 28, 1.5), (24, 38, 1.6), (14, 22, 1.3), (34, 30, 1.3), (18, 40, 1.2)],
        "lines": [(0, 1), (1, 2), (2, 3), (1, 4), (2, 5), (3, 6), (5, 6)],
    },
    "libra": {
        "stars": [(10, 28, 1.5), (24, 20, 1.8), (38, 28, 1.5), (24, 32, 1.4), (24, 40, 1.6)],
        "lines": [(0, 1), (1, 2), (1, 3), (3, 4)],
    },
    "scorpio": {
        "stars": [(8, 12, 1.5), (16, 16, 1.6), (24, 20, 1.7), (30, 26, 1.6), (34, 34, 1.5), (36, 40, 1.8)],
        "lines": [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5)],
    },
    "sagittarius": {
        "stars": [(12, 36, 1.6), (18, 30, 1.5), (24, 24, 1.7), (30, 18, 1.5), (36, 10, 1.8), (38, 6, 1.4)],
        "lines": [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5)],
    },
    "capricorn": {
        "stars": [(12, 38, 1.5), (20, 28, 1.5), (28, 20, 1.7), (36, 14, 1.6), (32, 32, 1.4), (22, 36, 1.3)],
        "lines": [(0, 1), (1, 2), (2, 3), (1, 4), (0, 5), (4, 5)],
    },
    "aquarius": {
        "stars": [(14, 10, 1.5), (22, 10, 1.4), (30, 10, 1.5), (18, 22, 1.4), (26, 22, 1.4), (16, 34, 1.5), (24, 38, 1.6), (32, 34, 1.5)],
        "lines": [(0, 1), (1, 2), (0, 3), (2, 4), (3, 5), (4, 7), (5, 6), (6, 7)],
    },
    "pisces": {
        "stars": [(10, 20, 1.6), (18, 14, 1.4), (26, 18, 1.5), (34, 26, 1.6), (34, 34, 1.4), (26, 38, 1.5), (18, 34, 1.4), (10, 28, 1.6)],
        "lines": [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7), (7, 0)],
    },
}


def svg_for_sign(sign_id: str, accent: str) -> str:
    data = CONSTELLATIONS[sign_id]
    stars = data["stars"]
    lines = data["lines"]

    line_paths = []
    for a, b in lines:
        x1, y1, _ = stars[a]
        x2, y2, _ = stars[b]
        line_paths.append(
            f'    <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
            f'stroke="{accent}" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>'
        )

    star_circles = []
    for x, y, r in stars:
        star_circles.append(
            f'    <circle cx="{x}" cy="{y}" r="{r}" fill="#f4f2fa" filter="url(#glow)"/>'
        )
        if r >= 2:
            star_circles.append(
                f'    <circle cx="{x}" cy="{y}" r="{r * 0.35}" fill="{accent}" opacity="0.9"/>'
            )

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-hidden="true">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="48" height="48" rx="10" fill="rgba(14,16,28,0.55)" stroke="{accent}" stroke-width="0.8" opacity="0.95"/>
{chr(10).join(line_paths)}
{chr(10).join(star_circles)}
</svg>
'''


def main() -> None:
    payload = json.loads(SIGNS_JSON.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for sign in payload["signs"]:
        sid = sign["id"]
        accent = sign.get("color", "#ffd84d")
        path = OUT_DIR / f"{sid}.svg"
        path.write_text(svg_for_sign(sid, accent), encoding="utf-8")
        print(f"wrote {path.name}")

    print(f"done: {len(payload['signs'])} icons -> {OUT_DIR}")


if __name__ == "__main__":
    main()