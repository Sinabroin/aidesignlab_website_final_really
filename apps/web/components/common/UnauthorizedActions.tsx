'use client';

import Link from 'next/link';
import { GlowingEffect } from './GlowingEffect';

interface UnauthorizedActionsProps {
  next: string;
}

export default function UnauthorizedActions({ next }: UnauthorizedActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        href={next}
        prefetch={false}
        className="relative overflow-visible flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-normal tracking-tight rounded-none transition-all text-center"
      >
        <GlowingEffect
          disabled={false}
          spread={18}
          movementDuration={1.5}
          inactiveZone={0.35}
          borderWidth={2}
          proximity={12}
        />
        <span className="relative z-10">이전 페이지로</span>
      </Link>
      <Link
        href="/playground"
        prefetch={false}
        className="relative overflow-visible flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-normal tracking-tight rounded-none transition-colors text-center"
      >
        <GlowingEffect
          disabled={false}
          spread={18}
          movementDuration={1.5}
          inactiveZone={0.35}
          borderWidth={2}
          proximity={12}
        />
        <span className="relative z-10">Playground로</span>
      </Link>
    </div>
  );
}
