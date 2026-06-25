#!/usr/bin/env python3
"""sitemap.xml 생성 — signs·infographics·research-notes URL 포함."""
import json
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, tostring

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://starlightlab.org"
LASTMOD = "2026-06-15"

# cleanUrls: true — sitemap must list canonical paths (no .html)
STATIC = [
    "/",
    "/research",
    "/sky",
    "/color-atlas",
    "/research-note",
    "/sign",
    "/infographic",
    "/tools/mbti",
    "/tools/enneagram",
    "/tools/planet-quiz",
    "/tools/knowledge",
    "/tools/full-moon-quiz",
    "/tools/equinox-quiz",
    "/tools/universe-year-quiz",
    "/tools/meteor-quiz",
    "/llms.txt",
]


def load_json(rel):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def main():
    urls = list(STATIC)

    signs = load_json("data/signs.json")["signs"]
    for s in signs:
        urls.append(f"/sign?id={s['id']}")

    for item in load_json("data/infographics.json")["items"]:
        urls.append(f"/infographic?id={item['id']}")

    for note in load_json("data/research-notes/index.json")["notes"]:
        urls.append(f"/research-note?id={note['id']}")

    urlset = Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    seen = set()
    for path in urls:
        if path in seen:
            continue
        seen.add(path)
        loc = f"{BASE}{path}" if path != "/" else f"{BASE}/"
        u = SubElement(urlset, "url")
        SubElement(u, "loc").text = loc
        SubElement(u, "lastmod").text = LASTMOD
        if path.startswith("/tools/") or "quiz" in path:
            SubElement(u, "changefreq").text = "monthly"
            SubElement(u, "priority").text = "0.6"
        elif path.startswith("/sign") or path.startswith("/infographic") or path.startswith("/research-note"):
            SubElement(u, "changefreq").text = "weekly"
            SubElement(u, "priority").text = "0.8"
        else:
            SubElement(u, "changefreq").text = "weekly"
            SubElement(u, "priority").text = "0.9"

    xml = b'<?xml version="1.0" encoding="UTF-8"?>\n' + tostring(urlset, encoding="utf-8")
    out = ROOT / "sitemap.xml"
    out.write_bytes(xml)
    print(f"wrote {out} ({len(seen)} urls)")


if __name__ == "__main__":
    main()