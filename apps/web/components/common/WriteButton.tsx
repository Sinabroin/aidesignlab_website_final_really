'use client';

import { GlowingEffect } from './GlowingEffect';

interface WriteButtonProps {
  onClick: () => void;
}

export default function WriteButton({ onClick }: WriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-visible flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-normal tracking-tight rounded-none transition-all shadow-lg hover:shadow-xl"
    >
      <GlowingEffect
        disabled={false}
        spread={20}
        movementDuration={1.5}
        inactiveZone={0.3}
        borderWidth={2}
        proximity={15}
      />
      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="relative z-10">글쓰기</span>
    </button>
  );
}
