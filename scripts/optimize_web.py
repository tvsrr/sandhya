#!/usr/bin/env python3
"""Downscale + convert the in-app art to WebP for a light first load.
Reads the cleaned PNGs in public/, writes .webp beside them, removes the heavy PNG
(except the PWA icons, which stay PNG). Transparency is preserved by WebP.
"""
import os
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")

# filename (relative to public) -> (max_dimension, quality)
JOBS = {
    "diya-lit.png": (420, 90),
    "diya-unlit.png": (420, 90),
    "bowl.png": (620, 90),
    "blade-full.png": (520, 90),
    "temple-full.png": (620, 90),
}
for i in range(1, 11):
    JOBS[f"relics/relic-{i:02d}.png"] = (560, 82)
for s in ["day25", "day50", "day75", "farewell", "threshold"]:
    JOBS[f"scenes/{s}.png"] = (820, 80)

# PWA icons: keep PNG, but shrink the unused 1024 master
KEEP_PNG_RESIZE = {"icon.png": 512}


def main():
    total_before = total_after = 0
    for rel, (maxdim, q) in JOBS.items():
        src = os.path.join(OUT, rel)
        if not os.path.exists(src):
            print("skip (missing)", rel)
            continue
        total_before += os.path.getsize(src)
        img = Image.open(src)
        w, h = img.size
        scale = min(1.0, maxdim / max(w, h))
        if scale < 1.0:
            img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        dst = os.path.splitext(src)[0] + ".webp"
        img.save(dst, "WEBP", quality=q, method=6)
        total_after += os.path.getsize(dst)
        os.remove(src)
        print(f"{rel:28} -> {os.path.basename(dst)}  {os.path.getsize(dst)//1024} KB")

    for rel, size in KEEP_PNG_RESIZE.items():
        src = os.path.join(OUT, rel)
        if os.path.exists(src):
            img = Image.open(src).convert("RGB")
            img.resize((size, size), Image.LANCZOS).save(src, optimize=True)
            print(f"{rel:28} -> resized PNG {size}px")

    print(f"\nin-app art: {total_before//1024} KB -> {total_after//1024} KB")


if __name__ == "__main__":
    main()
