/** 미디어 업로드 및 프리뷰 영역 (썸네일, 사진, 영상, 첨부파일) */
'use client';

import { useRef } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';

const CLOSE_ICON = "M6 18L18 6M6 6l12 12";

function UploadButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-visible flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-none hover:bg-gray-50 transition-colors font-normal tracking-tight"
    >
      <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
      <svg className="w-5 h-5 relative z-10" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

interface MediaSectionProps {
  thumbnail: File | null;
  images: File[];
  videos: File[];
  files: File[];
  onThumbnailChange: (file: File | null) => void;
  onImagesChange: (files: File[]) => void;
  onVideosChange: (files: File[]) => void;
  onFilesChange: (files: File[]) => void;
}

export default function MediaSection({
  thumbnail, images, videos, files,
  onThumbnailChange, onImagesChange, onVideosChange, onFilesChange,
}: MediaSectionProps) {
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <ThumbnailField thumbnail={thumbnail} onChange={onThumbnailChange} />

      <div className="flex flex-wrap gap-3">
        <UploadButton label="사진 추가" onClick={() => imageRef.current?.click()} icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <input ref={imageRef} type="file" accept="image/*" multiple onChange={(e) => e.target.files && onImagesChange([...images, ...Array.from(e.target.files)])} className="hidden" />

        <UploadButton label="영상 추가" onClick={() => videoRef.current?.click()} icon="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        <input ref={videoRef} type="file" accept="video/*" multiple onChange={(e) => e.target.files && onVideosChange([...videos, ...Array.from(e.target.files)])} className="hidden" />

        <UploadButton label="첨부파일" onClick={() => fileRef.current?.click()} icon="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        <input ref={fileRef} type="file" multiple onChange={(e) => e.target.files && onFilesChange([...files, ...Array.from(e.target.files)])} className="hidden" />
      </div>

      {images.length > 0 && <ImageGrid images={images} onRemove={(i) => onImagesChange(images.filter((_, idx) => idx !== i))} />}
      {videos.length > 0 && <FileListSection label="영상" items={videos} icon="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" onRemove={(i) => onVideosChange(videos.filter((_, idx) => idx !== i))} />}
      {files.length > 0 && <FileListSection label="첨부파일" items={files} showSize icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" onRemove={(i) => onFilesChange(files.filter((_, idx) => idx !== i))} />}
    </>
  );
}

function ThumbnailField({ thumbnail, onChange }: { thumbnail: File | null; onChange: (f: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">썸네일 이미지</label>
      {thumbnail ? (
        <div className="relative aspect-[16/10] max-w-md bg-gray-100 rounded-none overflow-hidden group">
          <img src={URL.createObjectURL(thumbnail)} alt="썸네일 미리보기" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange(null)} aria-label="썸네일 삭제" className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CLOSE_ICON} /></svg>
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="w-full max-w-md aspect-[16/10] border-2 border-dashed border-gray-300 rounded-none flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors cursor-pointer">
          <svg className="w-10 h-10" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-sm">클릭하여 썸네일 이미지 선택</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0]); }} className="hidden" />
    </div>
  );
}

function ImageGrid({ images, onRemove }: { images: File[]; onRemove: (i: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">사진 ({images.length})</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square bg-gray-100 rounded-none overflow-hidden group">
            <img src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <button type="button" onClick={() => onRemove(index)} aria-label={`사진 ${index + 1} 삭제`} className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CLOSE_ICON} /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileListSection({ label, items, icon, onRemove, showSize }: { label: string; items: File[]; icon: string; onRemove: (i: number) => void; showSize?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">{label} ({items.length})</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-none">
            <div className="flex items-center gap-3 min-w-0">
              <svg className="w-8 h-8 text-gray-600 shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
              <div className="min-w-0">
                <span className="text-sm font-medium block truncate">{item.name}</span>
                {showSize && <span className="text-xs text-gray-500">{(item.size / 1024 / 1024).toFixed(2)} MB</span>}
              </div>
            </div>
            <button type="button" onClick={() => onRemove(index)} aria-label={`${label} "${item.name}" 삭제`} className="text-red-500 hover:text-red-700 shrink-0">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CLOSE_ICON} /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
