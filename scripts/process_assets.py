#!/usr/bin/env python3
"""Clean SANDHYA raw assets (asset_src/) into web-ready files (public/).

- Cutout objects: chroma-key the magenta studio background, keep only the largest
  connected shape (removes generator watermarks), erode the pink fringe, crop to subject.
- Icon: center-crop the portrait art to a square around the sun; emit PWA/favicon sizes.
- Relics / scenes: inset-crop to drop the corner watermark.
"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "asset_src")
OUT = os.path.join(ROOT, "public")

CUTOUTS = ["diya-lit", "diya-unlit", "bowl", "blade-full", "temple-full"]
RELICS = [f"relic-{i:02d}" for i in range(1, 11)]
SCENES = ["day25", "day50", "day75", "farewell", "threshold"]


def magenta_mask(rgb):
    R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    # Background is magenta and its shadows: green sits well below BOTH red and blue.
    # This spares gold/amber (low blue), steel (green ~ red), and black (low saturation).
    mn = np.minimum(R, B)
    return (mn - G > 15) & (R > 45) & (B > 40)


def process_cutout(name):
    img = Image.open(os.path.join(SRC, name + ".png")).convert("RGB")
    rgb = np.asarray(img).astype(np.int16)
    bg = magenta_mask(rgb)
    subject = ~bg
    # tidy: fill small holes, drop specks
    subject = ndimage.binary_closing(subject, iterations=2)
    subject = ndimage.binary_opening(subject, iterations=1)
    # keep only the largest connected component (removes watermark islands)
    lbl, n = ndimage.label(subject)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
        keep = int(np.argmax(sizes)) + 1
        subject = lbl == keep
    # eat the pink fringe ring, then feather
    subject = ndimage.binary_erosion(subject, iterations=2)
    alpha = (subject * 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(1.2))

    # despill: pull magenta cast out of the remaining edge pixels
    out = np.asarray(img).astype(np.int16)
    R, G, B = out[..., 0], out[..., 1], out[..., 2]
    spill = (R > G) & (B > G)
    R2 = np.where(spill, np.minimum(R, ((G + np.maximum(R, B)) // 2) + 12), R)
    B2 = np.where(spill, np.minimum(B, ((G + np.maximum(R, B)) // 2) + 12), B)
    out[..., 0], out[..., 2] = R2, B2
    al = np.asarray(alpha_img)
    rgb_out = out.astype(np.uint8)
    rgb_out[al == 0] = 0  # clear magenta lurking under fully-transparent pixels
    rgba = np.dstack([rgb_out, al])
    res = Image.fromarray(rgba, "RGBA")

    # crop to subject bbox with a little padding
    bbox = res.getbbox()
    if bbox:
        pad = 8
        l, t, r, b = bbox
        l, t = max(0, l - pad), max(0, t - pad)
        r, b = min(res.width, r + pad), min(res.height, b + pad)
        res = res.crop((l, t, r, b))
    res.save(os.path.join(OUT, name + ".png"))
    return res.size


def inset_crop(name, sub="", frac_l=0.05, frac_t=0.05, frac_r=0.05, frac_b=0.05):
    p = os.path.join(SRC, sub, name + ".png") if sub else os.path.join(SRC, name + ".png")
    img = Image.open(p).convert("RGB")
    w, h = img.size
    box = (int(w * frac_l), int(h * frac_t), int(w * (1 - frac_r)), int(h * (1 - frac_b)))
    out_dir = os.path.join(OUT, sub) if sub else OUT
    os.makedirs(out_dir, exist_ok=True)
    img.crop(box).save(os.path.join(out_dir, name + ".png"))


def process_icon():
    img = Image.open(os.path.join(SRC, "icon.png")).convert("RGB")
    w, h = img.size
    side = w
    cy = int(h * 0.52)  # center on the sun
    top = max(0, min(h - side, cy - side // 2))
    sq = img.crop((0, top, w, top + side))
    master = sq.resize((1024, 1024), Image.LANCZOS)
    master.save(os.path.join(OUT, "icon.png"))
    for size, fname in [(180, "apple-touch-icon.png"), (192, "icon-192.png"),
                        (512, "icon-512.png"), (48, "favicon.png")]:
        master.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, fname))


def main():
    for n in CUTOUTS:
        print("cutout ", n, process_cutout(n))
    for n in RELICS:
        inset_crop(n, frac_l=0.05, frac_t=0.045, frac_r=0.05, frac_b=0.055)
        print("relic  ", n, "cropped")
    for n in SCENES:
        # scenes: watermark is bottom-right; trim bottom + a touch of the right
        inset_crop(n, sub="scenes", frac_l=0.0, frac_t=0.0, frac_r=0.02, frac_b=0.08)
        print("scene  ", n, "cropped")
    process_icon()
    print("icon    -> icon.png + apple-touch + 192/512/favicon")


if __name__ == "__main__":
    main()
