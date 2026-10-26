#!/usr/bin/env python3
"""Build index.html for Singapore Walkabout.

base/taipei-index.html   the original Taipei Walkabout game (Google Maps key removed)
layer/*.js               the Singapore layer, injected INSIDE the game's closure
                         (the game is one big function, so an external script cannot see its data)
index.html               the result; this is what GitHub Pages serves

Run:  python3 build.py
Every text patch must match exactly once, so the build fails loudly if the base changes.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
src = (ROOT / "base" / "taipei-index.html").read_text(encoding="utf-8")

# (old, new): visible text that lives outside the game closure or in the start block
PATCHES = [
    ("<title>Taipei Walkabout</title>", "<title>Singapore Walkabout</title>"),
    ('id="wLn">BL</div>', 'id="wLn">NE</div>'),
    ('<b id="wCn">西门町</b><span id="wEn">Ximending</span>', '<b id="wCn">牛车水</b><span id="wEn">Chinatown</span>'),
    ('<div class="kick">TAIPEI WALKABOUT · 第一天 DAY 1</div><h1>台北漫步</h1>',
     '<div class="kick">SINGAPORE WALKABOUT · 第一天 DAY 1</div><h1>狮城漫步</h1>'),
    ("You've just arrived in Taipei and you're staying at a small hostel in Ximending.",
     "You've just arrived in Singapore and you're staying at a small hostel in Chinatown."),
    ("Walk the real streets, go into real shops and restaurants, make friends and discover how Taiwan lives.",
     "Walk the real streets, go into real kopitiams, temples and hawker centres, make friends and discover how Singapore lives."),
    ("Traditional characters (as in Taiwan)", "Traditional characters (as used in Taiwan and Hong Kong)"),
    ('<button class="btn" id="startBtn">Wake up in Taipei</button>', '<button class="btn" id="startBtn">Wake up in Singapore</button>'),
    ('$("#startBtn").textContent="Wake up in Taipei"', '$("#startBtn").textContent="Wake up in Singapore"'),
    ('$("#startBtn").textContent="Loading Taipei…"', '$("#startBtn").textContent="Loading Singapore…"'),
    ("&language=zh-TW&region=TW&", "&language=zh-CN&region=SG&"),
    # opening film title (the live copy uses plain quotes; an escaped copy inside PYMAP is only a dictionary key)
    ('<div class="cseal">台<br>湾</div>\n    <h1>${[..."台北漫步"].map(',
     '<div class="cseal">狮<br>城</div>\n    <h1>${[..."狮城漫步"].map('),
    ('<div class="csub">TAIPEI&nbsp;WALKABOUT</div>', '<div class="csub">SINGAPORE&nbsp;WALKABOUT</div>'),
    ('<div class="cgate"><div class="clant"></div><b>台北漫步</b>', '<div class="cgate"><div class="clant"></div><b>狮城漫步</b>'),
    # TEMPORARY: skip the opening film unless the address has ?intro (its pictures are Taipei's and are removed
    # until Singapore art exists). Without this the film is only characters on black.
    ('if(new URLSearchParams(location.search).has("nointro"))return;',
     'if(!new URLSearchParams(location.search).has("intro"))return;'),
    # own save slot, so it never mixes with a Taipei Walkabout save
    ('const KEY="tpe-life-v1";', 'const KEY="sgw-life-v1";'),
    # TEMPORARY: pictures, music and voice recordings are loaded from the original Taipei Walkabout site
    # (every asset path in the game is relative). Remove this line once the repo holds its own art/ voice/ music/.
    ('<head><script id="safeerr">',
     '<head><base href="https://cedricboi.github.io/taipei-walkabout/"><script id="safeerr">'),
]

for old, new in PATCHES:
    n = src.count(old)
    if n != 1:
        sys.exit(f"PATCH FAILED ({n} matches, expected 1): {old[:70]!r}")
    src = src.replace(old, new)

# the Google Maps key must never be in the repo
if re.search(r"AIza[0-9A-Za-z_\-]{20,}", src):
    sys.exit("An API key is present in the base file. Remove it first.")

MARK = "/* ================= START ================= */"
if src.count(MARK) != 1:
    sys.exit("START marker not found exactly once")

parts = []
for f in sorted((ROOT / "layer").glob("*.js")):
    parts.append(f"/* ----- layer/{f.name} ----- */\n" + f.read_text(encoding="utf-8"))
layer = "\n".join(parts)
src = src.replace(MARK, "/* ================= SINGAPORE LAYER ================= */\n" + layer + "\n" + MARK)

(ROOT / "index.html").write_text(src, encoding="utf-8")
print(f"index.html written: {len(src):,} chars, {len(parts)} layer file(s), {len(PATCHES)} text patches")
