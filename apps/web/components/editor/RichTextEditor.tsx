'use client';

/** Tiptap 기반 Rich Text 에디터 - 본문 작성용 */
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { PosterEmbed } from './PosterEmbed';
import EditorToolbar from './EditorToolbar';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
}

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = '게시글 내용을 입력하세요',
  editable = true,
  minHeight = '200px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder }),
      PosterEmbed,
    ],
    content: content || '<p></p>',
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 rounded-none overflow-hidden bg-white">
      {editable && <EditorToolbar editor={editor} />}
      <div className="p-4" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
