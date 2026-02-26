/** 미디어 업로드 영역 — Vercel Blob Client-side Upload 방식 */
'use client';

import { useRef, useState } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { uploadToBlob } from '@/lib/utils/upload';

const CLOSE_ICON = 'M6 18L18 6M6 6l12 12';
const MAX_FILE_SIZE_MB = 10;

export interface AttachmentItem {
  name: string;
  url: string;   // Blob URL
  size: string;
  type: string;
}

export interface MediaSectionProps {
  /** 편집 모드에서 기존 썸네일 URL */
  thumbnailUrl: string | null;
  /** 편집 모드에서 기존 첨부파일 목록 */
  attachments: AttachmentItem[];
  onThumbnailChange: (url: string | null) => void;
  onAttachmentsChange: (files: AttachmentItem[]) => void;
  onUploadStart: () => void;
  onUploadEnd: () => void;
}

function formatFileSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function UploadButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative overflow-visible flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-none hover:bg-gray-50 transition-colors font-normal tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <GlowingEffect disabled={!!disabled} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
      <svg className="w-5 h-5 relative z-10" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function MediaSection({
  thumbnailUrl,
  attachments,
  onThumbnailChange,
  onAttachmentsChange,
  onUploadStart,
  onUploadEnd,
}: MediaSectionProps) {
  const [thumbPreview, setThumbPreview] = useState<string | null>(thumbnailUrl);
  const [thumbUploading, setThumbUploading] = useState(false);
  /* 각 첨부파일 업로드 상태 추적 (index → uploading) */
  const [uploadingNames, setUploadingNames] = useState<Set<string>>(new Set());

  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── 썸네일 업로드 ── */
  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* 즉시 미리보기 */
    const previewUrl = URL.createObjectURL(file);
    setThumbPreview(previewUrl);
    setThumbUploading(true);
    onUploadStart();

    try {
      const url = await uploadToBlob(file, 'thumbnails');
      URL.revokeObjectURL(previewUrl);
      setThumbPreview(url);
      onThumbnailChange(url);
    } catch {
      alert('썸네일 업로드에 실패했습니다. 다시 시도해주세요.');
      setThumbPreview(thumbnailUrl);
      onThumbnailChange(null);
    } finally {
      setThumbUploading(false);
      onUploadEnd();
      if (e.target) e.target.value = '';
    }
  };

  const handleThumbnailRemove = () => {
    if (thumbPreview && thumbPreview.startsWith('blob:')) {
      URL.revokeObjectURL(thumbPreview);
    }
    setThumbPreview(null);
    onThumbnailChange(null);
  };

  /* ── 사진 추가 (미리보기 전용, 첨부파일로 업로드) ── */
  const handleImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`파일 크기 제한(${MAX_FILE_SIZE_MB}MB) 초과:\n${oversized.map((f) => f.name).join('\n')}`);
      if (e.target) e.target.value = '';
      return;
    }

    /* 선택한 이미지 파일을 첨부파일로 업로드 */
    for (const file of selected) {
      const key = `${file.name}-${Date.now()}`;
      setUploadingNames((prev) => new Set(prev).add(key));
      onUploadStart();

      uploadToBlob(file, 'images')
        .then((url) => {
          const item: AttachmentItem = {
            name: file.name,
            url,
            size: formatFileSize(file.size),
            type: file.name.split('.').pop()?.toLowerCase() ?? 'img',
          };
          onAttachmentsChange([...attachments, item]);
        })
        .catch(() => alert(`'${file.name}' 업로드에 실패했습니다.`))
        .finally(() => {
          setUploadingNames((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
          onUploadEnd();
        });
    }
    if (e.target) e.target.value = '';
  };

  /* ── 일반 파일 첨부 ── */
  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`파일 크기 제한(${MAX_FILE_SIZE_MB}MB) 초과:\n${oversized.map((f) => f.name).join('\n')}`);
      if (e.target) e.target.value = '';
      return;
    }

    for (const file of selected) {
      const key = `${file.name}-${Date.now()}`;
      setUploadingNames((prev) => new Set(prev).add(key));
      onUploadStart();

      uploadToBlob(file, 'attachments')
        .then((url) => {
          const item: AttachmentItem = {
            name: file.name,
            url,
            size: formatFileSize(file.size),
            type: file.name.split('.').pop()?.toLowerCase() ?? 'file',
          };
          onAttachmentsChange([...attachments, item]);
        })
        .catch(() => alert(`'${file.name}' 업로드에 실패했습니다.`))
        .finally(() => {
          setUploadingNames((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
          onUploadEnd();
        });
    }
    if (e.target) e.target.value = '';
  };

  const isUploading = thumbUploading || uploadingNames.size > 0;

  return (
    <>
      {/* 썸네일 */}
      <ThumbnailField
        previewUrl={thumbPreview}
        uploading={thumbUploading}
        onSelect={handleThumbnailSelect}
        onRemove={handleThumbnailRemove}
      />

      {/* 업로드 버튼 행 */}
      <div className="flex flex-wrap gap-3">
        <UploadButton
          label="사진 추가"
          icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          onClick={() => imageRef.current?.click()}
          disabled={isUploading}
        />
        <input ref={imageRef} type="file" accept="image/*" multiple onChange={handleImagesSelect} className="hidden" />

        <UploadButton
          label="첨부파일"
          icon="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
        />
        <input ref={fileRef} type="file" multiple onChange={handleFilesSelect} className="hidden" />

        {/* 업로드 중 표시 */}
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>업로드 중… ({uploadingNames.size + (thumbUploading ? 1 : 0)}개)</span>
          </div>
        )}
      </div>

      {/* 첨부파일 목록 */}
      {attachments.length > 0 && (
        <AttachmentList
          items={attachments}
          onRemove={(i) => onAttachmentsChange(attachments.filter((_, idx) => idx !== i))}
        />
      )}
    </>
  );
}

/* ── 썸네일 필드 ── */
function ThumbnailField({
  previewUrl,
  uploading,
  onSelect,
  onRemove,
}: {
  previewUrl: string | null;
  uploading: boolean;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">썸네일 이미지</label>
      {previewUrl ? (
        <div className="relative aspect-[16/10] max-w-md bg-gray-100 rounded-none overflow-hidden group">
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <svg className="w-8 h-8 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
          <img src={previewUrl} alt="썸네일 미리보기" className="w-full h-full object-cover" />
          {!uploading && (
            <button
              type="button"
              onClick={onRemove}
              aria-label="썸네일 삭제"
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CLOSE_ICON} />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-md aspect-[16/10] border-2 border-dashed border-gray-300 rounded-none flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors cursor-pointer"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">클릭하여 썸네일 이미지 선택</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={onSelect} className="hidden" />
      <ThumbnailGuide />
    </div>
  );
}

function ThumbnailGuide() {
  return (
    <div className="max-w-md mt-2 px-3 py-2 bg-gray-50 border border-gray-200 text-[11px] text-gray-500 leading-relaxed">
      <span className="font-semibold text-gray-600">썸네일 가이드</span>
      <span className="mx-1.5 text-gray-300">|</span>
      권장 <strong className="text-gray-600">800 × 600px</strong>
      <span className="mx-1 text-gray-300">/</span>
      최대 <strong className="text-gray-600">10MB</strong>
      <span className="mx-1 text-gray-300">/</span>
      형식 JPG · PNG · WebP
      <span className="mx-1 text-gray-300">/</span>
      Blob 스토리지에 직접 업로드
    </div>
  );
}

/* ── 첨부파일 목록 ── */
function AttachmentList({ items, onRemove }: { items: AttachmentItem[]; onRemove: (i: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
        첨부파일 ({items.length})
      </label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-none border border-gray-200">
            <div className="flex items-center gap-3 min-w-0">
              <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="min-w-0">
                <span className="text-sm font-medium block truncate">{item.name}</span>
                <span className="text-xs text-gray-400">{item.size}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`"${item.name}" 삭제`}
              className="text-red-400 hover:text-red-600 shrink-0 ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CLOSE_ICON} />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
