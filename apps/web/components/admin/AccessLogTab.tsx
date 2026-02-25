/** 관리자 접속 로그 탭 — 실시간 접속자 + 활동 이력 조회 */
'use client';

import { useState, useEffect, useCallback } from 'react';

const ACTION_LABELS: Record<string, string> = {
  page_view: '페이지 조회',
  login: '로그인',
  logout: '로그아웃',
  download: '다운로드',
  click: '클릭',
};

const ACTION_COLORS: Record<string, string> = {
  page_view: 'bg-blue-100 text-blue-700',
  login: 'bg-green-100 text-green-700',
  logout: 'bg-gray-100 text-gray-700',
  download: 'bg-purple-100 text-purple-700',
  click: 'bg-amber-100 text-amber-700',
};

interface OnlineUser {
  email: string;
  userName: string | null;
  lastAction: string;
  lastPath: string | null;
  lastSeen: string;
  ipAddress: string | null;
}

interface AccessLogEntry {
  id: string;
  email: string;
  userName: string | null;
  action: string;
  path: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface LogsResponse {
  logs: AccessLogEntry[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

interface OnlineResponse {
  onlineUsers: OnlineUser[];
  totalOnline: number;
}

const REFRESH_INTERVAL_MS = 15_000;

export default function AccessLogTab() {
  const [subTab, setSubTab] = useState<'online' | 'history'>('online');

  return (
    <div className="space-y-6">
      <SubTabSelector subTab={subTab} onChange={setSubTab} />
      {subTab === 'online' ? <OnlineUsersPanel /> : <AccessLogHistory />}
    </div>
  );
}

function SubTabSelector({ subTab, onChange }: { subTab: string; onChange: (v: 'online' | 'history') => void }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange('online')}
        className={`px-5 py-2.5 rounded-none font-semibold text-sm transition-all ${
          subTab === 'online' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
        }`}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
        실시간 접속자
      </button>
      <button
        onClick={() => onChange('history')}
        className={`px-5 py-2.5 rounded-none font-semibold text-sm transition-all ${
          subTab === 'history' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700'
        }`}
      >
        접속 이력
      </button>
    </div>
  );
}

function OnlineUsersPanel() {
  const [data, setData] = useState<OnlineResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOnline = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/access-logs?mode=online');
      if (res.ok) setData(await res.json());
    } catch { /* 실패 시 마지막 데이터 유지 */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOnline();
    const timer = setInterval(fetchOnline, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchOnline]);

  if (loading) return <LoadingPlaceholder text="접속자 정보를 불러오는 중..." />;

  return (
    <div className="space-y-4">
      <OnlineHeader total={data?.totalOnline ?? 0} />
      <OnlineUserGrid users={data?.onlineUsers ?? []} />
    </div>
  );
}

function OnlineHeader({ total }: { total: number }) {
  return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-none">
      <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-emerald-900 font-bold text-lg">{total}명</span>
      <span className="text-emerald-700 text-sm">현재 접속 중 (최근 5분 기준)</span>
      <span className="ml-auto text-xs text-emerald-600">15초마다 자동 갱신</span>
    </div>
  );
}

function OnlineUserGrid({ users }: { users: OnlineUser[] }) {
  if (users.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-none p-8 text-center text-gray-500">
        현재 접속 중인 사용자가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <OnlineUserCard key={user.email} user={user} />
      ))}
    </div>
  );
}

function OnlineUserCard({ user }: { user: OnlineUser }) {
  const timeDiff = getTimeDiffText(user.lastSeen);

  return (
    <div className="bg-white border border-gray-200 rounded-none p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-emerald-700 font-bold text-sm">
            {(user.userName ?? user.email)[0]?.toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {user.userName ?? user.email.split('@')[0]}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-none font-medium ${ACTION_COLORS[user.lastAction] ?? 'bg-gray-100 text-gray-700'}`}>
              {ACTION_LABELS[user.lastAction] ?? user.lastAction}
            </span>
            <span className="text-gray-400">{timeDiff}</span>
          </div>
          {user.lastPath && (
            <p className="mt-1 text-xs text-gray-400 font-mono truncate">{user.lastPath}</p>
          )}
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}

function AccessLogHistory() {
  const [logs, setLogs] = useState<AccessLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', email: '', dateFrom: '', dateTo: '' });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: '30' });
      if (filters.action) params.set('action', filters.action);
      if (filters.email) params.set('email', filters.email);
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);

      const res = await fetch(`/api/admin/access-logs?${params}`);
      if (res.ok) {
        const data: LogsResponse = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch { /* 조회 실패 */ }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="space-y-4">
      <LogFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
      <LogSummaryBar total={total} loading={loading} onRefresh={fetchLogs} />
      {loading ? (
        <LoadingPlaceholder text="로그를 불러오는 중..." />
      ) : (
        <>
          <LogTable logs={logs} />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

interface FilterState {
  action: string;
  email: string;
  dateFrom: string;
  dateTo: string;
}

function LogFilters({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-none p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">행동 유형</label>
          <select
            value={filters.action}
            onChange={(e) => onChange({ ...filters, action: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm"
          >
            <option value="">전체</option>
            {Object.entries(ACTION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">이메일 검색</label>
          <input
            type="text"
            value={filters.email}
            onChange={(e) => onChange({ ...filters, email: e.target.value })}
            placeholder="user@hdec.co.kr"
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">시작일</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">종료일</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function LogSummaryBar({ total, loading, onRefresh }: { total: number; loading: boolean; onRefresh: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        총 <span className="font-bold text-gray-900">{total.toLocaleString()}</span>건
      </p>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-none hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
      >
        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        새로고침
      </button>
    </div>
  );
}

function LogTable({ logs }: { logs: AccessLogEntry[] }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-none p-8 text-center text-gray-500">
        조건에 맞는 로그가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-none overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">사용자</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">행동</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">경로</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">IP</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">브라우저</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">일시</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogRow({ log }: { log: AccessLogEntry }) {
  return (
    <tr className="hover:bg-gray-50 text-sm">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{log.userName ?? log.email.split('@')[0]}</div>
        <div className="text-xs text-gray-500">{log.email}</div>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-none text-xs font-semibold ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-700'}`}>
          {ACTION_LABELS[log.action] ?? log.action}
        </span>
        {log.metadata && <MetadataInfo metadata={log.metadata} />}
      </td>
      <td className="px-4 py-3 text-gray-600 font-mono text-xs max-w-[200px] truncate">
        {log.path ?? '-'}
      </td>
      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.ipAddress ?? '-'}</td>
      <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">
        {parseBrowserName(log.userAgent)}
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
        {formatDateTime(log.createdAt)}
      </td>
    </tr>
  );
}

function MetadataInfo({ metadata }: { metadata: Record<string, unknown> }) {
  const label = metadata.label || metadata.fileName;
  if (!label) return null;
  return <span className="ml-1.5 text-xs text-gray-500">({String(label)})</span>;
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-none hover:bg-gray-50 disabled:opacity-30"
      >
        이전
      </button>
      <span className="text-sm text-gray-700 px-3">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-none hover:bg-gray-50 disabled:opacity-30"
      >
        다음
      </button>
    </div>
  );
}

function LoadingPlaceholder({ text }: { text: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-none p-8 text-center">
      <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full mx-auto mb-3" />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}

function getTimeDiffText(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}초 전`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}분 전`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function parseBrowserName(ua: string | null): string {
  if (!ua) return '-';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Other';
}
