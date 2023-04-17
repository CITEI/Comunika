import removeMd from 'remove-markdown';

/** Removes markdown tokens from text */
export function extractText(markdown: string): string {
  const txt = removeMd(markdown);
  return txt;
}
