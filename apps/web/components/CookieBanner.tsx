'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('cookieConsent', 'closed');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 animate-slide-up"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-relaxed">
              이 웹사이트는 쿠키를 사용하여 더 나은 사용자 경험을 제공합니다.{' '}
              <a href="#" className="text-gray-900 hover:underline font-medium">
                자세히 알아보기
              </a>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-none"
              aria-label="Close cookie banner"
            >
              닫기
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-none hover:bg-gray-800 transition-colors"
              aria-label="Accept cookies"
            >
              수락
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
