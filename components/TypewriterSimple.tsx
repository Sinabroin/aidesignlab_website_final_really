'use client';

import { useState, useEffect } from 'react';

interface TypewriterSimpleProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

/**
 * 간단한 Typewriter 효과 컴포넌트
 * 한 글자씩 타이핑되는 효과를 제공합니다.
 */
export function TypewriterSimple({ 
  text, 
  speed = 80,
  onComplete 
}: TypewriterSimpleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      // 타이핑 완료
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
