/** 게시글 작성/수정 모달 — Vercel Blob URL 기반 */
'use client';

import { useState, useCallback } from 'react';
import WritePostHeader from '@/components/write-post/WritePostHeader';
import WritePostFooter from '@/components/write-post/WritePostFooter';
import ContentField from '@/components/write-post/ContentField';
import HashtagField from '@/components/write-post/HashtagField';
import MediaSection, { type AttachmentItem } from '@/components/write-post/MediaSection';
import CategorySelect from '@/components/write-post/CategorySelect';

export interface EditPostData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  attachments?: AttachmentItem[];
}

interface WritePostProps {
  onClose: () => void;
  section: string;
  onPublished?: () => void;
  editData?: EditPostData;
}

export default function WritePost({ onClose, section, onPublished, editData }: WritePostProps) {
  const isEditMode = !!editData;

  /* 텍스트 필드 */
  const [title, setTitle] = useState(editData?.title ?? '');
  const [content, setContent] = useState(editData?.description ?? '');
  const [category, setCategory] = useState(editData?.category ?? '');
  const [hashtags, setHashtags] = useState<string[]>(editData?.tags ?? []);

  /* 미디어 — 이제 모두 Blob URL 기반 */
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(editData?.thumbnail ?? null);
  const [attachments, setAttachments] = useState<AttachmentItem[]>(editData?.attachments ?? []);

  /* 업로드 진행 카운터 — 동시 업로드 여러 개 지원 */
  const [uploadCount, setUploadCount] = useState(0);
  const isUploading = uploadCount > 0;

  const handleUploadStart = useCallback(() => setUploadCount((c) => c + 1), []);
  const handleUploadEnd = useCallback(() => setUploadCount((c) => Math.max(0, c - 1)), []);

  const [isPublishing, setIsPublishing] = useState(false);

  /* ── 이벤트 핸들러 ── */
  const handleDraftSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('임시저장되었습니다.');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      alert('파일 업로드가 진행 중입니다. 완료 후 다시 시도해주세요.');
      return;
    }
    if (!validateForm()) return;
    await submitPost();
  };

  const addHashtag = (tag: string) => setHashtags((prev) => [...prev, tag]);
  const removeHashtag = (tag: string) => setHashtags((prev) => prev.filter((t) => t !== tag));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-none shadow-2xl overflow-hidden">
        <WritePostHeader onClose={onClose} isEditMode={isEditMode} />
        <form onSubmit={handleDraftSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <TitleField value={title} onChange={setTitle} />
            <CategorySelect section={section} value={category} onChange={setCategory} />
            <ContentField
              content={content}
              onChange={setContent}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
            <MediaSection
              thumbnailUrl={thumbnailUrl}
              attachments={attachments}
              onThumbnailChange={setThumbnailUrl}
              onAttachmentsChange={setAttachments}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
            <HashtagField hashtags={hashtags} onAdd={addHashtag} onRemove={removeHashtag} />
          </div>
          <WritePostFooter
            onClose={onClose}
            onPublish={handlePublish}
            isPublishing={isPublishing}
            isEditMode={isEditMode}
            isUploading={isUploading}
          />
        </form>
      </div>
    </div>
  );

  /* ── 유효성 검사 ── */
  function validateForm(): boolean {
    if (!title.trim()) { alert('제목을 입력해주세요.'); return false; }
    if (!category || category.split(',').filter(Boolean).length === 0) {
      alert('카테고리를 하나 이상 선택해주세요.'); return false;
    }
    const hasText = content.replace(/<[^>]*>/g, '').trim().length > 0;
    const hasEmbed = content.includes('data-type=');
    const hasMedia = !!thumbnailUrl || attachments.length > 0;
    if (!hasText && !hasEmbed && !hasMedia) {
      alert('내용, 이미지, 또는 첨부파일 중 하나 이상을 추가해주세요.'); return false;
    }
    return true;
  }

  /* ── API 전송 — payload는 URL만 포함 (base64 없음) ── */
  async function submitPost() {
    setIsPublishing(true);
    try {
      const url = isEditMode ? `/api/data/posts/${editData!.id}` : '/api/data/posts';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          category,
          title: title.trim(),
          description: content,
          tags: hashtags,
          thumbnail: thumbnailUrl ?? undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        alert(err.error ?? (isEditMode ? '게시글 수정에 실패했습니다.' : '게시글 저장에 실패했습니다.'));
        return;
      }

      alert(isEditMode ? '게시글이 수정되었습니다!' : '게시글이 등록되었습니다!');
      onPublished?.();
      onClose();
    } catch {
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsPublishing(false);
    }
  }
}

function TitleField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
        제목 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="게시글 제목을 입력하세요…"
        name="postTitle"
        autoComplete="off"
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none transition-colors"
        required
      />
    </div>
  );
}
