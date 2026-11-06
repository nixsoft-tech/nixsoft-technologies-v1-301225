#!/usr/bin/env python3
"""Make smaller copies of the banner photos for responsive images (srcset).

For every public/images/banners/<name>.webp (the 1920 px original) this
writes <name>-640.webp, <name>-1024.webp and <name>-1280.webp next to it.
The site picks the right one per screen (lib/images.ts, bannerSrcSet), so
phones no longer download the 1920 px desktop image.

Run after adding or replacing a banner, then commit the new files:
    python scripts/make-image-variants.py
Needs Pillow with WebP support (pip install pillow).
"""
from pathlib import Path
from PIL import Image

BANNERS = Path(__file__).resolve().parent.parent / 'public' / 'images' / 'banners'
WIDTHS = {640: 62, 1024: 66, 1280: 72}  # width -> WebP quality
VARIANT_SUFFIXES = tuple(f'-{w}.webp' for w in WIDTHS)

for src in sorted(BANNERS.glob('*.webp')):
    if src.name.endswith(VARIANT_SUFFIXES):
        continue
    with Image.open(src) as im:
        im = im.convert('RGB')
        for width, quality in WIDTHS.items():
            if im.width <= width:
                continue
            out = src.with_name(f'{src.stem}-{width}.webp')
            height = round(im.height * width / im.width)
            im.resize((width, height), Image.LANCZOS).save(out, 'WEBP', quality=quality, method=6)
            print(f'{out.name}: {width}x{height}, {out.stat().st_size // 1024} KB')
