/** Tiptap 기반 Rich Text 에디터 - 이미지/영상/서식/소스 토글 통합 */
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { PosterEmbed } from './PosterEmbed';
import { VideoEmbed } from './VideoEmbed';
import EditorToolbar from './EditorToolbar';
import { uploadToBlob } from '@/lib/utils/upload';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  showSourceToggle?: boolean;
  /** 부모 높이를 꽉 채우는 모드 (읽기 전용 모달 전용) */
  fillHeight?: boolean;
  /** 이미지 업로드 시작/종료 알림 (부모 isUploading 관리용) */
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = '게시글 내용을 입력하세요',
  editable = true,
  minHeight = '200px',
  showSourceToggle = false,
  fillHeight = false,
  onUploadStart,
  onUploadEnd,
}: RichTextEditorProps) {
  const [showSource, setShowSource] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');

  /* 콜백 ref — stale closure 방지 */
  const onUploadStartRef = useRef(onUploadStart);
  const onUploadEndRef = useRef(onUploadEnd);
  useEffect(() => { onUploadStartRef.current = onUploadStart; }, [onUploadStart]);
  useEffect(() => { onUploadEndRef.current = onUploadEnd; }, [onUploadEnd]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      /* allowBase64: false — base64 데이터 URI 금지, Blob URL만 허용 */
      Image.configure({ allowBase64: false }),
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
    /* 이미지 드래그 앤 드롭 / 붙여넣기 → Blob 업로드 후 URL 삽입 */
    editorProps: editable ? {
      handleDrop: (view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file?.type.startsWith('image/')) return false;

        event.preventDefault();
        onUploadStartRef.current?.();

        uploadToBlob(file, 'editor-images')
          .then((url) => {
            const { schema } = view.state;
            const node = schema.nodes.image?.create({ src: url });
            if (!node) return;
            const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
            const pos = coords?.pos ?? view.state.selection.anchor;
            view.dispatch(view.state.tr.insert(pos, node));
          })
          .catch(() => alert('이미지 업로드에 실패했습니다.'))
          .finally(() => onUploadEndRef.current?.());

        return true;
      },
      handlePaste: (view, event) => {
        const file = event.clipboardData?.files?.[0];
        if (!file?.type.startsWith('image/')) return false;

        event.preventDefault();
        onUploadStartRef.current?.();

        uploadToBlob(file, 'editor-images')
          .then((url) => {
            const { schema } = view.state;
            const node = schema.nodes.image?.create({ src: url });
            if (!node) return;
            view.dispatch(view.state.tr.replaceSelectionWith(node));
          })
          .catch(() => alert('이미지 업로드에 실패했습니다.'))
          .finally(() => onUploadEndRef.current?.());

        return true;
      },
    } : undefined,
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
          onUploadStart={onUploadStart}
          onUploadEnd={onUploadEnd}
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
