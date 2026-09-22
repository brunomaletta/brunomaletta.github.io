#!/usr/bin/env python3
"""Fetch brunomont Codeforces blogs and write Markdown + mirrored images."""
from __future__ import annotations

import html
import json
import re
import subprocess
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "content" / "writing"
IMG = ROOT / "public" / "writing"
OUT.mkdir(parents=True, exist_ok=True)
IMG.mkdir(parents=True, exist_ok=True)

IDS = [
    156865,
    156658,
    156111,
    154657,
    154593,
    154468,
    154192,
    136724,
    112458,
    111450,
    111380,
    93042,
    83969,
    78931,
]

SLUGS = {
    156865: "tgen-miniblog-5-random-graphs",
    156658: "tgen-miniblog-4-random-trees",
    156111: "tgen-miniblog-3-alias-method",
    154657: "tgen-miniblog-2-fisher-yates",
    154593: "tgen-miniblog-1-uniform-generation",
    154468: "introducing-tgen",
    154192: "chinese-postman-contorno",
    136724: "pattern-indexing-suffix-arrays",
    112458: "tiny-dynamic-convex-hull",
    111450: "time-complexity",
    111380: "variations-of-string-matching",
    93042: "dynamic-suffix-arrays",
    83969: "integer-sets",
    78931: "rmq-linear-construction",
}


def fetch(url: str) -> bytes:
    last = None
    for attempt in range(2):
        try:
            proc = subprocess.run(
                ["curl", "-fsSL", "-A", "Mozilla/5.0", "--max-time", "20", url],
                capture_output=True,
                timeout=25,
            )
            if proc.returncode == 0 and proc.stdout:
                return proc.stdout
            last = RuntimeError(proc.stderr.decode() or f"curl {proc.returncode}")
        except Exception as e:
            last = e
        time.sleep(2 ** attempt)
    raise last


def strip_tags(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    return html.unescape(s).strip()


def rewrite_images(content: str, cf_id: int) -> str:
    urls = []

    def grab(m: re.Match) -> str:
        src = html.unescape(m.group(1))
        urls.append(src)
        return m.group(0)

    re.sub(r'<img[^>]+src="([^"]+)"', grab, content)
    mapping = {}
    for i, src in enumerate(urls, 1):
        if src.startswith("//"):
            abs_url = "https:" + src
        elif src.startswith("/"):
            abs_url = "https://codeforces.com" + src
        else:
            abs_url = src
        ext = Path(src.split("?")[0]).suffix or ".png"
        name = f"{cf_id}-{i}{ext}"
        dest = IMG / name
        if not dest.exists():
            try:
                dest.write_bytes(fetch(abs_url))
                print(f"  image {name}", flush=True)
            except Exception as e:
                print(f"  skip image {abs_url}: {e}")
                continue
        mapping[src] = f"/writing/{name}"
        mapping[html.escape(src)] = f"/writing/{name}"

    for old, new in mapping.items():
        content = content.replace(f'src="{old}"', f'src="{new}"')
        content = content.replace(f"src='{old}'", f"src='{new}'")
    # also rewrite remaining /predownloaded
    content = re.sub(
        r'src="(/predownloaded/[^"]+)"',
        lambda m: f'src="https://codeforces.com{m.group(1)}"',
        content,
    )
    return content


def preprocess(html_src: str) -> str:
    html_src = re.sub(
        r'<div class="spoiler">\s*<b class="spoiler-title">([^<]*)</b>\s*<div class="spoiler-content"[^>]*>',
        r"<details><summary>\1</summary>",
        html_src,
    )
    html_src = html_src.replace("</div></div>", "</details>", 50)
    html_src = re.sub(r'href="/profile/([^"]+)"', r'href="https://codeforces.com/profile/\1"', html_src)
    html_src = re.sub(r'href="/blog/entry/', 'href="https://codeforces.com/blog/entry/', html_src)
    html_src = re.sub(r'href="/problemset/', 'href="https://codeforces.com/problemset/', html_src)
    html_src = html_src.replace("$$$", "$")
    return html_src


def html_to_md(html_src: str) -> str:
    proc = subprocess.run(
        ["pandoc", "-f", "html", "-t", "gfm", "--wrap=none"],
        input=html_src.encode(),
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode())
    md = proc.stdout.decode()
    md = md.replace("\\$", "$")
    return md.strip() + "\n"


def yaml_escape(s: str) -> str:
    return s.replace('"', '\\"')


def first_paragraph(md: str) -> str:
    for line in md.splitlines():
        t = line.strip()
        if t and not t.startswith("#") and not t.startswith("```") and not t.startswith("!"):
            t = re.sub(r"\$[^$]+\$", "", t)
            t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
            t = re.sub(r"[*_`]", "", t)
            return t[:220].rstrip() + ("…" if len(t) > 220 else "")
    return ""


def main() -> None:
    for cf_id in IDS:
        slug = SLUGS[cf_id]
        dest = OUT / f"{slug}.md"
        if dest.exists():
            print("skip existing", slug, flush=True)
            continue
        json_path = Path("/tmp/cfjson") / f"{cf_id}.json"
        if json_path.exists():
            raw = json_path.read_bytes()
        else:
            raw = fetch(f"https://codeforces.com/api/blogEntry.view?blogEntryId={cf_id}")
        data = json.loads(raw)
        if data.get("status") != "OK":
            raise SystemExit(f"API fail {cf_id}: {data}")
        entry = data["result"]
        title = strip_tags(entry["title"])
        created = datetime.fromtimestamp(entry["creationTimeSeconds"], tz=timezone.utc)
        content = html.unescape(entry["content"])
        content = rewrite_images(content, cf_id)
        content = preprocess(content)
        md = html_to_md(content)
        tags = entry.get("tags") or []
        slug = SLUGS[cf_id]
        dest = OUT / f"{slug}.md"
        if dest.exists():
            print("  skip existing", slug)
            continue
        summary = first_paragraph(md)
        front = "\n".join(
            [
                "---",
                f'title: "{yaml_escape(title)}"',
                f"date: {created.date().isoformat()}",
                f"cfId: {cf_id}",
                f'cfUrl: "https://codeforces.com/blog/entry/{cf_id}"',
                "tags:",
                *[f'  - "{yaml_escape(t)}"' for t in tags],
                f'summary: "{yaml_escape(summary)}"',
                "---",
                "",
            ]
        )
        (OUT / f"{slug}.md").write_text(front + md, encoding="utf-8")
        print("  wrote", slug, flush=True)


if __name__ == "__main__":
    main()
