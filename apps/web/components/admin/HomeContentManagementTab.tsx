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
  bannerFitMode: string;
  noticeTitle: string;
  noticeBadge: string;
  guideTitle: string;
  guideDescription: string;
};

const initialFormState: FormState = {
  bannerTitle: '',
  bannerDescription: '',
  bannerContent: '',
  bannerHref: '',
  bannerFitMode: 'contain',
  noticeTitle: '',
  noticeBadge: '공지',
  guideTitle: '',
  guideDescription: '',
};

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.data.message ?? fallback;
  if (error instanceof Error) return error.message;
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
    setSubmitting(contentType);
    setError(null);
    try {
      if (contentType === 'banner') {
        await createAdminHomeContent('banner', {
          title: form.bannerTitle,
          description: form.bannerDescription,
          content: form.bannerContent,
          href: form.bannerHref,
          fitMode: form.bannerFitMode,
          attachments: bannerFiles.length > 0 ? bannerFiles : undefined,
        });
        setForm((prev) => ({
          ...prev,
          bannerTitle: '',
          bannerDescription: '',
          bannerContent: '',
          bannerHref: '',
          bannerFitMode: 'contain',
        }));
        setBannerFiles([]);
      } else if (contentType === 'notice') {
        await createAdminHomeContent('notice', {
          title: form.noticeTitle,
          badge: form.noticeBadge,
        });
        setForm((prev) => ({ ...prev, noticeTitle: '' }));
      } else {
        await createAdminHomeContent('playday-guide', {
          title: form.guideTitle,
          description: form.guideDescription,
        });
        setForm((prev) => ({ ...prev, guideTitle: '', guideDescription: '' }));
      }
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
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3">{error}</div>
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

function BannerMetaInputs({
  form,
  updateField,
}: {
  form: FormState;
  updateField: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
      <select
        value={form.bannerFitMode}
        onChange={(e) => updateField('bannerFitMode', e.target.value)}
        aria-label="이미지 표시 모드"
        className="px-3 py-2 border border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      >
        <option value="contain">Contain (블러 배경)</option>
        <option value="cover">Cover (꽉 채움)</option>
      </select>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={form.noticeTitle}
          onChange={(e) => updateField('noticeTitle', e.target.value)}
          placeholder="공지 제목…"
          name="noticeTitle"
          autoComplete="off"
          aria-label="공지 제목"
          className="px-3 py-2 border border-gray-300 md:col-span-2 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
        />
        <input
          value={form.noticeBadge}
          onChange={(e) => updateField('noticeBadge', e.target.value)}
          placeholder="배지(예: 공지, 이벤트)…"
          name="noticeBadge"
          autoComplete="off"
          aria-label="공지 배지"
          className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
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

function NoticeList({
  notices,
  onDelete,
}: {
  notices: AdminHomeContentResponse['notices'];
  onDelete: (id: string) => void;
}) {
  return (
    <ul className="divide-y border border-gray-200">
      {notices.map((item) => (
        <li key={item.id} className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">
              {item.date} · {item.badge}
            </p>
          </div>
          <button
            onClick={() => onDelete(item.id)}
            aria-label={`공지 "${item.title}" 삭제`}
            className="text-red-600 text-sm hover:text-red-800 transition-colors"
          >
            삭제
          </button>
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
