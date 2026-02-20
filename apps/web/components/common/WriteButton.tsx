'use client';

import { GlowingEffect } from './GlowingEffect';

interface WriteButtonProps {
  onClick: () => void;
}

export default function WriteButton({ onClick }: WriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-visible flex items-center gap-2 bg-[#111] hover:bg-gray-800 text-white font-normal text-sm rounded-none px-5 py-2.5 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      <GlowingEffect
        disabled={false}
        spread={18}
        movementDuration={1.5}
        inactiveZone={0.35}
        borderWidth={3}
        proximity={12}
      />
      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="relative z-10">글쓰기</span>
    </button>
  );
}
