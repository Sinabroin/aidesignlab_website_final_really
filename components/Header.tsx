'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GlowingEffect } from './common/GlowingEffect';
import LogoutButton from './common/LogoutButton';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLanding = pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 backdrop-blur-sm border-b z-50 ${
      isLanding 
        ? 'bg-white/80 border-gray-200' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-normal tracking-tight text-gray-900">AI 디자인랩</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          <Link 
            href="/playground" 
            prefetch={false}
            className="relative overflow-visible inline-block px-4 py-2 text-sm font-normal tracking-tight text-gray-900 hover:bg-gray-50 rounded-none transition-colors"
          >
            <GlowingEffect disabled={false} spread={14} movementDuration={1.5} inactiveZone={0.4} borderWidth={2} proximity={10} />
            <span className="relative z-10">Playground</span>
          </Link>
          <Link 
            href="/awards" 
            className="relative overflow-visible inline-block px-4 py-2 text-sm font-normal tracking-tight text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-none transition-colors"
          >
            <GlowingEffect disabled={false} spread={14} movementDuration={1.5} inactiveZone={0.4} borderWidth={2} proximity={10} />
            <span className="relative z-10">ACE Gallery</span>
          </Link>
          <Link 
            href="/playground" 
            prefetch={false}
            className="relative overflow-visible inline-block px-4 py-2 text-sm font-normal tracking-tight text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-none transition-colors"
          >
            <GlowingEffect disabled={false} spread={14} movementDuration={1.5} inactiveZone={0.4} borderWidth={2} proximity={10} />
            <span className="relative z-10">도와줘요 ACE</span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {status === 'authenticated' && session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">{session.user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <div className="relative overflow-visible w-9 h-9 rounded-none bg-gray-900 flex items-center justify-center text-white text-sm font-normal tracking-tight hover:bg-gray-800 transition-colors">
              <GlowingEffect disabled={false} spread={12} movementDuration={1.5} inactiveZone={0.45} borderWidth={2} proximity={8} />
              <span className="relative z-10">A</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
