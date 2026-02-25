/** 사용자 접속·활동을 서버에 자동으로 기록하는 훅 */
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type LogAction = 'page_view' | 'login' | 'logout' | 'download' | 'click';

const HEARTBEAT_INTERVAL_MS = 3 * 60 * 1000;

async function sendLog(action: LogAction, path?: string, metadata?: Record<string, unknown>) {
  try {
    await fetch('/api/data/access-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, path, metadata }),
    });
  } catch {
    // 로그 실패는 사용자 경험에 영향을 주지 않음
  }
}

export function useActivityTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pathname && pathname !== lastPath.current) {
      lastPath.current = pathname;
      sendLog('page_view', pathname);
    }
  }, [pathname]);

  useEffect(() => {
    heartbeatRef.current = setInterval(() => {
      sendLog('page_view', pathname ?? '/', { heartbeat: true });
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [pathname]);

  const trackClick = useCallback((label: string, extra?: Record<string, unknown>) => {
    sendLog('click', pathname ?? undefined, { label, ...extra });
  }, [pathname]);

  const trackDownload = useCallback((fileName: string, extra?: Record<string, unknown>) => {
    sendLog('download', pathname ?? undefined, { fileName, ...extra });
  }, [pathname]);

  return { trackClick, trackDownload };
}
