/**
 * Responsive banner photos. Each /images/banners/<name>.webp (1920 px) has
 * 640, 1024 and 1280 px copies (scripts/make-image-variants.py), so the
 * browser downloads the one that fits the screen instead of the desktop size.
 */
const BANNER = /^(\/images\/banners\/[^/?#]+)\.webp$/;
const WIDTHS = [640, 1024, 1280];

/** srcset for a banner photo, or undefined for any other image. */
export function bannerSrcSet(src: string | undefined): string | undefined {
  const m = src?.match(BANNER);
  if (!m) return undefined;
  return [...WIDTHS.map((w) => `${m[1]}-${w}.webp ${w}w`), `${src} 1920w`].join(', ');
}

/** `sizes` values for where banners are shown (CSS widths of the image). */
export const SIZES = {
  /** Full-width hero and section banners. */
  fullWidth: '100vw',
  /** Section banner inside the max-w-7xl (80rem) container. */
  container: '(min-width: 1280px) 1280px, 100vw',
  /** Card in a 3-column grid from md up. */
  thirdFromMd: '(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw',
  /** Card in a 2-column grid from md up. */
  halfFromMd: '(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw',
};
