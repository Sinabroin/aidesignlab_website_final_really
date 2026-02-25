/** 전역 사용자 활동 추적 프로바이더 (페이지 이동 자동 기록) */
'use client';

import { useActivityTracker } from '@/hooks/useActivityTracker';

export default function ActivityTracker() {
  useActivityTracker();
  return null;
}
