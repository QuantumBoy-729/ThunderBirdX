"""Generate the ThunderBirdX branding images from the cut-out mark.

Usage: python make_assets.py <mark.png> <branding_dir>
"""

import base64
import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

mark = Image.open(sys.argv[1]).convert("RGBA")
out = Path(sys.argv[2])

LICENSE_SVG = (
    "<!-- This Source Code Form is subject to the terms of the Mozilla Public\n"
    "   - License, v. 2.0. If a copy of the MPL was not distributed with this\n"
    "   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->\n"
)
NAVY = (11, 16, 38)


def sized(px):
    img = mark.resize((px, px), Image.LANCZOS)
    if px <= 48:
        # Small sizes lose contrast when downscaled; sharpen the color only.
        r, g, b, a = img.split()
        rgb = Image.merge("RGB", (r, g, b)).filter(
            ImageFilter.UnsharpMask(radius=1, percent=80, threshold=0)
        )
        img = Image.merge("RGBA", (*rgb.split(), a))
    return img


def png_bytes(img):
    buf = io.BytesIO()
    img.save(buf, "PNG", optimize=True)
    return buf.getvalue()


# Linux window icons and chrome://branding/content/iconNN.png.
for px in (16, 22, 24, 32, 48, 64, 128, 256):
    sized(px).save(out / f"default{px}.png", optimize=True)

# Windows window icons.
ico_sizes = [16, 24, 32, 48, 64, 128, 256]
for name in ("messengerWindow", "addressbook", "writeMessage", "newmail"):
    base = sized(256)
    base.save(
        out / f"{name}.ico",
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=[sized(s) for s in ico_sizes[:-1]],
    )

# macOS app and disk image icons.
for name in ("thunderbird", "disk"):
    mark.resize((1024, 1024), Image.LANCZOS).save(out / f"{name}.icns", format="ICNS")

# About dialog and account hub logos: SVG wrappers around an embedded PNG so
# every existing chrome://branding/content/*.svg reference keeps working.
for name, px, emb in (("about-logo", 210, 384), ("logo-gradient", 526, 256)):
    data = base64.b64encode(png_bytes(mark.resize((emb, emb), Image.LANCZOS)))
    (out / "content" / f"{name}.svg").write_text(
        LICENSE_SVG
        + f'<svg width="{px}" height="{px}" viewBox="0 0 {px} {px}" '
        'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'
        f'  <image width="{px}" height="{px}" href="data:image/png;base64,{data.decode()}"/>\n'
        "</svg>\n",
        encoding="utf-8",
    )
sized(192).save(out / "content" / "about-logo.png", optimize=True)
mark.resize((384, 384), Image.LANCZOS).save(out / "content" / "about-logo@2x.png", optimize=True)

# Windows Start menu tiles: mark on the navy tile color from the manifest.
for name, px, inner in (("VisualElements_150", 270, 150), ("VisualElements_70", 126, 84)):
    tile = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    m = sized(inner)
    tile.alpha_composite(m, ((px - inner) // 2, (px - inner) // 2 - (px // 12 if px > 200 else 0)))
    tile.save(out / f"{name}.png", optimize=True)


def gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        d.line([(0, y), (w, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    return img


# Installer images (24-bit BMP).
wm = gradient((164, 314), (17, 24, 56), (8, 10, 24)).convert("RGBA")
m = sized(120)
wm.alpha_composite(m, (22, 96))
wm.convert("RGB").save(out / "wizWatermark.bmp")

for name, x in (("wizHeader", 150 - 54), ("wizHeaderRTL", 3)):
    hd = Image.new("RGBA", (150, 57), (255, 255, 255, 255))
    hd.alpha_composite(sized(51), (x, 3))
    hd.convert("RGB").save(out / f"{name}.bmp")

print("done")
