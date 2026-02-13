'use client';

import { signIn } from 'next-auth/react';

interface LoginButtonProps {
  callbackUrl: string;
}

export default function LoginButton({ callbackUrl }: LoginButtonProps) {
  const handleClick = () => {
    const url = callbackUrl.startsWith('http') ? callbackUrl : `${window.location.origin}${callbackUrl.startsWith('/') ? '' : '/'}${callbackUrl}`;
    signIn('azure-ad', { callbackUrl: url });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-normal tracking-tight rounded-none transition-colors shadow-lg hover:shadow-xl"
    >
      <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 23 23" fill="none">
        <path d="M0 0h11v11H0z" fill="#f25022" />
        <path d="M12 0h11v11H12z" fill="#7fba00" />
        <path d="M0 12h11v11H0z" fill="#00a4ef" />
        <path d="M12 12h11v11H12z" fill="#ffb900" />
      </svg>
      <span>Microsoft로 로그인</span>
    </button>
  );
}
