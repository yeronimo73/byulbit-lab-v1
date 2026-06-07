#!/usr/bin/env python3
"""sitemap.xml 생성 — signs·infographics·research-notes URL 포함."""
import json
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, tostring

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://byulbit-lab-v1.vercel.app"
LASTMOD = "2026-06-07"

STATIC = [
    "/",
    "/index.html",
    "/research.html",
    "/sky.html",
    "/color-atlas.html",
    "/research-note.html",
    "/sign.html",
    "/infographic.html",
    "/tools/mbti.html",
    "/tools/enneagram.html",
    "/tools/planet-quiz.html",
    "/tools/knowledge.html",
    "/tools/full-moon-quiz.html",
    "/tools/equinox-quiz.html",
    "/tools/universe-year-quiz.html",
    "/tools/meteor-quiz.html",
    "/llms.txt",
]


def load_json(rel):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def main():
    urls = list(STATIC)

    signs = load_json("data/signs.json")["signs"]
    for s in signs:
        urls.append(f"/sign.html?id={s['id']}")

    for item in load_json("data/infographics.json")["items"]:
        urls.append(f"/infographic.html?id={item['id']}")

    for note in load_json("data/research-notes/index.json")["notes"]:
        urls.append(f"/research-note.html?id={note['id']}")

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
        elif "sign.html" in path or "infographic" in path or "research-note" in path:
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