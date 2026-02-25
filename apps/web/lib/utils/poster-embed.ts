/** TipTap 포스터 임베드 HTML에서 원본 HTML/CSS 추출 유틸리티 */

export interface PosterEmbedData {
  html: string;
  css: string;
}

export function extractPosterEmbed(content: string | undefined): PosterEmbedData | null {
  if (!content?.includes('data-type="poster-embed"')) return null;
  if (typeof DOMParser === 'undefined') return null;
  try {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const el = doc.querySelector('[data-type="poster-embed"]');
    if (!el) return null;
    const html = el.getAttribute('data-html') ?? '';
    const css = el.getAttribute('data-css') ?? '';
    return (html || css) ? { html, css } : null;
  } catch {
    return null;
  }
}

export function buildPosterSrcDoc(html: string, css: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>html,body{margin:0;padding:0;}${css}</style></head><body>${html}</body></html>`;
}
