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
  const [mode, setMode] = useState<'simple' | 'rich'>('simple');

  return (
    <div className="space-y-3">
      <div className="flex gap-2 border border-gray-300 w-fit">
        <ModeTab label="간편 입력" active={mode === 'simple'} onClick={() => setMode('simple')} />
        <ModeTab label="리치 에디터" active={mode === 'rich'} onClick={() => setMode('rich')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          value={form.bannerHref}
          onChange={(e) => updateField('bannerHref', e.target.value)}
          placeholder="연결 링크(선택)…"
          name="bannerHref"
          type="url"
          autoComplete="off"
          aria-label="배너 연결 링크"
          className="px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
        />
      </div>

      {mode === 'simple' ? (
        <input
          value={form.bannerDescription}
          onChange={(e) => updateField('bannerDescription', e.target.value)}
          placeholder="배너 설명 (텍스트)…"
          name="bannerDescription"
          autoComplete="off"
          aria-label="배너 설명"
          className="w-full px-3 py-2 border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
        />
      ) : (
        <div>
          <label className="block text-sm text-gray-600 mb-1">배너 콘텐츠 (HTML/이미지/텍스트 자유 입력)</label>
          <RichTextEditor
            content={form.bannerContent}
            onChange={onContentChange}
            placeholder="이미지, HTML, 텍스트를 자유롭게 입력하세요…"
            editable
            minHeight="160px"
          />
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? '등록 중\u2026' : '배너 등록'}
      </button>
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
  return (
    <ul className="divide-y border border-gray-200">
      {banners.map((item) => (
        <li key={item.id} className="px-4 py-3 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{item.title}</p>
            {item.content ? (
              <div className="mt-1 text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
            ) : (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>
          <button onClick={() => onDelete(item.id)} aria-label={`배너 "${item.title}" 삭제`} className="text-red-600 text-sm hover:text-red-800 transition-colors shrink-0">
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}

function ModeTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm transition-colors ${
        active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
