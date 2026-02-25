'use client';

/** iframe 샌드박스 프리뷰 - JS 기본 금지 */
interface PosterPreviewFrameProps {
  html: string;
  css: string;
  allowScripts?: boolean;
  /** 카드/캐러셀 썸네일 용도 - 마우스 이벤트를 부모로 통과시켜 클릭 동작 */
  clickThrough?: boolean;
}

export default function PosterPreviewFrame({
  html,
  css,
  allowScripts = false,
  clickThrough = false,
}: PosterPreviewFrameProps) {
  const doc = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`;
  const sandbox = allowScripts ? 'allow-same-origin allow-scripts' : 'allow-same-origin';

  return (
    <iframe
      srcDoc={doc}
      sandbox={sandbox}
      loading="lazy"
      title="포스터 프리뷰"
      className="w-full h-full min-h-[200px] border-0 bg-white"
      style={clickThrough ? { pointerEvents: 'none' } : undefined}
    />
  );
}
