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

const IMG_CSS = 'img{max-width:100%!important;height:auto!important;}';

/**
 * FIT: 콘텐츠를 inline-block으로 측정 → scale + absolute 배치로 가운데 맞춤
 * - display: inline-block → scrollWidth/Height가 콘텐츠 고유 크기 반환
 * - scale 후 absolute position으로 정확한 가운데 배치
 */
const FIT_SCRIPT = `<script>(function(){
var w=document.getElementById('__c');if(!w)return;
w.style.transformOrigin='top left';
function fit(){
  w.style.transform='none';
  w.style.position='absolute';
  w.style.display='inline-block';
  w.style.left='0';w.style.top='0';
  var cw=w.scrollWidth,ch=w.scrollHeight;
  if(cw<10||ch<10)return;
  var vw=window.innerWidth,vh=window.innerHeight;
  if(vw<10||vh<10)return;
  var s=Math.min(vw/cw,vh/ch,2);
  w.style.left=((vw-cw*s)/2)+'px';
  w.style.top=Math.max(0,(vh-ch*s)/2)+'px';
  w.style.transform='scale('+s+')';
}
window.addEventListener('load',function(){setTimeout(fit,150);setTimeout(fit,600);});
var imgs=w.querySelectorAll('img');
imgs.forEach(function(i){if(!i.complete)i.addEventListener('load',fit);});
fit();
})();<\/script>`;

/**
 * RESIZE: load/이미지/클릭 이벤트에서만 높이 측정 → 무한루프 방지
 * - ResizeObserver/MutationObserver 제거 (vh 기반 CSS와 피드백 루프 발생)
 * - 6000px 안전 상한으로 무한 증가 차단
 * - 클릭 시 300ms/1s 후 재측정 (포스터 내 버튼 확장 지원)
 */
const RESIZE_SCRIPT = `<script>(function(){
var el=document.getElementById('__c');if(!el)return;
var last=0;
function send(){
  el.style.display='inline-block';
  var h=el.scrollHeight;
  el.style.display='';
  if(h>6000)h=6000;
  if(Math.abs(h-last)>5){last=h;window.parent.postMessage({type:'iframe-resize',height:h},'*');}
}
window.addEventListener('load',function(){send();setTimeout(send,500);setTimeout(send,2000);});
var imgs=el.querySelectorAll('img');
imgs.forEach(function(i){if(!i.complete)i.addEventListener('load',send);});
el.addEventListener('click',function(){setTimeout(send,300);setTimeout(send,1000);});
send();
})();<\/script>`;

/**
 * @param opts.fit   홈 배너: 컨테이너에 맞게 자동 축소/확대 + 가운데 (allow-scripts 필요)
 * @param opts.resize 상세 페이지: 콘텐츠에 맞게 iframe 높이 동적 조절 (allow-scripts 필요)
 */
export function buildPosterSrcDoc(
  html: string,
  css: string,
  opts?: { resize?: boolean; fit?: boolean }
): string {
  const fit = opts?.fit ?? false;
  const resize = opts?.resize ?? false;

  let styles = IMG_CSS;
  if (fit) {
    styles += 'html,body{margin:0;padding:0;overflow:hidden;height:100%;background:#fff;}body{position:relative;}';
  } else if (resize) {
    styles += 'html,body{margin:0!important;padding:0!important;}';
  } else {
    styles += 'html,body{margin:0;padding:0;}body{display:flex;flex-direction:column;align-items:center;}';
  }
  styles += css;

  const wrapped = `<div id="__c">${html}</div>`;
  const script = fit ? FIT_SCRIPT : resize ? RESIZE_SCRIPT : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>${styles}</style></head><body>${wrapped}${script}</body></html>`;
}
