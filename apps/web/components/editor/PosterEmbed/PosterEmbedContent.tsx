'use client';

/** Poster Embed NodeView - 편집 시 iframe 프리뷰, 읽기 시에도 동일 */
import { useSession } from 'next-auth/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import PosterPreviewFrame from './PosterPreviewFrame';
import PosterInsertModal from './PosterInsertModal';
import { generatePosterId } from './PosterEmbedNode';
import { isAdvancedUser } from '@/lib/auth/rbac';
import type { User } from '@/lib/auth/rbac';

interface PosterEmbedContentProps {
  node: { attrs: { posterId?: string; html?: string; css?: string } };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  deleteNode: () => void;
  editor: { isEditable?: boolean };
}

export default function PosterEmbedContent({
  node,
  updateAttributes,
  deleteNode,
  editor,
}: PosterEmbedContentProps) {
  const { data: session } = useSession();
  const user: User | null = session?.user
    ? { id: session.user.email ?? '', email: session.user.email ?? undefined, name: session.user.name ?? undefined }
    : null;
  const allowScripts = isAdvancedUser(user);

  const [modalOpen, setModalOpen] = useState(false);
  const posterId = (node.attrs.posterId as string) ?? '';
  const hasInitPosterId = useRef(false);
  useEffect(() => {
    if (!hasInitPosterId.current && !posterId) {
      hasInitPosterId.current = true;
      updateAttributes({ posterId: generatePosterId() });
    }
  }, [posterId, updateAttributes]);
  const html = node.attrs.html ?? '';
  const css = node.attrs.css ?? '';
  const isEditable = editor?.isEditable ?? true;

  const handleSave = (h: string, c: string) => {
    updateAttributes({ html: h, css: c });
    setModalOpen(false);
  };

  if (!isEditable) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="border border-gray-200 rounded-none overflow-hidden bg-white">
          {html || css ? (
            <PosterPreviewFrame html={html} css={css} allowScripts={allowScripts} />
          ) : (
            <div className="p-8 text-center text-gray-400">포스터가 없습니다.</div>
          )}
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <div className="border border-gray-300 rounded-none overflow-hidden bg-white">
        <div className="flex items-center justify-between gap-2 py-2 px-3 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-medium text-gray-900">포스터</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-none hover:bg-gray-100"
            >
              편집
            </button>
            <button
              type="button"
              onClick={deleteNode}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-none"
            >
              삭제
            </button>
          </div>
        </div>
        <div className="min-h-[120px]">
          {html || css ? (
            <PosterPreviewFrame html={html} css={css} allowScripts={allowScripts} />
          ) : (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full p-8 text-center text-gray-500 hover:bg-gray-50 border-2 border-dashed border-gray-200"
            >
              + HTML/CSS 입력하여 포스터 추가
            </button>
          )}
        </div>
      </div>
      {modalOpen && (
        <PosterInsertModal
          html={html}
          css={css}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          allowScripts={allowScripts}
        />
      )}
    </NodeViewWrapper>
  );
}
