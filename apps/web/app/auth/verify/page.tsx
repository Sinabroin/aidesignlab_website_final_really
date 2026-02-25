/** 매직 링크 중간 확인 페이지 — 보안 스캐너 토큰 소진 방지 */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const [callbackHref, setCallbackHref] = useState('');

  useEffect(() => {
    // JavaScript로 URL을 조합해야 보안 스캐너가 토큰 소진 불가
    const url = new URL('/api/auth/callback/email', window.location.origin);
    if (token) url.searchParams.set('token', token);
    if (email) url.searchParams.set('email', email);
    url.searchParams.set('callbackUrl', callbackUrl);
    setCallbackHref(url.toString());
  }, [token, email, callbackUrl]);

  const handleVerify = () => {
    if (callbackHref) window.location.href = callbackHref;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-none shadow-lg p-10 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-normal tracking-tight text-gray-900 mb-2">AI 디자인랩 로그인</h1>
          <p className="text-sm text-gray-500">
            {email ? (
              <><span className="font-medium text-gray-700">{email}</span>으로<br />인증 요청이 확인되었습니다.</>
            ) : '인증 요청이 확인되었습니다.'}
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={!callbackHref}
          className="w-full py-3 px-6 bg-gray-900 text-white font-normal tracking-tight rounded-none hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {callbackHref ? '본인 인증 완료하기' : '준비 중...'}
        </button>

        <p className="mt-4 text-xs text-gray-400">
          본인이 요청하지 않은 경우 이 페이지를 닫아주세요.
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
