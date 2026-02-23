'use client';

/** 포스터 삽입 모달 - 좌: HTML/CSS 입력, 우: iframe 프리뷰 */
import { useState, useCallback } from 'react';
import PosterPreviewFrame from './PosterPreviewFrame';

interface PosterInsertModalProps {
  html: string;
  css: string;
  onSave: (html: string, css: string) => void;
  onClose: () => void;
  allowScripts?: boolean;
}

export default function PosterInsertModal({
  html: initialHtml,
  css: initialCss,
  onSave,
  onClose,
  allowScripts = false,
}: PosterInsertModalProps) {
  const [tab, setTab] = useState<'html' | 'css'>('html');
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);

  const handleSave = useCallback(() => {
    onSave(html, css);
  }, [html, css, onSave]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-none shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">포스터 코드</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex min-h-0">
          <div className="w-1/2 flex flex-col border-r border-gray-200">
            <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setTab('html')}
                className={`px-3 py-1.5 text-sm ${tab === 'html' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                HTML
              </button>
              <button
                type="button"
                onClick={() => setTab('css')}
                className={`px-3 py-1.5 text-sm ${tab === 'css' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                CSS
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {tab === 'html' ? (
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  placeholder="<div>포스터 내용</div>"
                  className="w-full h-full min-h-[200px] p-3 font-mono text-sm border border-gray-300 rounded-none resize-none focus:outline-none focus:border-gray-900"
                />
              ) : (
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  placeholder="body { margin: 0; }"
                  className="w-full h-full min-h-[200px] p-3 font-mono text-sm border border-gray-300 rounded-none resize-none focus:outline-none focus:border-gray-900"
                />
              )}
            </div>
          </div>
          <div className="w-1/2 flex flex-col bg-gray-50">
            <div className="p-2 border-b border-gray-200 text-xs text-gray-500">프리뷰</div>
            <div className="flex-1 min-h-[200px]">
              <PosterPreviewFrame html={html} css={css} allowScripts={allowScripts} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-none hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-gray-900 text-white rounded-none hover:bg-gray-800"
          >
            삽입
          </button>
        </div>
      </div>
    </div>
  );
}
