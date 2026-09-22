#!/usr/bin/env python3
"""Re-convert saved Codeforces blog JSON into Markdown with intact code and math."""
from __future__ import annotations

import html
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "content" / "writing"
IMG = ROOT / "public" / "writing"
JSON_DIR = Path("/tmp/cfjson")

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

TGEN_IDS = {154468, 154593, 154657, 156111, 156658, 156865}
TGEN_LOGO = "7282f22a0748c711b1964af0315893578b0d32d5"
DIAGRAM_HINTS = ("156658-2", "156658-3", "156865-2")


def yaml_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def strip_tags(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def clean_tex(tex: str) -> str:
    tex = html.unescape(tex).strip()
    # Nested CF math inside \\text{...$$$...$$$} belongs in math mode.
    tex = re.sub(r"\$\$\$(.*?)\$\$\$", r" $\1$ ", tex)
    return tex.strip()


def extract_blocks(html_src: str) -> tuple[str, list[str], list[tuple[str, str]]]:
    codes: list[str] = []
    maths: list[tuple[str, str]] = []

    def take_code(m: re.Match) -> str:
        raw = html.unescape(m.group(1))
        raw = raw.replace("\xa0", " ")
        codes.append(raw.strip("\n"))
        return f"<p>@@CODE_{len(codes) - 1}@@</p>"

    html_src = re.sub(
        r"<pre><code>([\s\S]*?)</code></pre>",
        take_code,
        html_src,
        flags=re.I,
    )
    html_src = re.sub(
        r"<pre>([\s\S]*?)</pre>",
        take_code,
        html_src,
        flags=re.I,
    )

    def take_display(m: re.Match) -> str:
        maths.append(("d", clean_tex(m.group(1))))
        return f"<p>@@MATH_{len(maths) - 1}@@</p>"

    def take_inline(m: re.Match) -> str:
        maths.append(("i", clean_tex(m.group(1))))
        return f"@@MATH_{len(maths) - 1}@@"

    html_src = re.sub(
        r"<center[^>]*>\s*\$\$\$([\s\S]*?)\$\$\$\s*</center>",
        take_display,
        html_src,
        flags=re.I,
    )
    html_src = re.sub(
        r"<div[^>]*>\s*\$\$\$([\s\S]*?)\$\$\$\s*</div>",
        take_display,
        html_src,
        flags=re.I,
    )
    html_src = re.sub(r"<p>\s*\$\$\$([\s\S]*?)\$\$\$\s*</p>", take_display, html_src)
    html_src = re.sub(r"\$\$\$([\s\S]*?)\$\$\$", take_inline, html_src)
    return html_src, codes, maths


def rewrite_images(html_src: str, cf_id: int) -> str:
    n = 0

    def repl(m: re.Match) -> str:
        nonlocal n
        src = html.unescape(m.group(2))
        if TGEN_LOGO in src or (cf_id in TGEN_IDS and n == 0 and "predownloaded" in src):
            n += 1
            return '<img class="tgen-logo" src="/writing/tgen-logo-white.svg" alt="tgen" />'
        n += 1
        matches = list(IMG.glob(f"{cf_id}-{n}.*"))
        if not matches:
            matches = list(IMG.glob(f"{cf_id}-{n}.*"))
        path = f"/writing/{matches[0].name}" if matches else src
        if path.startswith("/") and not path.startswith("/writing/") and not path.startswith("http"):
            path = "https://codeforces.com" + path
        cls = ' class="diagram"' if any(h in path for h in DIAGRAM_HINTS) else ""
        return f'<img{cls} src="{path}" alt="" />'

    return re.sub(r'<img([^>]*?)src="([^"]+)"([^>]*)>', repl, html_src)


def preprocess(html_src: str) -> str:
    html_src = re.sub(
        r'<div class="spoiler">\s*<b class="spoiler-title">([^<]*)</b>\s*<div class="spoiler-content"[^>]*>',
        r"<details><summary>\1</summary>",
        html_src,
    )
    # close spoiler wrappers; CF uses </div></div>
    html_src = html_src.replace("</div></div>", "</details>")
    html_src = re.sub(r'href="/profile/([^"]+)"', r'href="https://codeforces.com/profile/\1"', html_src)
    html_src = re.sub(r'href="/blog/entry/', 'href="https://codeforces.com/blog/entry/', html_src)
    html_src = re.sub(r'href="/problemset/', 'href="https://codeforces.com/problemset/', html_src)
    html_src = re.sub(r'href="/edu/', 'href="https://codeforces.com/edu/', html_src)
    html_src = re.sub(
        r'<a href="(https://github.com/brunomaletta/tgen)"[^>]*>',
        r'<a class="tgen-cta" href="\1">',
        html_src,
    )
    html_src = re.sub(
        r"<blockquote>\s*(?:<p>)?@@CODE_(\d+)@@(?:</p>)?\s*(<blockquote>[\s\S]*?</blockquote>)?\s*</blockquote>",
        lambda m: f"<p>@@CODE_{m.group(1)}@@</p>\n" + (m.group(2) or ""),
        html_src,
        flags=re.I,
    )
    html_src = re.sub(r"<center[^>]*>", "<p class=\"figure\">", html_src)
    html_src = html_src.replace("</center>", "</p>")
    html_src = re.sub(r"</?div[^>]*>", "", html_src)
    html_src = re.sub(
        r'<a href="(https://codeforces.com/profile/[^"]+)"[^>]*>([\s\S]*?)</a>',
        lambda m: f'<a href="{m.group(1)}">{strip_tags(m.group(2))}</a>',
        html_src,
    )
    return html_src


def html_to_md(html_src: str) -> str:
    proc = subprocess.run(
        ["pandoc", "-f", "html", "-t", "gfm", "--wrap=none"],
        input=html_src.encode(),
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode() or "pandoc failed")
    return proc.stdout.decode()


def restore(md: str, codes: list[str], maths: list[tuple[str, str]]) -> str:
    for i in range(len(maths) - 1, -1, -1):
        kind, tex = maths[i]
        token = f"@@MATH_{i}@@"
        wrapped = f"$$\n{tex}\n$$" if kind == "d" else f"${tex}$"
        md = md.replace(f"`{token}`", wrapped)
        md = md.replace(token, wrapped)
    for i in range(len(codes) - 1, -1, -1):
        token = f"@@CODE_{i}@@"
        fence = f"\n```cpp\n{codes[i]}\n```\n"
        md = md.replace(f"`{token}`", fence)
        md = md.replace(token, fence)
    md = re.sub(r"\n{3,}", "\n\n", md)
    md = re.sub(r"\$\$\$([^$\n]+)\$\$\$", r"$\1$", md)
    md = re.sub(
        r'<img src="/writing/tgen-logo-white.svg"[^>]*>',
        '<p class="figure"><img class="tgen-logo" src="/writing/tgen-logo-white.svg" alt="tgen" /></p>',
        md,
    )
    md = md.replace(
        "![](/writing/tgen-logo-white.svg)",
        '<p class="figure"><img class="tgen-logo" src="/writing/tgen-logo-white.svg" alt="tgen" /></p>',
    )
    md = re.sub(
        r'<img src="(/writing/[^"]+)" class="diagram"[^>]*>',
        r'<p class="figure"><img class="diagram" src="\1" alt="" /></p>',
        md,
    )
    md = re.sub(
        r"!\[([^\]]*)\]\((/writing/[^)]+)\)",
        lambda m: (
            f'<p class="figure"><img class="diagram" src="{m.group(2)}" alt="{m.group(1)}" /></p>'
            if any(h in m.group(2) for h in DIAGRAM_HINTS)
            else f'<p class="figure"><img src="{m.group(2)}" alt="{m.group(1)}" /></p>'
        ),
        md,
    )
    # HTML blocks swallow the next markdown line unless a blank line follows.
    md = re.sub(r"(<p class=\"figure\">.*?</p>)[ \t]*\n", r"\1\n\n", md)
    return md.strip() + "\n"


def first_paragraph(md: str) -> str:
    for line in md.splitlines():
        t = line.strip()
        if not t or t.startswith("#") or t.startswith("```") or t.startswith("!") or t.startswith("<"):
            continue
        t = re.sub(r"\$[^$]+\$", "", t)
        t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
        t = re.sub(r"[*_`]", "", t)
        t = re.sub(r"<[^>]+>", "", t).strip()
        if t:
            return t[:220].rstrip() + ("…" if len(t) > 220 else "")
    return ""


def convert_entry(cf_id: int, entry: dict) -> str:
    title = strip_tags(entry["title"])
    created = datetime.fromtimestamp(entry["creationTimeSeconds"], tz=timezone.utc)
    content = html.unescape(entry["content"])
    content, codes, maths = extract_blocks(content)
    content = rewrite_images(content, cf_id)
    content = preprocess(content)
    md = html_to_md(content)
    md = restore(md, codes, maths)
    tags = entry.get("tags") or []
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
    return front + md


def main() -> None:
    for cf_id, slug in SLUGS.items():
        path = JSON_DIR / f"{cf_id}.json"
        if not path.exists():
            print("missing json", cf_id)
            continue
        data = json.loads(path.read_text())
        if data.get("status") != "OK":
            raise SystemExit(f"API fail {cf_id}: {data}")
        text = convert_entry(cf_id, data["result"])
        dest = OUT / f"{slug}.md"
        dest.write_text(text, encoding="utf-8")
        print("wrote", slug)


if __name__ == "__main__":
    main()
