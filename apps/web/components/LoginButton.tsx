'use client';

import { FormEvent, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  callbackUrl: string;
}

const INVALID_DOMAIN_MESSAGE = '현대건설 사내 이메일만 사용 가능합니다';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isHdecEmail(email: string): boolean {
  return normalizeEmail(email).endsWith('@hdec.co.kr');
}

function resolveCallbackUrl(callbackUrl: string): string {
  if (callbackUrl.startsWith('http')) return callbackUrl;
  if (typeof window === 'undefined') return callbackUrl;
  const suffix = callbackUrl.startsWith('/') ? callbackUrl : `/${callbackUrl}`;
  return `${window.location.origin}${suffix}`;
}

export default function LoginButton({ callbackUrl }: LoginButtonProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl.startsWith('http') ? new URL(callbackUrl).pathname : callbackUrl);
    }
  }, [status, callbackUrl, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeEmail(email);
    if (!isHdecEmail(normalized)) {
      setErrorMessage(INVALID_DOMAIN_MESSAGE);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const nextUrl = resolveCallbackUrl(callbackUrl);
    try {
      const result = await signIn('email', { email: normalized, callbackUrl: nextUrl, redirect: false });
      if (result?.error) {
        setErrorMessage('로그인 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setLinkSent(true);
      }
    } catch {
      setErrorMessage('로그인 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    setIsSubmitting(false);
  };

  if (linkSent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">📬</div>
        <p className="text-gray-800 font-normal">
          인증 링크를 <strong>{email}</strong>로 보냈습니다.
        </p>
        <p className="text-sm text-gray-500">
          메일함을 확인하고 링크를 클릭하면 자동으로 로그인됩니다.
        </p>
        <button
          onClick={() => { setLinkSent(false); setEmail(''); }}
          className="text-xs text-gray-400 underline hover:text-gray-600"
        >
          다른 이메일로 다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="사내 이메일 주소를 입력하세요"
        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
        autoComplete="email"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-normal tracking-tight transition-colors disabled:opacity-50"
      >
        {isSubmitting ? '전송 중...' : '인증 링크 받기'}
      </button>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  );
}
