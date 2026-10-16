import React from 'react';

interface HeroImageProps {
  /** Path under /public, e.g. "/images/banners/services-hero.webp". */
  src: string;
}

/**
 * Full-bleed photo behind a dark hero section. Place it as the first child of
 * a `relative overflow-hidden` section and give the hero content `relative z-10`.
 * On mobile the text spans the full width, so the tint is even; from md up the
 * gradient keeps the left (text side) dark and lets the photo show on the right.
 */
const HeroImage: React.FC<HeroImageProps> = ({ src }) => (
  <div className="absolute inset-0 z-0" aria-hidden="true">
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
      fetchPriority="high"
      decoding="async"
    />
    <div className="absolute inset-0 bg-slate-950/70 md:bg-transparent md:bg-gradient-to-r md:from-slate-950/90 md:via-slate-950/70 md:to-slate-950/25" />
  </div>
);

export default HeroImage;
