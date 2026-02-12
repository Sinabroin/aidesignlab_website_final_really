'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 backdrop-blur-sm border-b z-50 ${
      isLanding 
        ? 'bg-white/80 border-gray-200' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">AI 디자인랩</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          <Link 
            href="/playground" 
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Playground
          </Link>
          <Link 
            href="/awards" 
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            ACE Gallery
          </Link>
          <Link 
            href="/playground" 
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            도와줘요 ACE
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
