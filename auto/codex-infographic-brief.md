# Codex imagegen brief — 별빛연구소 인포그래픽 4장

## Task
Use the **imagegen** skill (built-in `image_gen` tool). Generate **4 infographic hero images** for the static site.

Read:
- `data/infographics.json`
- `data/infographic-details.json`
- `css/infographic-poster.css` (tone reference)

## Output (required)

### Folder layout (do not collapse)
| Folder | Role |
|--------|------|
| `assets/infographics/originals/` | **PNG masters** — id별 `{id}-thumb.png`, `{id}-full.png` |
| `assets/infographics/web/` | **WebP only** — site serves these |
| `exports/byulbit-lab-infographics/` | Finder bundle copy (PNG+WebP) |
| `~/.codex/generated_images/` | Codex cache — **never delete** |

### Web filenames (16:9)
1. `web/full-moon-2026-thumb.webp` + `web/full-moon-2026-full.webp`
2. `web/meteor-showers-thumb.webp` + `web/meteor-showers-full.webp`
3. `web/equinox-thumb.webp` + `web/equinox-full.webp`
4. `web/universe-year-thumb.webp` + `web/universe-year-full.webp`

Copy each new PNG to `originals/` **before** any WebP conversion.

Then update `data/infographics.json`:
```json
"thumb": "assets/infographics/web/{id}-thumb.webp",
"image": "assets/infographics/web/{id}-full.webp"
```

Update `js/site.js` `renderInfographics` to use `<img src="..." alt="">` when thumb exists (fallback to HTML poster).
Update `infographic.html` to show full image when `image` field exists.

## Brand (별빛연구소)
- Dark navy/black background (#0a0a0f), subtle star field
- Gold accent #ffd84d, teal #6ec8c8 — per-item accent from JSON `color`
- **Zodiac + psychology research lab** — NOT fortune telling, NOT generic astronomy blog
- Constellation dots/lines motif, elegant serif + sans feel
- Korean title may appear but **minimal text** — mood/illustration first (avoid long garbled Korean paragraphs in image)

## Per-item creative direction

### full-moon-2026 (accent #ffd84d)
Title mood: 「달빛 일지」— emotional brightness, full moon phases, diary/journal symbolism

### meteor-showers (accent #6ec8c8)
Gemini + Leo meteor showers, twin stars and lion constellation hints, falling light trails

### equinox (accent #9b6ec8)
Balance scale, day/night equal split, Aries + Libra axis, spring/autumn equinox

### universe-year (accent #c47a3a)
Cosmic timeline compressed to one year, humility, human moment at year's last second

## Rules
- Generate **one id at a time**, inspect, save, then next.
- **NEVER delete original PNGs** — not from `originals/`, not from `~/.codex/generated_images`, not from `exports/byulbit-lab-infographics/`. WebP conversion adds files; it does not replace or remove masters.
- WebP is additive only (`web/`). If re-converting, write a new filename suffix (e.g. `-v2.webp`) unless user explicitly asks to overwrite web assets.
- Update `assets/infographics/manifest.json` after any asset change.
- Do not modify unrelated site files.
- Report final paths when done.