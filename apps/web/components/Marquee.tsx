'use client';

import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  direction = 'left',
  speed = 40,
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div
      className={`group overflow-hidden ${className}`}
    >
      <div
        className={pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `${animationName} ${speed}s linear infinite`,
        }}
      >
        {/* Original */}
        <div className="flex shrink-0 gap-6">{children}</div>
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0 gap-6" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
