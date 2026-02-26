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

  const style: React.CSSProperties = {
    ...(clickThrough ? { pointerEvents: 'none' } : {}),
    display: 'block',
    width: '100%',
    height: '100%',
    minHeight: '300px',
    border: 'none',
    background: 'white',
  };

  return (
    <iframe
      srcDoc={doc}
      sandbox={sandbox}
      loading="lazy"
      title="포스터 프리뷰"
      style={style}
    />
  );
}
