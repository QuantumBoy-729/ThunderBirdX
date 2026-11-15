"""Cut the ThunderBirdX bird-and-ring mark out of the dark logo artwork.

Usage: python cutout.py <logo.jpg> <out_dir>
Writes mark.png (RGBA, square, transparent background) and preview images.
"""

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
# Only the upper part holds the mark; the wordmark starts around y=640.
im = im[:640]
h, w, _ = im.shape
bg = np.median(np.concatenate([im[:30, :30], im[:30, -30:]]).reshape(-1, 3), 0)

# Alpha from how much brighter than the background each pixel is.
diff = np.clip(im - bg, 0, None)
lum = diff.max(axis=2)
alpha = np.clip((lum - 40) / (170 - 40), 0, 1)

# Keep only large connected regions (the ring and the bird); this drops the
# lightning bolts and faint sparks. Labels on a downscaled solid mask.
solid = lum > 60


def shift_or(m, it, op):
    for _ in range(it):
        g = m.copy()
        for a, b in ((slice(1, None), slice(None, -1)), (slice(None, -1), slice(1, None))):
            if op == "or":
                g[a] |= m[b]
                g[:, a] |= m[:, b]
            else:
                g[a] &= m[b]
                g[:, a] &= m[:, b]
        m = g
    return m


# Opening removes thin lines (the lightning) before labelling.
solid = shift_or(shift_or(solid, 5, "and"), 5, "or")
labels = np.zeros((h, w), np.int32)
sizes = {}
cur = 0
for y0 in range(h):
    for x0 in np.nonzero(solid[y0] & (labels[y0] == 0))[0]:
        cur += 1
        q = deque([(y0, x0)])
        labels[y0, x0] = cur
        n = 0
        while q:
            y, x = q.popleft()
            n += 1
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not labels[ny, nx]:
                        labels[ny, nx] = cur
                        q.append((ny, nx))
        sizes[cur] = n

big = sorted(sizes.items(), key=lambda kv: -kv[1])
print("largest regions:", big[:8])
keep_ids = [k for k, n in big if n >= 1500]
keep = np.isin(labels, keep_ids)

# Grow the kept area a little so the soft glow edge around it survives.
grown = keep.copy()
for _ in range(6):
    g = grown.copy()
    g[1:] |= grown[:-1]
    g[:-1] |= grown[1:]
    g[:, 1:] |= grown[:, :-1]
    g[:, :-1] |= grown[:, 1:]
    grown = g
alpha = alpha * grown
# The left lightning bolt touches the ring's glow; clear the band left of the
# ring (the tail, further down, reaches x=358 and is kept).
alpha[200:530, :372] = 0

# Un-premultiply against the background so edges are not muddy.
a = np.maximum(alpha, 1e-3)[..., None]
color = np.clip((im - bg * (1 - a)) / a, 0, 255)
color = np.where(alpha[..., None] > 0, color, 0)

ys, xs = np.nonzero(alpha > 0.04)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
print("mark bbox", x0, x1, y0, y1)
rgba = np.dstack([color, alpha * 255]).astype(np.uint8)[y0 : y1 + 1, x0 : x1 + 1]

# Center on a square canvas with a small margin.
mh, mw = rgba.shape[:2]
side = int(max(mh, mw) * 1.04)
canvas = np.zeros((side, side, 4), np.uint8)
oy, ox = (side - mh) // 2, (side - mw) // 2
canvas[oy : oy + mh, ox : ox + mw] = rgba
mark = Image.fromarray(canvas, "RGBA")
mark.save(out / "mark.png")
print("mark size", mark.size)

# Previews on light and dark backgrounds at several sizes.
sizes_px = [256, 128, 64, 48, 32, 24, 16]
for name, bgc in (("light", (240, 240, 244)), ("dark", (30, 31, 36))):
    sheet = Image.new("RGB", (sum(sizes_px) + 20 * len(sizes_px) + 20, 296), bgc)
    x = 20
    for s in sizes_px:
        sheet.paste(mark.resize((s, s), Image.LANCZOS), (x, 20), mark.resize((s, s), Image.LANCZOS))
        x += s + 20
    sheet.save(out / f"preview-{name}.png")
