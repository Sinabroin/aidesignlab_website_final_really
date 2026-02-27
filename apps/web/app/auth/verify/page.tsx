/** 매직링크 인증 완료 페이지 — 토큰 검증 후 NextAuth 세션 생성 */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type VerifyStatus = 'verifying' | 'success' | 'error';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerifyStatus>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    if (!token) {
      setStatus('error');
      setErrorMsg('유효하지 않은 링크입니다.');
      return;
    }

    verifyToken(token, callbackUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifyToken(token: string, callbackUrl: string) {
    try {
      const result = await signIn('magic-link', {
        token,
        redirect: false,
        callbackUrl,
      });

      if (result?.ok && !result.error) {
        setStatus('success');
        router.replace(callbackUrl);
      } else {
        setStatus('error');
        setErrorMsg('인증에 실패했습니다. 링크가 만료되었거나 이미 사용된 링크입니다.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('인증 처리 중 오류가 발생했습니다.');
    }
  }

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-10 max-w-md w-full text-center shadow-lg">
          <div className="animate-spin w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">인증 처리 중입니다...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 max-w-md w-full text-center shadow-lg">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-normal text-gray-900 mb-2">인증 실패</h1>
          <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
          <a href="/login" className="inline-block px-6 py-3 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors">
            로그인 페이지로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 max-w-md w-full text-center shadow-lg">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-gray-600">로그인 성공! 이동 중...</p>
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
