/** This component displays operator-only home content management UI. */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ApiError,
  createAdminHomeContent,
  deleteAdminHomeContent,
  getAdminHomeContent,
} from '@/lib/api/admin';
import type { AdminHomeContentResponse, HomeContentType } from '@/lib/api/types';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[160px] border border-gray-300 flex items-center justify-center text-gray-400">
      에디터 로딩 중…
    </div>
  ),
});

type FormState = {
  bannerTitle: string;
  bannerDescription: string;
  bannerContent: string;
  bannerHref: string;
  bannerThumbnail: string;
  noticeTitle: string;
  noticeDescription: string;
  noticeContent: string;
  noticeBadge: string;
  guideTitle: string;
  guideDescription: string;
};

const initialFormState: FormState = {
  bannerTitle: '',
  bannerDescription: '',
  bannerContent: '',
  bannerHref: '',
  bannerThumbnail: '',
  noticeTitle: '',
  noticeDescription: '',
  noticeContent: '',
  noticeBadge: '공지',
  guideTitle: '',
  guideDescription: '',
};

function validateTitle(contentType: HomeContentType, form: FormState): string | null {
  if (contentType === 'banner' && !form.bannerTitle.trim()) return '배너 제목을 입력해 주세요.';
  if (contentType === 'notice' && !form.noticeTitle.trim()) return '공지 제목을 입력해 주세요.';
  if (contentType === 'playday-guide' && !form.guideTitle.trim()) return '안내 제목을 입력해 주세요.';
  return null;
}

async function submitContent(
  contentType: HomeContentType,
  form: FormState,
  bannerFiles: FileAttachment[],
) {
  if (contentType === 'banner') {
    return createAdminHomeContent('banner', {
      title: form.bannerTitle,
      description: form.bannerDescription,
      content: form.bannerContent,
      href: form.bannerHref,
      thumbnail: form.bannerThumbnail || undefined,
      attachments: bannerFiles.length > 0 ? bannerFiles : undefined,
    });
  }
  if (contentType === 'notice') {
    return createAdminHomeContent('notice', {
      title: form.noticeTitle,
      description: form.noticeDescription,
      content: form.noticeContent,
      badge: form.noticeBadge,
    });
  }
  return createAdminHomeContent('playday-guide', {
    title: form.guideTitle,
    description: form.guideDescription,
  });
}

function resetFormFields(
  contentType: HomeContentType,
  setForm: React.Dispatch<React.SetStateAction<FormState>>,
  setBannerFiles: React.Dispatch<React.SetStateAction<FileAttachment[]>>,
) {
  if (contentType === 'banner') {
    setForm((prev) => ({
      ...prev, bannerTitle: '', bannerDescription: '',
      bannerContent: '', bannerHref: '', bannerThumbnail: '',
    }));
    setBannerFiles([]);
  } else if (contentType === 'notice') {
    setForm((prev) => ({
      ...prev, noticeTitle: '', noticeDescription: '', noticeContent: '',
    }));
  } else {
    setForm((prev) => ({ ...prev, guideTitle: '', guideDescription: '' }));
  }
}

const BANNER_SPECS = {
  desktopRatio: '16:9',
  mobileRatio: '4:5',
  recommended: { width: 1920, height: 1080 },
  minimum: { width: 1200, height: 675 },
  maxFileSize: 5 * 1024 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const detail = (error.data as Record<string, unknown>).detail;
    const msg = error.data.message ?? fallback;
    console.error('[HomeContentManagement]', msg, detail);
    return `${msg} (HTTP ${error.status})`;
  }
  if (error instanceof Error) {
    console.error('[HomeContentManagement]', error);
    return error.message;
  }
  console.error('[HomeContentManagement]', error);
  return fallback;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-none border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}

type FileAttachment = { name: string; type: string; size: number; data: string };

export default function HomeContentManagementTab() {
  const [data, setData] = useState<AdminHomeContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<HomeContentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [bannerFiles, setBannerFiles] = useState<FileAttachment[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAdminHomeContent());
    } catch (e) {
      setError(toErrorMessage(e, '홈 콘텐츠를 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = useCallback(async (contentType: HomeContentType) => {
    const titleValidation = validateTitle(contentType, form);
    if (titleValidation) { setError(titleValidation); return; }

    setSubmitting(contentType);
    setError(null);
    try {
      await submitContent(contentType, form, bannerFiles);
      resetFormFields(contentType, setForm, setBannerFiles);
      await load();
    } catch (e) {
      setError(toErrorMessage(e, '콘텐츠를 저장하지 못했습니다.'));
    } finally {
      setSubmitting(null);
    }
  }, [form, bannerFiles, load]);

  const handleDelete = useCallback(async (contentType: HomeContentType, id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setError(null);
    try {
      await deleteAdminHomeContent(contentType, id);
      await load();
    } catch (e) {
      setError(toErrorMessage(e, '콘텐츠를 삭제하지 못했습니다.'));
    }
  }, [load]);

  if (loading) return <p className="text-gray-600">홈 콘텐츠를 불러오는 중…</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">홈 콘텐츠 관리</h2>
      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-800 px-4 py-3 rounded flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="font-semibold">오류 발생</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <SectionCard title="배너 광고">
        <BannerForm
          form={form}
          updateField={updateField}
          onContentChange={(html) => updateField('bannerContent', html)}
          onSubmit={() => handleCreate('banner')}
          submitting={submitting === 'banner'}
          files={bannerFiles}
          onFilesChange={setBannerFiles}
        />
        <BannerList
          banners={data?.banners ?? []}
          onDelete={(id) => handleDelete('banner', id)}
        />
      </SectionCard>

      <SectionCard title="공지사항">
        <NoticeForm
          form={form}
          updateField={updateField}
          onContentChange={(html) => updateField('noticeContent', html)}
          onSubmit={() => handleCreate('notice')}
          submitting={submitting === 'notice'}
        />
        <NoticeList
          notices={data?.notices ?? []}
          onDelete={(id) => handleDelete('notice', id)}
        />
      </SectionCard>

      <SectionCard title="PlayDay 안내">
        <GuideForm
          form={form}
          updateField={updateField}
          onSubmit={() => handleCreate('playday-guide')}
          submitting={submitting === 'playday-guide'}
        />
        <GuideList
          guides={data?.playdayGuides ?? []}
          onDelete={(id) => handleDelete('playday-guide', id)}
        />
      </SectionCard>
    </div>
  );
}

/* ── Banner ── */

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function BannerForm({
  form,
  updateField,
  onContentChange,
  onSubmit,
  submitting,
  files,
  onFilesChange,
}: {
  form: FormState;
  updateField: (key: keyof FormState, value: string) => void;
  onContentChange: (html: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  files: FileAttachment[];
  onFilesChange: (files: FileAttachment[]) => void;
}) {
  const handleFileAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const newFiles: FileAttachment[] = [];
    for (const file of Array.from(selected)) {
      if (file.size > 10 * 1024 * 1024) { alert(`${file.name}: 10MB 초과`); continue; }
      const data = await fileToBase64(file);
      newFiles.push({ name: file.name, type: file.type, size: file.size, data });
    }
    onFilesChange([...files, ...newFiles]);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <BannerMetaInputs form={form} updateField={updateField} />

      <ThumbnailUpload
        value={form.bannerThumbnail}
        onChange={(dataUrl) => updateField('bannerThumbnail', dataUrl)}
      />

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          배너 콘텐츠 (이미지·영상·텍스트 자유 입력)
        </label>
        <RichTextEditor
          content={form.bannerContent}
          onChange={onContentChange}
          placeholder="이미지, 영상, 텍스트를 자유롭게 입력하세요…"
          editable
          minHeight="160px"
          showSourceToggle
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">첨부파일 (최대 10MB/파일)</label>
        <input
          type="file"
          multiple
          onChange={handleFileAdd}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:border file:border-gray-300 file:bg-white file:text-gray-700 file:cursor-pointer hover:file:bg-gray-50"
        />
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>{f.name} ({formatFileSize(f.size)})</span>
                <button onClick={() => removeFile(i)} className="text-red-500 text-xs hover:underline">삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? '등록 중…' : '배너 등록'}
      </button>
    </div>
  );
}

function validateThumbnailFile(file: File): string | null {
  if (!BANNER_SPECS.acceptedTypes.includes(file.type as typeof BANNER_SPECS.acceptedTypes[number])) {
    return 'JPG, PNG, WebP 형식만 지원됩니다.';
  }
  if (file.size > BANNER_SPECS.maxFileSize) {
    return `파일 크기가 ${formatFileSize(BANNER_SPECS.maxFileSize)}를 초과합니다.`;
  }
  return null;
}

function validateImageDimensions(img: HTMLImageElement): string | null {
  const { width, height } = img;
  const { minimum } = BANNER_SPECS;
  if (width < minimum.width || height < minimum.height) {
    return `이미지 크기가 너무 작습니다 (${width}×${height}px). 최소 ${minimum.width}×${minimum.height}px 이상이어야 합니다.`;
  }
  return null;
}

function ThumbnailUpload({ value, onChange }: { value: string; onChange: (dataUrl: string) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) node.value = '';
  }, []);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    const validationError = validateThumbnailFile(file);
    if (validationError) { setError(validationError); return; }

    const dataUrl = await fileToDataUrl(file);
    const img = new Image();
    img.onload = () => {
      const dimError = validateImageDimensions(img);
      if (dimError) { setError(dimError); return; }
      setDimensions({ w: img.width, h: img.height });
      onChange(dataUrl);
    };
    img.onerror = () => setError('이미지를 읽을 수 없습니다.');
    img.src = dataUrl;
  }, [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setDimensions(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        배너 썸네일 이미지
      </label>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {value ? (
          <ThumbnailPreview src={value} dimensions={dimensions} onRemove={handleRemove} />
        ) : (
          <ThumbnailDropZone
            dragOver={dragOver}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onChange={handleChange}
            inputRef={inputRef}
          />
        )}

        <ThumbnailGuide />
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function ThumbnailPreview({ src, dimensions, onRemove }: { src: string; dimensions: { w: number; h: number } | null; onRemove: () => void }) {
  return (
    <div className="relative border border-gray-200 rounded bg-gray-50 overflow-hidden">
      <div className="aspect-[16/9] flex items-center justify-center bg-white">
        <img src={src} alt="썸네일 미리보기" className="w-full h-full object-contain" />
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          {dimensions ? `${dimensions.w} × ${dimensions.h}px` : '로딩 중…'}
        </span>
        <button onClick={onRemove} className="text-red-500 text-xs hover:underline">삭제</button>
      </div>
    </div>
  );
}

function ThumbnailDropZone({
  dragOver, onDragOver, onDragLeave, onDrop, onChange, inputRef,
}: {
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: (node: HTMLInputElement | null) => void;
}) {
  return (
    <div
      className={`relative border-2 border-dashed rounded p-6 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
        dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-sm text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
      <p className="text-xs text-gray-400">JPG, PNG, WebP · 최대 5MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}

function ThumbnailGuide() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs space-y-2">
      <h4 className="font-semibold text-blue-800 flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        배너 이미지 가이드
      </h4>
      <div className="text-blue-700 space-y-1.5">
        <p><strong>데스크탑 비율:</strong> 16:9 (가로형)</p>
        <p><strong>모바일 비율:</strong> 4:5 (세로형, 자동 크롭)</p>
        <div className="border-t border-blue-200 pt-1.5 mt-1.5">
          <p><strong>권장 크기:</strong> 1920 × 1080px</p>
          <p><strong>최소 크기:</strong> 1200 × 675px</p>
          <p><strong>레티나(2x):</strong> 2400 × 1350px</p>
        </div>
        <div className="border-t border-blue-200 pt-1.5 mt-1.5">
          <p><strong>실제 배너 영역:</strong></p>
          <p>· 데스크탑: ~1104 × 621px</p>
          <p>· 최대 높이: 700px</p>
          <p>· 모바일: 화면 너비 × 1.25배 높이</p>
        </div>
        <div className="border-t border-blue-200 pt-1.5 mt-1.5">
          <p><strong>파일 형식:</strong> JPG, PNG, WebP</p>
          <p><strong>최대 용량:</strong> 5MB</p>
        </div>
      </div>
    </div>
  );
}

function BannerMetaInputs({
  form,
  updateField,
}: {
  form: FormState;
  updateField: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <input
        value={form.bannerTitle}
        onChange={(e) => updateField('bannerTitle', e.target.value)}
        placeholder="배너 제목…"
        name="bannerTitle"
        autoComplete="off"
        aria-label="배너 제목"
        className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      />
      <input
        value={form.bannerDescription}
        onChange={(e) => updateField('bannerDescription', e.target.value)}
        placeholder="짧은 설명 (선택)…"
        name="bannerDescription"
        autoComplete="off"
        aria-label="배너 짧은 설명"
        className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      />
      <input
        value={form.bannerHref}
        onChange={(e) => updateField('bannerHref', e.target.value)}
        placeholder="연결 링크 (선택)…"
        name="bannerHref"
        type="url"
        autoComplete="off"
        aria-label="배너 연결 링크"
        className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      />
    </div>
  );
}

function BannerList({
  banners,
  onDelete,
}: {
  banners: AdminHomeContentResponse['banners'];
  onDelete: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ul className="divide-y border border-gray-200">
      {banners.map((item) => (
        <li key={item.id} className="px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            {item.thumbnail && (
              <div className="w-24 h-14 shrink-0 bg-gray-100 border border-gray-200 rounded overflow-hidden">
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{item.title}</p>
              {item.content ? (
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  {expandedId === item.id ? '\u25BC 미리보기 닫기' : '\u25B6 미리보기 열기'}
                </button>
              ) : (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
            </div>
            <button
              onClick={() => onDelete(item.id)}
              aria-label={`배너 "${item.title}" 삭제`}
              className="text-red-600 text-sm hover:text-red-800 transition-colors shrink-0"
            >
              삭제
            </button>
          </div>
          {expandedId === item.id && item.content && (
            <div className="mt-2">
              <HtmlPreviewFrame html={item.content} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ── Notice ── */

function NoticeForm({
  form,
  updateField,
  onContentChange,
  onSubmit,
  submitting,
}: {
  form: FormState;
  updateField: (k: keyof FormState, v: string) => void;
  onContentChange: (html: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-3">
      <NoticeMetaInputs form={form} updateField={updateField} />

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          공지 본문 (이미지·영상·텍스트 자유 입력)
        </label>
        <RichTextEditor
          content={form.noticeContent}
          onChange={onContentChange}
          placeholder="이미지, 영상, 텍스트를 자유롭게 입력하세요…"
          editable
          minHeight="160px"
          showSourceToggle
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? '등록 중…' : '공지 등록'}
      </button>
    </div>
  );
}

function NoticeMetaInputs({
  form,
  updateField,
}: {
  form: FormState;
  updateField: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <input
        value={form.noticeTitle}
        onChange={(e) => updateField('noticeTitle', e.target.value)}
        placeholder="공지 제목…"
        name="noticeTitle"
        autoComplete="off"
        aria-label="공지 제목"
        className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      />
      <input
        value={form.noticeDescription}
        onChange={(e) => updateField('noticeDescription', e.target.value)}
        placeholder="짧은 설명 (선택)…"
        name="noticeDescription"
        autoComplete="off"
        aria-label="공지 짧은 설명"
        className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      />
      <input
        value={form.noticeBadge}
        onChange={(e) => updateField('noticeBadge', e.target.value)}
        placeholder="배지 (예: 공지, 이벤트)…"
        name="noticeBadge"
        autoComplete="off"
        aria-label="공지 배지"
        className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      />
    </div>
  );
}

function NoticeList({
  notices,
  onDelete,
}: {
  notices: AdminHomeContentResponse['notices'];
  onDelete: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ul className="divide-y border border-gray-200">
      {notices.map((item) => (
        <li key={item.id} className="px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-600">
                {item.date} · {item.badge}
                {item.description && ` · ${item.description}`}
              </p>
              {item.content ? (
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  {expandedId === item.id ? '\u25BC 미리보기 닫기' : '\u25B6 미리보기 열기'}
                </button>
              ) : null}
            </div>
            <button
              onClick={() => onDelete(item.id)}
              aria-label={`공지 "${item.title}" 삭제`}
              className="text-red-600 text-sm hover:text-red-800 transition-colors shrink-0"
            >
              삭제
            </button>
          </div>
          {expandedId === item.id && item.content && (
            <div className="mt-2">
              <HtmlPreviewFrame html={item.content} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ── PlayDay Guide ── */

function GuideForm({
  form,
  updateField,
  onSubmit,
  submitting,
}: {
  form: FormState;
  updateField: (k: keyof FormState, v: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          value={form.guideTitle}
          onChange={(e) => updateField('guideTitle', e.target.value)}
          placeholder="안내 제목…"
          name="guideTitle"
          autoComplete="off"
          aria-label="안내 제목"
          className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
        />
        <input
          value={form.guideDescription}
          onChange={(e) => updateField('guideDescription', e.target.value)}
          placeholder="안내 설명…"
          name="guideDescription"
          autoComplete="off"
          aria-label="안내 설명"
          className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? '등록 중…' : '안내 등록'}
      </button>
    </div>
  );
}

function GuideList({
  guides,
  onDelete,
}: {
  guides: AdminHomeContentResponse['playdayGuides'];
  onDelete: (id: string) => void;
}) {
  return (
    <ul className="divide-y border border-gray-200">
      {guides.map((item) => (
        <li key={item.id} className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <button
            onClick={() => onDelete(item.id)}
            aria-label={`안내 "${item.title}" 삭제`}
            className="text-red-600 text-sm hover:text-red-800 transition-colors"
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ── Preview ── */

function HtmlPreviewFrame({ html }: { html: string }) {
  const [posterData, setPosterData] = useState<{ html: string; css: string } | null>(null);

  useEffect(() => {
    const { extractPosterEmbed } = require('@/lib/utils/poster-embed');
    setPosterData(extractPosterEmbed(html));
  }, [html]);

  const srcDoc = useMemo(() => {
    if (posterData) {
      const { buildPosterSrcDoc } = require('@/lib/utils/poster-embed');
      return buildPosterSrcDoc(posterData.html, posterData.css) as string;
    }
    const isFullPage =
      html.trim().toLowerCase().startsWith('<!doctype') ||
      html.trim().toLowerCase().startsWith('<html');
    return isFullPage
      ? html
      : `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>body{margin:0;padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}</style></head><body>${html}</body></html>`;
  }, [html, posterData]);

  return (
    <iframe
      srcDoc={srcDoc}
      title="배너 미리보기"
      sandbox="allow-same-origin"
      className="w-full border-t border-gray-200 bg-white"
      style={{ minHeight: 200, height: posterData ? 500 : 360 }}
    />
  );
}
