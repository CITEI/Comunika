import markdownToTxt from 'markdown-to-txt';

/** Removes markdown tokens from text */
export function extractText(markdown: string): string {
  const txt = markdownToTxt(markdown);
  return txt;
}
