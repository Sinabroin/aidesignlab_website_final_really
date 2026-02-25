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

const CENTERING_CSS = 'html,body{margin:0;padding:0;display:flex;flex-direction:column;align-items:center;}';

const RESIZE_SCRIPT = `<script>
(function(){
  function send(){
    var h=document.documentElement.scrollHeight;
    window.parent.postMessage({type:'iframe-resize',height:h},'*');
  }
  new ResizeObserver(send).observe(document.body);
  new MutationObserver(send).observe(document.body,{childList:true,subtree:true,attributes:true});
  window.addEventListener('load',function(){setTimeout(send,100);setTimeout(send,500);});
  send();
})();
<\/script>`;

export function buildPosterSrcDoc(html: string, css: string, opts?: { resize?: boolean }): string {
  const baseCss = `${CENTERING_CSS}${css}`;
  const script = opts?.resize ? RESIZE_SCRIPT : '';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>${baseCss}</style></head><body>${html}${script}</body></html>`;
}
