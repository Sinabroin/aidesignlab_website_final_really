'use client';

import { useState, useRef } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import RichTextEditor from '@/components/editor/RichTextEditor';
function WritePostFooter({
  onClose,
  onPublish,
  isPublishing,
}: {
  onClose: () => void;
  onPublish: (e: React.FormEvent) => void;
  isPublishing: boolean;
}) {
  return (
    <div className="flex-shrink-0 flex gap-3 p-6 pt-4 border-t bg-white">
      <button
        type="button"
        onClick={onClose}
        className="relative overflow-visible flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-normal tracking-tight rounded-none transition-colors"
      >
        <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <span className="relative z-10">취소</span>
      </button>
      <button
        type="submit"
        className="relative overflow-visible flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-normal tracking-tight rounded-none transition-colors"
      >
        <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <span className="relative z-10">임시저장</span>
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={isPublishing}
        className="relative overflow-visible flex-1 py-3 bg-[#111] hover:bg-gray-800 disabled:opacity-60 text-white font-normal tracking-tight rounded-none transition-all shadow-lg"
      >
        <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <span className="relative z-10">{isPublishing ? '게시 중...' : '게시'}</span>
      </button>
    </div>
  );
}

interface WritePostProps {
  onClose: () => void;
  section: string;
  onPublished?: () => void;
}

/**
 * 게시글 작성 컴포넌트
 *
 * 텍스트, 이미지, 영상, 첨부파일 업로드 지원
 */
export default function WritePost({ onClose, section, onPublished }: WritePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentMode, setContentMode] = useState<'edit' | 'preview'>('edit');
  const [category, setCategory] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos([...videos, ...Array.from(e.target.files)]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  const handleDraftSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ section, title, category, content, hashtags, thumbnail, images, videos, files });
    alert('임시저장되었습니다.');
  };

  const [isPublishing, setIsPublishing] = useState(false);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    const trimmed = content.replace(/<[^>]*>/g, '').trim();
    if (!trimmed) {
      alert('내용을 입력해주세요.');
      return;
    }
    setIsPublishing(true);
    try {
      const thumbnailBase64 = thumbnail ? await fileToBase64(thumbnail) : undefined;
      const res = await fetch('/api/data/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          category,
          title: title.trim(),
          description: content,
          tags: hashtags,
          thumbnailBase64,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? '게시글 저장에 실패했습니다. 다시 시도해주세요.');
        return;
      }
      alert('게시글이 등록되었습니다!');
      onPublished?.();
      onClose();
    } catch {
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-none shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex-shrink-0 bg-[#111] p-6 rounded-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-none flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 className="text-2xl font-normal tracking-tight text-white">새 게시글 작성</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-none bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleDraftSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 transition-colors"
              required
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer"
              required
            >
              <option value="">선택해주세요</option>
              {section === 'playbook' && (
                <>
                  <option value="usecase">활용사례</option>
                  <option value="trend">AI Trend</option>
                  <option value="prompt">프롬프트</option>
                  <option value="hai">HAI</option>
                  <option value="teams">Teams</option>
                  <option value="interview">AI 활용 인터뷰</option>
                </>
              )}
              {section === 'playday' && (
                <>
                  <option value="workshop">워크샵</option>
                  <option value="seminar">세미나</option>
                  <option value="contest">콘테스트</option>
                  <option value="networking">네트워킹</option>
                </>
              )}
              {section === 'activity' && (
                <>
                  <option value="safety">안전</option>
                  <option value="planning">일정관리</option>
                  <option value="ai">AI 시스템</option>
                  <option value="design">디자인</option>
                </>
              )}
            </select>
          </div>

          {/* 내용 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-normal tracking-tight text-gray-700">
                내용 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1 border border-gray-300 rounded-none overflow-hidden">
                <button
                  type="button"
                  onClick={() => setContentMode('edit')}
                  className={`px-4 py-2 text-sm font-normal transition-colors ${
                    contentMode === 'edit' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  편집
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode('preview')}
                  className={`px-4 py-2 text-sm font-normal transition-colors ${
                    contentMode === 'preview' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  미리 보기
                </button>
              </div>
            </div>
            {contentMode === 'edit' ? (
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="게시글 내용을 입력하세요"
                editable={true}
                minHeight="240px"
              />
            ) : (
              <div className="border border-gray-300 rounded-none overflow-hidden bg-white">
                {!content || content.replace(/<[^>]*>/g, '').trim() === '' ? (
                  <div className="p-8 text-center text-gray-400 min-h-[240px] flex items-center justify-center">
                    내용이 없습니다.
                  </div>
                ) : (
                  <RichTextEditor
                    content={content}
                    placeholder=""
                    editable={false}
                    minHeight="240px"
                  />
                )}
              </div>
            )}
          </div>

          {/* 썸네일 이미지 */}
          <div>
            <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
              썸네일 이미지
            </label>
            {thumbnail ? (
              <div className="relative aspect-[16/10] max-w-md bg-gray-100 rounded-none overflow-hidden group">
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="썸네일 미리보기"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setThumbnail(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full max-w-md aspect-[16/10] border-2 border-dashed border-gray-300 rounded-none flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors cursor-pointer"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">클릭하여 썸네일 이미지 선택</span>
              </button>
            )}
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setThumbnail(e.target.files[0]);
              }}
              className="hidden"
            />
          </div>

          {/* 해시태그 + 키워드 */}
          <div>
            <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
              해시태그 + 키워드
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={handleHashtagKeyPress}
                placeholder="키워드 입력 후 Enter"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 transition-colors"
              />
              <button
                type="button"
                onClick={addHashtag}
                className="relative overflow-visible px-6 py-3 bg-[#111] hover:bg-gray-800 text-white font-normal tracking-tight rounded-none transition-colors"
              >
                <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
                <span className="relative z-10">추가</span>
              </button>
            </div>
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-900 rounded-none text-sm font-normal tracking-tight"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 미디어 업로드 버튼 */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="relative overflow-visible flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-none hover:bg-gray-50 transition-colors font-normal tracking-tight"
            >
              <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">사진 추가</span>
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="relative overflow-visible flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-none hover:bg-gray-50 transition-colors font-normal tracking-tight"
            >
              <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">영상 추가</span>
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative overflow-visible flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-none hover:bg-gray-50 transition-colors font-normal tracking-tight"
            >
              <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="relative z-10">첨부파일</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* 업로드된 이미지 미리보기 */}
          {images.length > 0 && (
            <div>
              <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
                사진 ({images.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-none overflow-hidden group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 업로드된 영상 목록 */}
          {videos.length > 0 && (
            <div>
              <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
                영상 ({videos.length})
              </label>
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-none">
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">{video.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 업로드된 파일 목록 */}
          {files.length > 0 && (
            <div>
              <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
                첨부파일 ({files.length})
              </label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-none">
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <span className="text-sm font-medium block">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>

          <WritePostFooter
            onClose={onClose}
            onPublish={handlePublish}
            isPublishing={isPublishing}
          />
        </form>
      </div>
    </div>
  );
}
