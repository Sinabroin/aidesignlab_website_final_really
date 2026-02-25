/** 배너 상세 페이지 - 포스터 렌더링 + 댓글 */
'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { extractPosterEmbed, buildPosterSrcDoc } from '@/lib/utils/poster-embed';

interface BannerAttachment {
  name: string;
  type: string;
  size: number;
  data: string;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  content?: string;
  attachments?: BannerAttachment[];
  createdAt?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export default function BannerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/data/banner/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('배너를 찾을 수 없습니다'))))
      .then(setBanner)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error || !banner) return <ErrorView message={error} onBack={() => router.push('/')} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <button onClick={() => router.push('/')} className="mb-6 text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          홈으로 돌아가기
        </button>

        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <BannerHeader title={banner.title} description={banner.description} createdAt={banner.createdAt} />
          <BannerBody content={banner.content} title={banner.title} />
          {banner.attachments && banner.attachments.length > 0 && (
            <AttachmentsSection attachments={banner.attachments} />
          )}
        </article>

        <CommentsSection bannerId={id} />
      </div>
    </div>
  );
}

function BannerHeader({ title, description, createdAt }: { title: string; description: string; createdAt?: string }) {
  const dateStr = createdAt ? new Date(createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
  return (
    <div className="px-6 py-5 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>AI디자인랩</span>
        {dateStr && <span>{dateStr}</span>}
      </div>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
    </div>
  );
}

function BannerBody({ content, title }: { content?: string; title: string }) {
  const [posterData, setPosterData] = useState<{ html: string; css: string } | null>(null);
  const [iframeHeight, setIframeHeight] = useState(600);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setPosterData(extractPosterEmbed(content));
  }, [content]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'iframe-resize' && typeof e.data.height === 'number') {
        const h = Math.min(6000, Math.max(400, e.data.height + 40));
        setIframeHeight(h);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  if (!content) {
    return <div className="px-6 py-12 text-center text-gray-400">콘텐츠가 없습니다</div>;
  }

  const srcDoc = posterData
    ? buildPosterSrcDoc(posterData.html, posterData.css, { resize: true })
    : buildPosterSrcDoc(content, '', { resize: true });

  return (
    <div className="w-full">
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title={title}
        sandbox="allow-same-origin allow-popups allow-top-navigation allow-scripts"
        className="w-full border-0 bg-white"
        style={{ height: iframeHeight }}
        scrolling="no"
      />
    </div>
  );
}

function downloadBase64File(attachment: BannerAttachment) {
  const byteChars = atob(attachment.data);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
  const blob = new Blob([byteArray], { type: attachment.type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = attachment.name;
  a.click();
  URL.revokeObjectURL(url);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function AttachmentsSection({ attachments }: { attachments: BannerAttachment[] }) {
  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">첨부파일 ({attachments.length})</h3>
      <ul className="space-y-2">
        {attachments.map((att, i) => (
          <li key={i} className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <button
              onClick={() => downloadBase64File(att)}
              className="text-sm text-blue-600 hover:underline"
            >
              {att.name}
            </button>
            <span className="text-xs text-gray-400">{formatSize(att.size)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentsSection({ bannerId }: { bannerId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(() => {
    fetch(`/api/data/banner/${bannerId}/comments`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setComments)
      .catch(() => {});
  }, [bannerId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/data/banner/${bannerId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.status === 401) {
        alert('댓글을 작성하려면 로그인이 필요합니다.');
        return;
      }
      if (!res.ok) throw new Error('댓글 등록 실패');
      setNewComment('');
      fetchComments();
    } catch {
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">
          댓글 ({comments.length})
        </h2>
      </div>

      <CommentInput
        value={newComment}
        onChange={setNewComment}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <CommentList comments={comments} />
    </div>
  );
}

function CommentInput({ value, onChange, onSubmit, submitting }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex gap-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="댓글 내용을 입력하세요."
        rows={2}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSubmit();
        }}
      />
      <button
        onClick={onSubmit}
        disabled={submitting || !value.trim()}
        className="self-end px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? '등록 중...' : '등록'}
      </button>
    </div>
  );
}

function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-sm text-gray-400">
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {comments.map((c) => (
        <li key={c.id} className="px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800">{c.author}</span>
            <span className="text-xs text-gray-400">
              {new Date(c.createdAt).toLocaleString('ko-KR')}
            </span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
        </li>
      ))}
    </ul>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-400">로딩 중...</div>
    </div>
  );
}

function ErrorView({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-600">{message || '페이지를 불러올 수 없습니다.'}</p>
      <button onClick={onBack} className="text-sm text-blue-600 hover:underline">홈으로 돌아가기</button>
    </div>
  );
}
