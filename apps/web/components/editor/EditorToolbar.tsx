'use client';

/** 포맷팅 툴바 - Bold, Italic, Heading, List 등, + 포스터 */
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { useEditor } from '@tiptap/react';
import PosterInsertModal from './PosterEmbed/PosterInsertModal';
import { generatePosterId } from './PosterEmbed';
import { isAdvancedUser } from '@/lib/auth/rbac';
import type { User } from '@/lib/auth/rbac';

type EditorInstance = NonNullable<ReturnType<typeof useEditor>>;

interface EditorToolbarProps {
  editor: EditorInstance | null;
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

export default function EditorToolbar({ editor }: EditorToolbarProps) {
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
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="굵게"
        >
          <span className="font-bold text-sm">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="기울임"
        >
          <span className="italic text-sm">I</span>
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="제목 1"
        >
          <span className="text-sm font-medium">H1</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="제목 2"
        >
          <span className="text-sm font-medium">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="제목 3"
        >
          <span className="text-sm font-medium">H3</span>
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="글머리 기호"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zm3-10h11v2H7V6zm0 5h11v2H7v-2zm0 5h11v2H7v-2z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="번호 매기기"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 6h2v2H2V6zm0 5h2v2H2v-2zm0 5h2v2H2v-2zm3-9h15v2H5V7zm0 5h15v2H5v-2zm0 5h15v2H5v-2z" />
          </svg>
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="구분선"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 11h16v2H4z" />
          </svg>
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
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
