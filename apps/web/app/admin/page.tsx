'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContent } from '@/hooks/useData';
import type { GalleryItem } from '@/types';
import {
  getAllowlists,
  addToAllowlist,
  removeFromAllowlist,
  ApiError,
} from '@/lib/api/admin';
import HomeContentManagementTab from '@/components/admin/HomeContentManagementTab';
import AccessLogTab from '@/components/admin/AccessLogTab';

const FIXED_OPERATOR_EMAIL = '2501034@hdec.co.kr';

type AdminTab = 'dashboard' | 'permissions' | 'content' | 'rounds' | 'logs' | 'tags' | 'archive';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-6 sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">운영자 관리 콘솔</h1>
                <p className="text-white/70 text-sm">AI 디자인랩 통합 관리 시스템</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-none transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200 sticky top-[88px] z-30">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📊 대시보드', icon: '📊' },
              { id: 'archive', label: '📦 콘텐츠 아카이브', icon: '📦' },
              { id: 'permissions', label: '👥 권한 관리', icon: '👥' },
              { id: 'content', label: '📝 콘텐츠 관리', icon: '📝' },
              { id: 'rounds', label: '🎯 회차 운영', icon: '🎯' },
              { id: 'logs', label: '📋 로그 조회', icon: '📋' },
              { id: 'tags', label: '🏷️ 태그 관리', icon: '🏷️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-700 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'archive' && <ArchiveTab />}
        {activeTab === 'permissions' && <PermissionsTab />}
        {activeTab === 'content' && <ContentManagementTab />}
        {activeTab === 'rounds' && <RoundsManagementTab />}
        {activeTab === 'logs' && <LogsTab />}
        {activeTab === 'tags' && <TagsManagementTab />}
      </div>
    </div>
  );
}

// 대시보드 탭 (REQ6.7)
function DashboardTab() {
  const stats = [
    { label: 'HOME CTR', value: '12.5%', change: '+2.3%', trend: 'up' },
    { label: 'PlayDay 참여율', value: '68%', change: '+5.1%', trend: 'up' },
    { label: 'Playbook 다운로드', value: '234', change: '-3%', trend: 'down' },
    { label: 'ACE 활동 지표', value: '89', change: '+12%', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">통합 대시보드</h2>
      
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-none border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} {stat.trend === 'up' ? '↑' : '↓'}
            </div>
          </div>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-none border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h3>
        <div className="space-y-3">
          {[
            { action: 'PlayDay 3월 회차 생성', user: '운영진', time: '10분 전' },
            { action: '배너 "AI 트렌드 세미나" 게시', user: '운영진', time: '1시간 전' },
            { action: '신규 ACE 멤버 5명 추가', user: '운영진', time: '2시간 전' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-none">
              <div>
                <span className="font-semibold text-gray-900">{activity.action}</span>
                <span className="text-sm text-gray-600 ml-2">by {activity.user}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 권한 관리 탭 (REQ6.3) - 운영진·ACE 목록 API 연동
function PermissionsTab() {
  const [operators, setOperators] = useState<string[]>([]);
  const [community, setCommunity] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<'operator' | 'community'>('community');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchAllowlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllowlists();
      setOperators(data.operators ?? []);
      setCommunity(data.community ?? []);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.data.message || '목록을 불러올 수 없습니다.');
      } else {
        setError(e instanceof Error ? e.message : '목록을 불러올 수 없습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowlist();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = addEmail.trim().toLowerCase();
    if (!email) return;
    setAdding(true);
    try {
      await addToAllowlist({ email, role: addRole });
      setAddEmail('');
      await fetchAllowlist();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.data.message || '추가할 수 없습니다.');
      } else {
        setError(e instanceof Error ? e.message : '추가할 수 없습니다.');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (email: string, role: 'operator' | 'community') => {
    if (role === 'operator' && email === FIXED_OPERATOR_EMAIL) return;
    setRemoving(email);
    try {
      await removeFromAllowlist({ email, role });
      await fetchAllowlist();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.data.message || '제거할 수 없습니다.');
      } else {
        setError(e instanceof Error ? e.message : '제거할 수 없습니다.');
      }
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">권한 관리</h2>
        <p className="text-gray-600">목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">권한 관리</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-none">
          {error}
        </div>
      )}

      {/* 멤버 추가 */}
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-none border border-gray-200">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            type="email"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            placeholder="user@hdec.co.kr"
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm"
            required
          />
        </div>
        <div className="w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">권한</label>
          <select
            value={addRole}
            onChange={(e) => setAddRole(e.target.value as 'operator' | 'community')}
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm"
          >
            <option value="community">ACE 멤버</option>
            <option value="operator">운영진</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2 bg-gray-900 text-white rounded-none hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {adding ? '추가 중...' : '멤버 추가'}
        </button>
      </form>

      {/* 운영진 */}
      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <h3 className="px-6 py-3 bg-gray-50 text-sm font-semibold text-gray-900 border-b border-gray-200">
          운영진 (AI디자인랩 운영진)
        </h3>
        <ul className="divide-y divide-gray-200">
          {operators.length === 0 ? (
            <li className="px-6 py-4 text-sm text-gray-500">등록된 운영진이 없습니다.</li>
          ) : (
            operators.map((email) => (
              <li key={email} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <span className="text-sm text-gray-900">
                  {email}
                  {email === FIXED_OPERATOR_EMAIL && (
                    <span className="ml-2 text-xs text-gray-500">(고정 운영자)</span>
                  )}
                </span>
                {email === FIXED_OPERATOR_EMAIL ? (
                  <span className="text-xs text-gray-400">삭제 불가</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemove(email, 'operator')}
                    disabled={removing === email}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold disabled:opacity-50"
                  >
                    {removing === email ? '처리 중...' : '삭제'}
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ACE 멤버 */}
      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <h3 className="px-6 py-3 bg-gray-50 text-sm font-semibold text-gray-900 border-b border-gray-200">
          ACE 멤버 (30명)
        </h3>
        <ul className="divide-y divide-gray-200">
          {community.length === 0 ? (
            <li className="px-6 py-4 text-sm text-gray-500">등록된 ACE 멤버가 없습니다.</li>
          ) : (
            community.map((email) => (
              <li key={email} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <span className="text-sm text-gray-900">{email}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(email, 'community')}
                  disabled={removing === email}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold disabled:opacity-50"
                >
                  {removing === email ? '처리 중...' : '삭제'}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

// 콘텐츠 관리 탭 (REQ6.2)
function ContentManagementTab() {
  return <HomeContentManagementTab />;
}

// 회차 운영 탭 (REQ6.4)
function RoundsManagementTab() {
  const [rounds, setRounds] = useState([
    { id: 3, name: '3월 PlayDay', startDate: '2024.03.01', endDate: '2024.03.15', status: '진행중', participants: 45 },
    { id: 2, name: '2월 PlayDay', startDate: '2024.02.01', endDate: '2024.02.15', status: '종료', participants: 52 },
    { id: 1, name: '1월 PlayDay', startDate: '2024.01.01', endDate: '2024.01.15', status: '종료', participants: 38 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">PlayDay 회차 운영</h2>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 회차 생성
        </button>
      </div>

      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">회차</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">기간</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">참여자</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rounds.map((round) => (
              <tr key={round.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{round.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{round.startDate} ~ {round.endDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-none text-xs font-semibold ${
                    round.status === '진행중' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {round.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{round.participants}명</td>
                <td className="px-6 py-4">
                  {round.status === '진행중' ? (
                    <button className="text-sm text-red-600 hover:text-red-800 font-semibold">
                      회차 종료
                    </button>
                  ) : (
                    <button className="text-sm text-gray-400 cursor-not-allowed">
                      종료됨
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 로그 조회 탭 (REQ6.5)
function LogsTab() {
  const [logType, setLogType] = useState<'access' | 'download' | 'moderation'>('access');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">감사 로그</h2>
      <LogTypeSelector logType={logType} onChange={setLogType} />

      {logType === 'access' && <AccessLogTab />}
      {logType === 'download' && <DownloadLogTable />}
      {logType === 'moderation' && <ModerationLogTable />}

      <div className="flex justify-end">
        <LogExportButton />
      </div>
    </div>
  );
}

function LogTypeSelector({ logType, onChange }: { logType: string; onChange: (v: 'access' | 'download' | 'moderation') => void }) {
  const tabs = [
    { id: 'access' as const, label: '접속 로그', active: 'bg-emerald-600 text-white' },
    { id: 'download' as const, label: '다운로드 로그', active: 'bg-gray-900 text-white' },
    { id: 'moderation' as const, label: '삭제/숨김 로그', active: 'bg-gray-900 text-white' },
  ];

  return (
    <div className="flex gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-6 py-3 rounded-none font-semibold transition-all ${
            logType === tab.id ? tab.active : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface AuditLogEntry {
  id: string;
  email: string;
  userName: string | null;
  action: string;
  path: string | null;
  ipAddress: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

function useAuditLogs(actions: string) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ actions, page: String(page), size: '30' });
    fetch(`/api/admin/access-logs?${params}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actions, page]);

  return { logs, total, page, setPage, totalPages, loading };
}

function formatLogDate(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function DownloadLogTable() {
  const { logs, total, page, setPage, totalPages, loading } = useAuditLogs('download');

  if (loading) return <LogLoadingState text="다운로드 로그를 불러오는 중..." />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">총 <span className="font-bold text-gray-900">{total.toLocaleString()}</span>건</p>
      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">사용자</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">파일</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">섹션</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">일시</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">다운로드 기록이 없습니다.</td></tr>
            ) : logs.map((log) => (
              <DownloadLogRow key={log.id} log={log} />
            ))}
          </tbody>
        </table>
      </div>
      <LogPagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function DownloadLogRow({ log }: { log: AuditLogEntry }) {
  const fileName = (log.metadata?.fileName as string) ?? '-';
  const section = (log.metadata?.section as string) ?? '-';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm">
        <div className="font-medium text-gray-900">{log.userName ?? log.email.split('@')[0]}</div>
        <div className="text-xs text-gray-500">{log.email}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 max-w-[250px] truncate">{fileName}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-none">{section}</span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{formatLogDate(log.createdAt)}</td>
      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.ipAddress ?? '-'}</td>
    </tr>
  );
}

const MODERATION_ACTIONS = 'post_delete,post_edit,content_delete,content_hide,comment_delete';

const MODERATION_LABELS: Record<string, string> = {
  post_delete: '게시글 삭제',
  post_edit: '게시글 수정',
  content_delete: '콘텐츠 삭제',
  content_hide: '콘텐츠 숨김',
  comment_delete: '댓글 삭제',
};

const MODERATION_COLORS: Record<string, string> = {
  post_delete: 'bg-red-100 text-red-700',
  post_edit: 'bg-amber-100 text-amber-700',
  content_delete: 'bg-red-100 text-red-700',
  content_hide: 'bg-orange-100 text-orange-700',
  comment_delete: 'bg-red-100 text-red-700',
};

function ModerationLogTable() {
  const { logs, total, page, setPage, totalPages, loading } = useAuditLogs(MODERATION_ACTIONS);

  if (loading) return <LogLoadingState text="삭제/숨김 로그를 불러오는 중..." />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">총 <span className="font-bold text-gray-900">{total.toLocaleString()}</span>건</p>
      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">대상</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">실행자</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">일시</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">삭제/숨김 기록이 없습니다.</td></tr>
            ) : logs.map((log) => (
              <ModerationLogRow key={log.id} log={log} />
            ))}
          </tbody>
        </table>
      </div>
      <LogPagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function ModerationLogRow({ log }: { log: AuditLogEntry }) {
  const title = (log.metadata?.title as string) ?? (log.metadata?.contentType as string) ?? '-';
  const section = (log.metadata?.section as string) ?? (log.metadata?.contentType as string) ?? '';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs rounded-none font-semibold ${MODERATION_COLORS[log.action] ?? 'bg-gray-100 text-gray-700'}`}>
          {MODERATION_LABELS[log.action] ?? log.action}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-[250px] truncate">
        {title}
        {section && <span className="ml-2 text-xs text-gray-400">[{section}]</span>}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {log.userName ?? log.email.split('@')[0]}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{formatLogDate(log.createdAt)}</td>
      <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{log.ipAddress ?? '-'}</td>
    </tr>
  );
}

function LogPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-none hover:bg-gray-50 disabled:opacity-30">이전</button>
      <span className="text-sm text-gray-700 px-3">{page} / {totalPages}</span>
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-none hover:bg-gray-50 disabled:opacity-30">다음</button>
    </div>
  );
}

function LogLoadingState({ text }: { text: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-none p-8 text-center">
      <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full mx-auto mb-3" />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}

function LogExportButton() {
  return (
    <button className="px-4 py-2 border border-gray-300 rounded-none hover:bg-gray-50 transition-colors flex items-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      로그 내보내기
    </button>
  );
}

// 태그 관리 탭 (REQ6.6)
function TagsManagementTab() {
  const [tags, setTags] = useState([
    { id: 1, name: 'AI', usage: 45, status: '활성' },
    { id: 2, name: '이미지생성', usage: 32, status: '활성' },
    { id: 3, name: '프로필', usage: 28, status: '활성' },
    { id: 4, name: '구버전', usage: 5, status: '비활성' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">태그 표준 관리</h2>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 태그 추가
        </button>
      </div>

      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">태그명</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">사용 횟수</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-200 text-gray-900 rounded-none text-sm font-medium">
                    #{tag.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{tag.usage}회</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-none text-xs font-semibold ${
                    tag.status === '활성' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tag.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-sm text-gray-900 hover:text-gray-800 font-semibold">
                      {tag.status === '활성' ? '비활성화' : '활성화'}
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800 font-semibold">
                      병합
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-none">
        <p className="text-sm text-blue-900">
          <strong>참고:</strong> 비활성화된 태그는 신규 선택 불가하지만, 기존 콘텐츠에는 계속 표시됩니다.
        </p>
      </div>
    </div>
  );
}

// 콘텐츠 아카이브 탭
function ArchiveTab() {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'author'>('date');
  const { data: allContent = [], isLoading } = useAdminContent();

  // 필터링 및 정렬
  const filteredContent = useMemo(() => {
    let result = allContent;

    // 섹션 필터
    if (selectedSection !== 'all') {
      result = result.filter(item => item.section === selectedSection);
    }

    // 검색
    if (searchQuery) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.author.localeCompare(b.author);
      }
    });

    return result;
  }, [allContent, selectedSection, searchQuery, sortBy]);

  const sections = ['all', ...Array.from(new Set(allContent.map(item => item.section)))];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">콘텐츠 아카이브</h2>
        <p className="text-gray-600">목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">콘텐츠 아카이브</h2>
          <p className="text-sm text-gray-600 mt-1">
            전체 {allContent.length}개 · 필터링 결과 {filteredContent.length}개
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-none hover:bg-gray-50 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            내보내기
          </button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-none border border-gray-200 p-6 space-y-4">
        {/* 섹션 필터 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">섹션</label>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`px-4 py-2 rounded-none text-sm font-semibold transition-all ${
                  selectedSection === section
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section === 'all' ? '전체' : section}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 및 정렬 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">검색</label>
            <input
              type="text"
              placeholder="제목, 작성자, 설명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">정렬</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'author')}
              className="px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900"
            >
              <option value="date">최신순</option>
              <option value="author">작성자순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 콘텐츠 목록 */}
      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">섹션</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">제목</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작성자</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">날짜</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">카테고리</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">첨부</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContent.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filteredContent.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-200 text-gray-900 rounded-none text-xs font-semibold">
                      {item.section}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-none text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.attachments && item.attachments.length > 0 ? (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {item.attachments.length}개
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-sm text-gray-900 hover:text-gray-800 font-semibold">
                        보기
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-800 font-semibold">
                        숨김
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800 font-semibold">
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 태그 분석 */}
      {filteredContent.length > 0 && (
        <div className="bg-white rounded-none border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">태그 분석</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(
              new Set(
                filteredContent
                  .flatMap(item => item.tags || [])
                  .filter(Boolean)
              )
            ).map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-200 text-gray-900 rounded-none text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
