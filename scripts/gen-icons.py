"""
Generate favicon.ico + apple-touch-icon.png + favicon-32.png + favicon-16.png
from the project's logo (same geometry as public/favicon.svg).

Run: python scripts/gen-icons.py
"""

from pathlib import Path
from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parents[1] / "public"
PUBLIC.mkdir(exist_ok=True)

BG = (245, 241, 232, 255)       # #F5F1E8
INK = (26, 23, 20, 255)         # #1A1714
BRASS = (168, 125, 67, 255)     # #A87D43

CANVAS = 1024


def draw_logo(size: int) -> Image.Image:
    """Render the Sintem mark at the given output size, using a 1024 internal canvas."""
    img = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # rounded background — radius ~ 170 in 1024 grid (matches rx=20 in viewBox=120)
    bg_radius = round(CANVAS * 20 / 120)
    d.rounded_rectangle((0, 0, CANVAS - 1, CANVAS - 1), radius=bg_radius, fill=BG)

    def s(v: float) -> int:
        """Scale viewBox-120 coordinate to 1024 canvas."""
        return round(v * CANVAS / 120)

    # outer U — arc of a circle that visually matches the quadratic Bezier in the SVG
    # SVG: M 22 32 Q 22 92 60 92 Q 98 92 98 32  (lower half of a circle centred at 60, ~32 radius)
    outer_cx, outer_cy, outer_r, outer_w = s(60), s(35), s(58), s(9)
    d.arc(
        (outer_cx - outer_r, outer_cy - outer_r, outer_cx + outer_r, outer_cy + outer_r),
        start=0, end=180, fill=INK, width=outer_w,
    )

    # inner U — narrower lower half-circle (smaller, brass colour)
    inner_cx, inner_cy, inner_r, inner_w = s(60), s(40), s(38), s(6)
    d.arc(
        (inner_cx - inner_r, inner_cy - inner_r, inner_cx + inner_r, inner_cy + inner_r),
        start=0, end=180, fill=BRASS, width=inner_w,
    )

    # central brass dot
    dot_cx, dot_cy, dot_r = s(60), s(56), s(5)
    d.ellipse((dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r), fill=BRASS)

    if size != CANVAS:
        img = img.resize((size, size), Image.LANCZOS)
    return img


def main() -> None:
    sizes = {
        "apple-touch-icon.png": 180,
        "favicon-32.png": 32,
        "favicon-16.png": 16,
        "favicon-192.png": 192,
        "favicon-512.png": 512,
    }
    for name, sz in sizes.items():
        img = draw_logo(sz)
        out = PUBLIC / name
        img.save(out, "PNG")
        print(f"  wrote {out.relative_to(PUBLIC.parent)} ({sz}x{sz})")

    # multi-size ICO from 16/32/48
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    base = draw_logo(48)
    base.save(PUBLIC / "favicon.ico", format="ICO", sizes=ico_sizes)
    print(f"  wrote public/favicon.ico ({', '.join(f'{w}x{h}' for w, h in ico_sizes)})")


if __name__ == "__main__":
    main()
