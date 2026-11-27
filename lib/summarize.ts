/**
 * Shorten text to at most `max` characters for a meta description or card.
 * Prefers ending at a sentence, then at a word, and adds "…" only when cut.
 */
export const summarize = (text: string, max = 155): string => {
  const clean = text.replace(/\s+/g, ' ').replace(/\s*\[(?:&hellip;|…|\.\.\.)\]\s*$/, '').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (sentenceEnd >= max * 0.6) return cut.slice(0, sentenceEnd + 1);
  const wordEnd = cut.lastIndexOf(' ');
  return `${cut.slice(0, wordEnd > 0 ? wordEnd : cut.length).replace(/[\s,;:.\-–—]+$/, '')}…`;
};
