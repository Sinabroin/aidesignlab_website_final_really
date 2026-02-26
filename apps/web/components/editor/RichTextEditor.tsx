/** Tiptap 기반 Rich Text 에디터 - 이미지/영상/서식/소스 토글 통합 */
'use client';

import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { PosterEmbed } from './PosterEmbed';
import { VideoEmbed } from './VideoEmbed';
import EditorToolbar from './EditorToolbar';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  showSourceToggle?: boolean;
  /** 부모 높이를 꽉 채우는 모드 (읽기 전용 모달 전용) */
  fillHeight?: boolean;
}

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = '게시글 내용을 입력하세요',
  editable = true,
  minHeight = '200px',
  showSourceToggle = false,
  fillHeight = false,
}: RichTextEditorProps) {
  const [showSource, setShowSource] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder }),
      PosterEmbed,
      VideoEmbed,
    ],
    content: content || '<p></p>',
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      if (!showSource) onChange?.(e.getHTML());
    },
  });

  const handleSourceToggle = useCallback(() => {
    if (!editor) return;

    if (showSource) {
      editor.commands.setContent(htmlSource);
      onChange?.(htmlSource);
    } else {
      setHtmlSource(editor.getHTML());
    }
    setShowSource((p) => !p);
  }, [editor, showSource, htmlSource, onChange]);

  const handleSourceChange = useCallback(
    (value: string) => {
      setHtmlSource(value);
      onChange?.(value);
    },
    [onChange]
  );

  const outerClass = fillHeight
    ? 'border border-gray-300 rounded-none overflow-hidden bg-white flex flex-col h-full fill-height-editor'
    : 'border border-gray-300 rounded-none overflow-hidden bg-white flex flex-col';

  const innerStyle: React.CSSProperties = fillHeight
    ? { flex: 1, minHeight: 0 }
    : { minHeight: editable ? minHeight : '400px' };

  return (
    <div className={outerClass}>
      {editable && (
        <EditorToolbar
          editor={editor}
          showSource={showSource}
          onSourceToggle={handleSourceToggle}
          showSourceButton={showSourceToggle}
        />
      )}
      {showSource ? (
        <SourceView
          value={htmlSource}
          onChange={handleSourceChange}
          minHeight={minHeight}
        />
      ) : (
        <div className="p-4 text-base md:text-lg flex flex-col" style={innerStyle}>
          <EditorContent editor={editor} className={fillHeight ? 'flex-1' : ''} />
        </div>
      )}
    </div>
  );
}

function SourceView({
  value,
  onChange,
  minHeight,
}: {
  value: string;
  onChange: (v: string) => void;
  minHeight: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 font-mono text-sm bg-gray-50 focus-visible:outline-none resize-y"
      style={{ minHeight }}
      spellCheck={false}
      placeholder="HTML 소스를 직접 편집할 수 있습니다…"
    />
  );
}
