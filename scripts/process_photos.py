"""
Photo pipeline:
  - detect faces (frontal + profile Haar cascades, with multi-scale rotation pass)
  - apply a strong Gaussian blur on each detected face region
  - downscale to a web-friendly max edge
  - strip EXIF and save as JPEG, quality 82
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

MAX_EDGE = 1280
JPEG_QUALITY = 78

CASCADE_DIR = Path(cv2.data.haarcascades)
FRONTAL_ALT = cv2.CascadeClassifier(str(CASCADE_DIR / "haarcascade_frontalface_alt2.xml"))
PROFILE = cv2.CascadeClassifier(str(CASCADE_DIR / "haarcascade_profileface.xml"))


def detect_faces(img_bgr: np.ndarray) -> list[tuple[int, int, int, int]]:
    """Return list of (x, y, w, h) face boxes (deduped). Tight thresholds to avoid false positives on snow/tree patterns."""
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    h, w = gray.shape
    min_size = max(40, min(h, w) // 25)

    boxes: list[tuple[int, int, int, int]] = []

    def run(classifier: cv2.CascadeClassifier, img: np.ndarray, flipped: bool = False):
        rects = classifier.detectMultiScale(
            img,
            scaleFactor=1.1,
            minNeighbors=10,
            minSize=(min_size, min_size),
        )
        for (x, y, fw, fh) in rects:
            if flipped:
                x = img.shape[1] - x - fw
            boxes.append((int(x), int(y), int(fw), int(fh)))

    run(FRONTAL_ALT, gray)
    run(PROFILE, gray)
    run(PROFILE, cv2.flip(gray, 1), flipped=True)
    return dedupe(boxes)


def dedupe(boxes: list[tuple[int, int, int, int]]) -> list[tuple[int, int, int, int]]:
    out: list[tuple[int, int, int, int]] = []
    for b in boxes:
        bx, by, bw, bh = b
        merged = False
        for i, o in enumerate(out):
            ox, oy, ow, oh = o
            ix1, iy1 = max(bx, ox), max(by, oy)
            ix2, iy2 = min(bx + bw, ox + ow), min(by + bh, oy + oh)
            iw, ih = max(0, ix2 - ix1), max(0, iy2 - iy1)
            inter = iw * ih
            if inter == 0:
                continue
            union = bw * bh + ow * oh - inter
            if inter / union > 0.3:
                nx, ny = min(bx, ox), min(by, oy)
                nx2, ny2 = max(bx + bw, ox + ow), max(by + bh, oy + oh)
                out[i] = (nx, ny, nx2 - nx, ny2 - ny)
                merged = True
                break
        if not merged:
            out.append(b)
    return out


def blur_face(img: np.ndarray, x: int, y: int, w: int, h: int) -> None:
    """In-place: blur a tight oval inside the box. Face-only — no body, no halo."""
    H, W = img.shape[:2]
    # Minimal padding — the manual boxes are already sized to the face.
    pad_x = int(w * 0.05)
    pad_y = int(h * 0.05)
    x0 = max(0, x - pad_x)
    y0 = max(0, y - pad_y)
    x1 = min(W, x + w + pad_x)
    y1 = min(H, y + h + pad_y)

    region = img[y0:y1, x0:x1].copy()
    if region.size == 0:
        return

    rh, rw = region.shape[:2]
    # Single moderate Gaussian — enough to wipe features without nuking colours
    k = max(21, (min(rh, rw) // 4) | 1)
    blurred = cv2.GaussianBlur(region, (k, k), 0)

    # Tight ellipse (face shape), softly feathered at the edge
    mask = np.zeros((rh, rw), dtype=np.uint8)
    cv2.ellipse(
        mask,
        (rw // 2, rh // 2),
        (int(rw * 0.42), int(rh * 0.48)),
        0,
        0,
        360,
        255,
        -1,
    )
    feather = max(11, (min(rh, rw) // 10) | 1)
    mask = cv2.GaussianBlur(mask, (feather, feather), 0)
    mask_f = (mask.astype(np.float32) / 255.0)[..., None]

    blended = region.astype(np.float32) * (1 - mask_f) + blurred.astype(np.float32) * mask_f
    img[y0:y1, x0:x1] = blended.astype(np.uint8)


def resize_max_edge(img: np.ndarray, max_edge: int) -> np.ndarray:
    h, w = img.shape[:2]
    long_edge = max(h, w)
    if long_edge <= max_edge:
        return img
    scale = max_edge / long_edge
    return cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)


def process_one(src: Path, dst: Path, manual_boxes: list[tuple[float, float, float, float]] | None = None, auto_detect: bool = False) -> int:
    """Process one image. manual_boxes are normalized (x, y, w, h) in [0,1]."""
    img = cv2.imread(str(src))
    if img is None:
        print(f"!! Could not read {src}")
        return 0

    detected = detect_faces(img) if auto_detect else []

    h, w = img.shape[:2]
    if manual_boxes:
        for (nx, ny, nw, nh) in manual_boxes:
            detected.append((int(nx * w), int(ny * h), int(nw * w), int(nh * h)))

    for (x, y, fw, fh) in detected:
        blur_face(img, x, y, fw, fh)

    img = resize_max_edge(img, MAX_EDGE)

    # JPEG via PIL so we can strip EXIF cleanly
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil = Image.fromarray(rgb)
    pil.save(dst, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return len(detected)


# No auto Haar detection — too unreliable, hits false positives in tree/snow patterns
# and overshoots actual face boundaries. Manual coordinates only.
AUTO_DETECT: set[str] = set()

# Manual face boxes — only for photos with clearly recognizable close-up faces.
# Distant silhouettes (0070, 0081, 0096, group hiking shots) are not blurred:
# the subjects are unidentifiable already. Back-of-head shots are not blurred either.
# Coordinates are normalized to image dimensions: (x, y, w, h) where origin = top-left.
MANUAL: dict[str, list[tuple[float, float, float, float]]] = {
    # Profile portrait in foreground (one student, head + face area)
    "IMG-20260201-WA0046.jpg": [
        (0.21, 0.28, 0.16, 0.13),
    ],
    # Two students at the summit, frontal close-up
    "IMG-20260201-WA0054.jpg": [
        (0.41, 0.30, 0.08, 0.09),
        (0.51, 0.31, 0.07, 0.08),
    ],
    # Acro-yoga in gym — two faces, tight
    "IMG-20260324-WA0001.jpg": [
        (0.475, 0.41, 0.07, 0.11),   # standing person profile
        (0.485, 0.68, 0.075, 0.09),  # person on ground, face up
    ],
    # Volleyball — front boy in profile + back boy looking up
    "IMG-20260324-WA0002.jpg": [
        (0.27, 0.40, 0.10, 0.10),    # front boy, curly hair facing right
        (0.385, 0.40, 0.08, 0.09),   # back boy, head tilted up at ball
    ],
    # Fitness training — three students
    "IMG-20260324-WA0005.jpg": [
        (0.115, 0.155, 0.09, 0.10),  # left girl with glasses
        (0.605, 0.155, 0.08, 0.09),  # center boy
        (0.795, 0.185, 0.07, 0.08),  # right person
    ],
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("src_dir", type=Path)
    parser.add_argument("dst_dir", type=Path)
    args = parser.parse_args()

    args.dst_dir.mkdir(parents=True, exist_ok=True)

    total = 0
    total_faces = 0
    for src in sorted(args.src_dir.glob("*.jpg")):
        dst = args.dst_dir / src.name.lower().replace("img-", "photo-")
        manual = MANUAL.get(src.name)
        auto = src.name in AUTO_DETECT
        n = process_one(src, dst, manual, auto)
        total += 1
        total_faces += n
        print(f"  {src.name:34s} -> {dst.name}  faces blurred: {n}{'  (auto)' if auto else ''}")
    print(f"Done. {total} images, {total_faces} face regions blurred.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
