/** 해시태그 입력 및 표시 필드 */
'use client';

import { useState } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';

interface HashtagFieldProps {
  hashtags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export default function HashtagField({ hashtags, onAdd, onRemove }: HashtagFieldProps) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !hashtags.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
        해시태그 + 키워드
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="키워드 입력 후 Enter…"
          name="hashtag"
          autoComplete="off"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={addTag}
          className="relative overflow-visible px-6 py-3 bg-[#111] hover:bg-gray-800 text-white font-normal tracking-tight rounded-none transition-colors"
        >
          <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
          <span className="relative z-10">추가</span>
        </button>
      </div>
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-900 rounded-none text-sm font-normal tracking-tight"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                aria-label={`태그 "${tag}" 삭제`}
                className="hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
