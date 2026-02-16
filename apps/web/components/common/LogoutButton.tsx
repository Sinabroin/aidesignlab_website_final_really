'use client';

import { signOut } from 'next-auth/react';
import { GlowingEffect } from './GlowingEffect';

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="relative overflow-visible inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-none transition-colors text-sm font-normal tracking-tight"
    >
      <GlowingEffect
        disabled={false}
        spread={16}
        movementDuration={1.5}
        inactiveZone={0.35}
        borderWidth={2}
        proximity={12}
      />
      <span className="relative z-10">로그아웃</span>
    </button>
  );
}
