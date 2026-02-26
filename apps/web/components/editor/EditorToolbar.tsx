/** 포맷팅 툴바 - Bold, Italic, Heading, List, 이미지, 영상, 소스 토글, 포스터 */
'use client';

import { useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { useEditor } from '@tiptap/react';
import PosterInsertModal from './PosterEmbed/PosterInsertModal';
import { generatePosterId } from './PosterEmbed';
import { isAdvancedUser } from '@/lib/auth/rbac';
import type { User } from '@/lib/auth/rbac';
import { uploadToBlob } from '@/lib/utils/upload';

type EditorInstance = NonNullable<ReturnType<typeof useEditor>>;

interface EditorToolbarProps {
  editor: EditorInstance | null;
  showSource?: boolean;
  onSourceToggle?: () => void;
  showSourceButton?: boolean;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-none transition-colors ${
        active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-gray-300 mx-1 self-center" />;
}

function ImageUploadButton({
  editor,
  onUploadStart,
  onUploadEnd,
}: {
  editor: EditorInstance;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onUploadStart?.();
    try {
      const url = await uploadToBlob(file, 'editor-images');
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [editor, onUploadStart, onUploadEnd]);

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />
      <ToolbarButton
        onClick={() => fileRef.current?.click()}
        title={isUploading ? '업로드 중…' : '이미지 삽입'}
        disabled={isUploading}
      >
        {isUploading ? (
          <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </ToolbarButton>
    </>
  );
}

function VideoEmbedButton({ editor }: { editor: EditorInstance }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInsert = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) return;
    editor.chain().focus().setVideoEmbed({ src: trimmed }).run();
    setUrl('');
    setOpen(false);
  }, [editor, url]);

  return (
    <div className="relative">
      <ToolbarButton
        onClick={() => {
          setOpen((p) => !p);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        active={open}
        title="영상 삽입"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </ToolbarButton>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 shadow-lg p-3 z-50 w-80">
          <label className="block text-xs text-gray-500 mb-1">
            YouTube, Vimeo 또는 영상 URL
          </label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 px-2 py-1.5 border border-gray-300 text-sm focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
            />
            <button
              type="button"
              onClick={handleInsert}
              disabled={!url.trim()}
              className="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
            >
              삽입
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorToolbar({
  editor,
  showSource,
  onSourceToggle,
  showSourceButton = false,
  onUploadStart,
  onUploadEnd,
}: EditorToolbarProps) {
  const { data: session } = useSession();
  const user: User | null = session?.user
    ? { id: session.user.email ?? '', email: session.user.email ?? undefined, name: session.user.name ?? undefined }
    : null;
  const allowScripts = isAdvancedUser(user);

  const [posterModalOpen, setPosterModalOpen] = useState(false);

  const handlePosterInsert = (html: string, css: string) => {
    if (!editor) return;
    const posterId = generatePosterId();
    editor.chain().focus().insertPosterEmbed({ posterId, html, css }).run();
    setPosterModalOpen(false);
  };

  if (!editor) return null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게">
          <span className="font-bold text-sm">B</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임">
          <span className="italic text-sm">I</span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="제목 1">
          <span className="text-sm font-medium">H1</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="제목 2">
          <span className="text-sm font-medium">H2</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="제목 3">
          <span className="text-sm font-medium">H3</span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="글머리 기호">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zm3-10h11v2H7V6zm0 5h11v2H7v-2zm0 5h11v2H7v-2z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="번호 매기기">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 6h2v2H2V6zm0 5h2v2H2v-2zm0 5h2v2H2v-2zm3-9h15v2H5V7zm0 5h15v2H5v-2zm0 5h15v2H5v-2z" />
          </svg>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 11h16v2H4z" />
          </svg>
        </ToolbarButton>

        <Divider />

        <ImageUploadButton editor={editor} onUploadStart={onUploadStart} onUploadEnd={onUploadEnd} />
        <VideoEmbedButton editor={editor} />

        {showSourceButton && onSourceToggle && (
          <>
            <Divider />
            <ToolbarButton onClick={onSourceToggle} active={showSource} title="HTML 소스 보기">
              <span className="text-sm font-mono font-medium">&lt;/&gt;</span>
            </ToolbarButton>
          </>
        )}

        <Divider />

        <button
          type="button"
          onClick={() => setPosterModalOpen(true)}
          title="포스터 추가"
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-none"
        >
          <span className="font-medium">+ 포스터</span>
        </button>
      </div>
      {posterModalOpen && (
        <PosterInsertModal
          html=""
          css=""
          onSave={handlePosterInsert}
          onClose={() => setPosterModalOpen(false)}
          allowScripts={allowScripts}
        />
      )}
    </>
  );
}
