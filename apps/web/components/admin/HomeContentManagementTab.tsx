/** This component displays operator-only home content management UI. */
'use client';

import { useCallback, useEffect, useState } from 'react';
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
  loading: () => <div className="min-h-[160px] border border-gray-300 flex items-center justify-center text-gray-400">에디터 로딩 중\u2026</div>,
});

type FormState = {
  bannerTitle: string;
  bannerDescription: string;
  bannerContent: string;
  bannerHref: string;
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

export default function HomeContentManagementTab() {
  const [data, setData] = useState<AdminHomeContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<HomeContentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

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

  const handleCreate = async (contentType: HomeContentType) => {
    setSubmitting(contentType);
    setError(null);
    try {
      if (contentType === 'banner') {
        await createAdminHomeContent('banner', {
          title: form.bannerTitle,
          description: form.bannerDescription,
          content: form.bannerContent,
          href: form.bannerHref,
        });
        setForm((prev) => ({ ...prev, bannerTitle: '', bannerDescription: '', bannerContent: '', bannerHref: '' }));
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
  };

  const handleDelete = async (contentType: HomeContentType, id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setError(null);
    try {
      await deleteAdminHomeContent(contentType, id);
      await load();
    } catch (e) {
      setError(toErrorMessage(e, '콘텐츠를 삭제하지 못했습니다.'));
    }
  };

  if (loading) return <p className="text-gray-600">홈 콘텐츠를 불러오는 중\u2026</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">홈 콘텐츠 관리</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3">{error}</div>}

      <SectionCard title="배너 광고">
        <BannerForm
          form={form}
          updateField={updateField}
          onContentChange={(html) => updateField('bannerContent', html)}
          onSubmit={() => handleCreate('banner')}
          submitting={submitting === 'banner'}
        />
        <BannerList
          banners={data?.banners ?? []}
          onDelete={(id) => handleDelete('banner', id)}
        />
      </SectionCard>

      <SectionCard title="공지사항">
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
          onClick={() => handleCreate('notice')}
          disabled={submitting === 'notice'}
          className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting === 'notice' ? '등록 중\u2026' : '공지 등록'}
        </button>
        <ul className="divide-y border border-gray-200">
          {(data?.notices ?? []).map((item) => (
            <li key={item.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.date} · {item.badge}</p>
              </div>
              <button onClick={() => handleDelete('notice', item.id)} aria-label={`공지 "${item.title}" 삭제`} className="text-red-600 text-sm hover:text-red-800 transition-colors">
                삭제
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="PlayDay 안내">
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
          onClick={() => handleCreate('playday-guide')}
          disabled={submitting === 'playday-guide'}
          className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting === 'playday-guide' ? '등록 중\u2026' : '안내 등록'}
        </button>
        <ul className="divide-y border border-gray-200">
          {(data?.playdayGuides ?? []).map((item) => (
            <li key={item.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <button onClick={() => handleDelete('playday-guide', item.id)} aria-label={`안내 "${item.title}" 삭제`} className="text-red-600 text-sm hover:text-red-800 transition-colors">
                삭제
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

type BannerMode = 'simple' | 'rich' | 'html';

function BannerForm({
  form,
  updateField,
  onContentChange,
  onSubmit,
  submitting,
}: {
  form: FormState;
  updateField: (key: keyof FormState, value: string) => void;
  onContentChange: (html: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const [mode, setMode] = useState<BannerMode>('simple');
  const [showPreview, setShowPreview] = useState(false);

  const previewHtml = mode === 'html' ? form.bannerContent : mode === 'rich' ? form.bannerContent : '';

  return (
    <div className="space-y-3">
      <BannerModeTabs mode={mode} onModeChange={setMode} />
      <BannerMetaInputs form={form} updateField={updateField} />
      <BannerContentInput mode={mode} form={form} updateField={updateField} onContentChange={onContentChange} />

      {(mode === 'html' || mode === 'rich') && previewHtml && (
        <BannerPreviewToggle html={previewHtml} open={showPreview} onToggle={() => setShowPreview((p) => !p)} />
      )}

      <button onClick={onSubmit} disabled={submitting} className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50">
        {submitting ? '등록 중\u2026' : '배너 등록'}
      </button>
    </div>
  );
}

function BannerModeTabs({ mode, onModeChange }: { mode: BannerMode; onModeChange: (m: BannerMode) => void }) {
  const tabs: { key: BannerMode; label: string }[] = [
    { key: 'simple', label: '간편 입력' },
    { key: 'rich', label: '리치 에디터' },
    { key: 'html', label: 'HTML 소스' },
  ];
  return (
    <div className="flex border border-gray-300 w-fit">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onModeChange(t.key)}
          className={`px-4 py-2 text-sm transition-colors ${mode === t.key ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function BannerMetaInputs({ form, updateField }: { form: FormState; updateField: (k: keyof FormState, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input value={form.bannerTitle} onChange={(e) => updateField('bannerTitle', e.target.value)} placeholder="배너 제목\u2026" name="bannerTitle" autoComplete="off" aria-label="배너 제목" className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none" />
      <input value={form.bannerHref} onChange={(e) => updateField('bannerHref', e.target.value)} placeholder="연결 링크(선택)\u2026" name="bannerHref" type="url" autoComplete="off" aria-label="배너 연결 링크" className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none" />
    </div>
  );
}

function BannerContentInput({
  mode, form, updateField, onContentChange,
}: {
  mode: BannerMode; form: FormState; updateField: (k: keyof FormState, v: string) => void; onContentChange: (h: string) => void;
}) {
  if (mode === 'simple') {
    return (
      <input value={form.bannerDescription} onChange={(e) => updateField('bannerDescription', e.target.value)} placeholder="배너 설명 (텍스트)\u2026" name="bannerDescription" autoComplete="off" aria-label="배너 설명" className="w-full px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none" />
    );
  }
  if (mode === 'rich') {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">배너 콘텐츠 (서식/이미지 입력)</label>
        <RichTextEditor content={form.bannerContent} onChange={onContentChange} placeholder="이미지, 텍스트를 자유롭게 입력하세요\u2026" editable minHeight="160px" />
      </div>
    );
  }
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">HTML 소스 코드 직접 입력</label>
      <textarea
        value={form.bannerContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="<!DOCTYPE html>\n<html>\n<head>...</head>\n<body>...</body>\n</html>"
        name="bannerHtmlSource"
        aria-label="HTML 소스 코드"
        rows={12}
        className="w-full px-3 py-2 border border-gray-300 font-mono text-sm bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none resize-y"
        spellCheck={false}
      />
    </div>
  );
}

function BannerPreviewToggle({ html, open, onToggle }: { html: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
        <span>{open ? '\u25BC' : '\u25B6'} 미리보기</span>
      </button>
      {open && <HtmlPreviewFrame html={html} />}
    </div>
  );
}

function HtmlPreviewFrame({ html }: { html: string }) {
  const isFullPage = html.trim().toLowerCase().startsWith('<!doctype') || html.trim().toLowerCase().startsWith('<html');
  const srcDoc = isFullPage ? html : `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>body{margin:0;padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}</style></head><body>${html}</body></html>`;

  return (
    <iframe
      srcDoc={srcDoc}
      title="배너 미리보기"
      sandbox="allow-same-origin"
      className="w-full border-t border-gray-200 bg-white"
      style={{ minHeight: 200, height: 360 }}
    />
  );
}

function BannerList({ banners, onDelete }: { banners: AdminHomeContentResponse['banners']; onDelete: (id: string) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ul className="divide-y border border-gray-200">
      {banners.map((item) => (
        <li key={item.id} className="px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{item.title}</p>
              {item.content ? (
                <button type="button" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                  {expandedId === item.id ? '\u25BC 미리보기 닫기' : '\u25B6 미리보기 열기'}
                </button>
              ) : (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
            </div>
            <button onClick={() => onDelete(item.id)} aria-label={`배너 "${item.title}" 삭제`} className="text-red-600 text-sm hover:text-red-800 transition-colors shrink-0">삭제</button>
          </div>
          {expandedId === item.id && item.content && <div className="mt-2"><HtmlPreviewFrame html={item.content} /></div>}
        </li>
      ))}
    </ul>
  );
}
