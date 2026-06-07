# Codex / imagegen brief — 별빛연구소 12별자리 히어로

## Task
Generate **12 zodiac hero illustrations** for `sign.html` detail pages.

Read: `data/signs.json`, `auto/codex-infographic-brief.md` (brand tone)

## Output layout
| Folder | Role |
|--------|------|
| `assets/signs/originals/` | PNG masters `{id}-hero.png` |
| `assets/signs/web/` | WebP served on site `{id}-hero.webp`, `{id}-thumb.webp` |
| `exports/byulbit-lab-signs/` | Finder bundle (PNG+WebP) |

Thumb = resize from hero (640×360), not separate generation.

## JSON fields (per sign in `data/signs.json`)
```json
"image": "assets/signs/web/{id}-hero.webp",
"thumb": "assets/signs/web/{id}-thumb.webp"
```

## Brand
- Dark navy #0a0a0f, gold constellation lines #ffd84d
- Per-sign accent from `signs.json` `color`
- Psychology research lab — NOT fortune telling, NOT cartoon emoji zodiac
- Constellation dot-line motif, cinematic 16:9, minimal/no text

## Per-sign direction
| id | accent | mood |
|----|--------|------|
| aries | #e85d4a | ram horns, first spark, spring fire |
| taurus | #6ec894 | bull among flowers, earth stability |
| gemini | #6ec8c8 | twin silhouettes, mirrored dialogue |
| cancer | #9bafd4 | crab shell, moonlit inner sea |
| leo | #ffd84d | lion mane solar corona |
| virgo | #b8c89a | wheat sheaf, olive order |
| libra | #d4a8c8 | scales among stars |
| scorpio | #9b4a6c | scorpion curve, deep transformation |
| sagittarius | #c47a3a | arrow to milky way |
| capricorn | #7a8a9a | sea-goat on mountain |
| aquarius | #5ab8d4 | water bearer pouring starlight |
| pisces | #8a9bd4 | two fish silver cord, dream sea |

## Rules
- **NEVER delete original PNG**
- WebP additive only in `web/`
- Update `assets/signs/manifest.json` after assets land
- Wire `sign.html` hero `<img>`, optional `site.js` card thumb