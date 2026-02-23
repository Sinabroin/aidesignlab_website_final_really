'use client';

/** iframe 샌드박스 프리뷰 - JS 기본 금지 */
interface PosterPreviewFrameProps {
  html: string;
  css: string;
  allowScripts?: boolean;
}

export default function PosterPreviewFrame({
  html,
  css,
  allowScripts = false,
}: PosterPreviewFrameProps) {
  const doc = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`;
  const sandbox = allowScripts ? 'allow-same-origin allow-scripts' : 'allow-same-origin';

  return (
    <iframe
      srcDoc={doc}
      sandbox={sandbox}
      title="포스터 프리뷰"
      className="w-full h-full min-h-[200px] border-0 bg-white"
    />
  );
}
