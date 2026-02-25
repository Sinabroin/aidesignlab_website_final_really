/** 게시글 작성 모달 — 서브컴포넌트 합성 */
'use client';

import { useState } from 'react';
import WritePostHeader from '@/components/write-post/WritePostHeader';
import WritePostFooter from '@/components/write-post/WritePostFooter';
import ContentField from '@/components/write-post/ContentField';
import HashtagField from '@/components/write-post/HashtagField';
import MediaSection from '@/components/write-post/MediaSection';
import CategorySelect from '@/components/write-post/CategorySelect';

export interface EditPostData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  attachments?: { name: string; url: string; size: string; type: string }[];
}

interface WritePostProps {
  onClose: () => void;
  section: string;
  onPublished?: () => void;
  editData?: EditPostData;
}

const MAX_ATTACHMENT_MB = 3;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const THUMB_MAX_W = 800;
const THUMB_MAX_H = 600;
const THUMB_QUALITY = 0.8;

function resizeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > THUMB_MAX_W || height > THUMB_MAX_H) {
        const ratio = Math.min(THUMB_MAX_W / width, THUMB_MAX_H / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', THUMB_QUALITY));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function formatFileSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

async function convertFilesToAttachments(files: File[]) {
  return Promise.all(
    files.map(async (file) => {
      const base64 = await fileToBase64(file);
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'file';
      return { name: file.name, url: base64, size: formatFileSize(file.size), type: ext };
    })
  );
}

export default function WritePost({ onClose, section, onPublished, editData }: WritePostProps) {
  const isEditMode = !!editData;
  const [title, setTitle] = useState(editData?.title ?? '');
  const [content, setContent] = useState(editData?.description ?? '');
  const [category, setCategory] = useState(editData?.category ?? '');
  const [hashtags, setHashtags] = useState<string[]>(editData?.tags ?? []);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleDraftSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('임시저장되었습니다.');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <ContentField content={content} onChange={setContent} />
            <MediaSection
              thumbnail={thumbnail} images={images} videos={videos} files={files}
              onThumbnailChange={setThumbnail} onImagesChange={setImages} onVideosChange={setVideos} onFilesChange={setFiles}
            />
            <HashtagField hashtags={hashtags} onAdd={addHashtag} onRemove={removeHashtag} />
          </div>
          <WritePostFooter onClose={onClose} onPublish={handlePublish} isPublishing={isPublishing} isEditMode={isEditMode} />
        </form>
      </div>
    </div>
  );

  function validateForm(): boolean {
    if (!title.trim()) { alert('제목을 입력해주세요.'); return false; }
    if (!category || category.split(',').filter(Boolean).length === 0) { alert('카테고리를 하나 이상 선택해주세요.'); return false; }
    const hasText = content.replace(/<[^>]*>/g, '').trim().length > 0;
    const hasEmbed = content.includes('data-type=');
    const hasMedia = !!thumbnail || images.length > 0 || videos.length > 0 || files.length > 0;
    if (!hasText && !hasEmbed && !hasMedia) { alert('내용, 이미지, 또는 첨부파일 중 하나 이상을 추가해주세요.'); return false; }
    const oversized = files.filter((f) => f.size > MAX_ATTACHMENT_MB * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`첨부파일 크기 제한 초과 (최대 ${MAX_ATTACHMENT_MB}MB):\n${oversized.map((f) => f.name).join('\n')}`);
      return false;
    }
    return true;
  }

  async function submitPost() {
    setIsPublishing(true);
    try {
      const thumbnailBase64 = thumbnail ? await resizeImageToBase64(thumbnail) : (isEditMode ? editData?.thumbnail : undefined);
      const newAttachments = files.length > 0 ? await convertFilesToAttachments(files) : undefined;
      const mergedAttachments = newAttachments ?? (isEditMode ? editData?.attachments : undefined);

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
          thumbnailBase64: thumbnailBase64,
          attachments: mergedAttachments,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? (isEditMode ? '게시글 수정에 실패했습니다.' : '게시글 저장에 실패했습니다. 다시 시도해주세요.'));
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
