#!/usr/bin/env python3
"""Internal links → clean URLs (matches vercel cleanUrls)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {"naverfc90bfa251dc860a7f6164be081b3970.html"}


def clean_href(href: str) -> str:
    if not href or href.startswith(("http://", "https://", "mailto:", "tel:", "#", "javascript:")):
        return href
    if ".html" not in href:
        return href

    hash_part = ""
    if "#" in href:
        href, hash_part = href.split("#", 1)
        hash_part = "#" + hash_part

    query_part = ""
    if "?" in href:
        href, query_part = href.split("?", 1)
        query_part = "?" + query_part

    href = href.replace("\\", "/")

    if href in ("index.html", "/index.html", "../index.html", "../../index.html"):
        base = "/"
    elif href.startswith("../"):
        rest = href[3:]
        if rest == "index.html":
            base = "/"
        elif rest.endswith(".html"):
            base = "/" + rest[:-5]
        else:
            base = "/" + rest
    elif href.startswith("./"):
        rest = href[2:]
        if rest.endswith(".html"):
            base = "/" + rest[:-5]
        else:
            base = "/" + rest
    elif href.startswith("/"):
        base = href[:-5] if href.endswith(".html") else href
    elif "/" in href:
        if href.endswith(".html"):
            base = "/" + href[:-5]
        else:
            base = "/" + href
    elif href.endswith(".html"):
        # tools/mbti.html or sign.html
        base = "/" + href[:-5]
    else:
        return href + query_part + hash_part

    if base != "/" and base.endswith("/"):
        base = base.rstrip("/")

    return base + query_part + hash_part


def patch_text(text: str) -> str:
    def repl(m):
        return m.group(1) + clean_href(m.group(2)) + m.group(3)

    text = re.sub(r'(href=")([^"]+)(")', repl, text)
    text = re.sub(r"(href=')([^']+)(')", repl, text)
    text = re.sub(r"(href:\s*[`'\"])([^`'\"]+)([`'\"])", repl, text)

    # template literals: `sign.html?id=${...}`
    text = re.sub(
        r"`([^`]*?)\.html(\?[^`]*?)?`",
        lambda m: "`" + clean_href(m.group(1) + ".html" + (m.group(2) or "")) + "`",
        text,
    )
    return text


def walk_json(obj):
    if isinstance(obj, dict):
        return {k: walk_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [walk_json(v) for v in obj]
    if isinstance(obj, str) and ".html" in obj:
        if obj.startswith("http"):
            return obj
        if "href" in str(obj) or obj.endswith(".html") or "?" in obj:
            cleaned = clean_href(obj)
            return cleaned
        # prose references like "sky.html 2026"
        return re.sub(r"([/.\w-]+)\.html", lambda m: clean_href(m.group(1) + ".html"), obj)
    return obj


def main():
    changed = []

    for fp in sorted(ROOT.rglob("*")):
        if not fp.is_file():
            continue
        if fp.name in SKIP or fp.suffix == ".py" and fp.name == "migrate-clean-urls.py":
            continue

        if fp.suffix in {".html", ".js"}:
            text = fp.read_text(encoding="utf-8")
            new = patch_text(text)
            if new != text:
                fp.write_text(new, encoding="utf-8")
                changed.append(str(fp.relative_to(ROOT)))

        elif fp.suffix == ".txt" and fp.name == "llms.txt":
            text = fp.read_text(encoding="utf-8")
            new = patch_text(text)
            new = new.replace("/index.html#signs", "/#signs")
            if new != text:
                fp.write_text(new, encoding="utf-8")
                changed.append("llms.txt")

        elif fp.parent.name == "data" and fp.suffix == ".json":
            data = json.loads(fp.read_text(encoding="utf-8"))
            new_data = walk_json(data)
            if new_data != data:
                fp.write_text(json.dumps(new_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                changed.append(str(fp.relative_to(ROOT)))

    print(f"updated {len(changed)} files")
    for c in changed:
        print(f"  {c}")


if __name__ == "__main__":
    main()