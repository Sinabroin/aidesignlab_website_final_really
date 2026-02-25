/** 게시글 내용 편집/미리보기 필드 */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="min-h-[240px] border border-gray-300 flex items-center justify-center text-gray-400">에디터 로딩 중\u2026</div>,
});

interface ContentFieldProps {
  content: string;
  onChange: (value: string) => void;
}

export default function ContentField({ content, onChange }: ContentFieldProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const isEmpty = !content || (content.replace(/<[^>]*>/g, '').trim() === '' && !content.includes('data-type='));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-normal tracking-tight text-gray-700">
          내용 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1 border border-gray-300 rounded-none overflow-hidden">
          <ModeButton label="편집" active={mode === 'edit'} onClick={() => setMode('edit')} />
          <ModeButton label="미리 보기" active={mode === 'preview'} onClick={() => setMode('preview')} />
        </div>
      </div>
      {mode === 'edit' ? (
        <RichTextEditor content={content} onChange={onChange} placeholder="게시글 내용을 입력하세요\u2026" editable minHeight="240px" />
      ) : (
        <div className="border border-gray-300 rounded-none overflow-hidden bg-white">
          {isEmpty ? (
            <div className="p-8 text-center text-gray-400 min-h-[240px] flex items-center justify-center">내용이 없습니다.</div>
          ) : (
            <RichTextEditor content={content} placeholder="" editable={false} minHeight="240px" />
          )}
        </div>
      )}
    </div>
  );
}

function ModeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-normal transition-colors ${
        active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
