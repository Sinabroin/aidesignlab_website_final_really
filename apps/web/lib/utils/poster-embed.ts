/** TipTap 포스터 임베드 HTML에서 원본 HTML/CSS 추출 + srcDoc 빌더 */

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

const IMG_RESPONSIVE = 'img{max-width:100%!important;height:auto!important;}';

const FIT_SCRIPT = `<script>(function(){
var w=document.getElementById('__c');if(!w)return;
w.style.transformOrigin='top left';
function fit(){
  w.style.transform='none';w.style.position='static';
  var cw=w.scrollWidth,ch=w.scrollHeight;
  if(cw<10||ch<10)return;
  var vw=window.innerWidth,vh=window.innerHeight;
  if(vw<10||vh<10)return;
  var s=Math.min(vw/cw,vh/ch,2);
  w.style.position='absolute';
  w.style.left=((vw-cw*s)/2)+'px';
  w.style.top=Math.max(0,(vh-ch*s)/2)+'px';
  w.style.transform='scale('+s+')';
}
window.addEventListener('load',function(){setTimeout(fit,150);setTimeout(fit,600);});
var imgs=w.querySelectorAll('img');
imgs.forEach(function(i){i.addEventListener('load',fit);});
fit();
})();<\/script>`;

const RESIZE_SCRIPT = `<script>(function(){
var el=document.getElementById('__c');if(!el)return;
var last=0;
function send(){
  var h=el.offsetHeight;
  if(Math.abs(h-last)>2){last=h;window.parent.postMessage({type:'iframe-resize',height:h},'*');}
}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(send).observe(el);
if(typeof MutationObserver!=='undefined')new MutationObserver(send).observe(el,{childList:true,subtree:true,attributes:true});
window.addEventListener('load',function(){setTimeout(send,200);setTimeout(send,1000);});
send();
})();<\/script>`;

/**
 * iframe srcDoc 빌더
 * @param opts.fit   - 홈 배너: 컨테이너에 맞게 자동 스케일링 (allow-scripts 필요)
 * @param opts.resize - 상세 페이지: 콘텐츠 높이에 맞게 iframe 동적 리사이즈 (allow-scripts 필요)
 */
export function buildPosterSrcDoc(
  html: string,
  css: string,
  opts?: { resize?: boolean; fit?: boolean }
): string {
  const fit = opts?.fit ?? false;
  const resize = opts?.resize ?? false;

  let styles = IMG_RESPONSIVE;
  if (fit) {
    styles += 'html,body{margin:0;padding:0;overflow:hidden;height:100%;}body{position:relative;}';
  } else if (resize) {
    styles += 'html,body{margin:0;padding:0;}#__c{width:100%;}';
  } else {
    styles += 'html,body{margin:0;padding:0;}body{display:flex;flex-direction:column;align-items:center;}';
  }
  styles += css;

  const wrapped = `<div id="__c">${html}</div>`;
  const script = fit ? FIT_SCRIPT : resize ? RESIZE_SCRIPT : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>${styles}</style></head><body>${wrapped}${script}</body></html>`;
}
