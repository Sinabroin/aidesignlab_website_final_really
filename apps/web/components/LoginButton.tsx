'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

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
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeEmail(email);
    if (!isHdecEmail(normalized)) {
      setMessage(INVALID_DOMAIN_MESSAGE);
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    const nextUrl = resolveCallbackUrl(callbackUrl);
    await signIn('email', { email: normalized, callbackUrl: nextUrl, redirect: true });
    setIsSubmitting(false);
  };

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
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
