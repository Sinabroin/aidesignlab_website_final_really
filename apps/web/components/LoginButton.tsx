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
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"login-debug-1",hypothesisId:"L1-L4",location:"components/LoginButton.tsx:handleSubmit:start",message:"email signIn start",data:{emailDomain:normalized.split("@")[1]??null,hasCallbackUrl:!!nextUrl},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    try {
      const result = await signIn('email', { email: normalized, callbackUrl: nextUrl, redirect: true });
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"login-debug-1",hypothesisId:"L1-L4",location:"components/LoginButton.tsx:handleSubmit:result",message:"email signIn result",data:{resultType:typeof result,isNull:result===null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"login-debug-1",hypothesisId:"L1-L4",location:"components/LoginButton.tsx:handleSubmit:catch",message:"email signIn threw error",data:{errorName:error instanceof Error?error.name:"unknown",errorMessage:error instanceof Error?error.message:"unknown"},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setMessage('로그인 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
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
