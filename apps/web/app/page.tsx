'use client';

import { useEffect, useState } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { AuroraBackground } from '@/components/AuroraBackground';
import { TypewriterSimple } from '@/components/TypewriterSimple';

/**
 * 메인 랜딩 페이지
 * 
 * Aurora 배경 효과 + Typewriter 효과의 랜딩 페이지입니다.
 * 텍스트가 한 글자씩 타이핑되고, Enter 버튼이 뜨면 클릭하여 Playground로 이동합니다.
 */
export default function Home() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  // Phase 0 완료 → Phase 1로
  const handlePhase0Complete = () => {
    setTimeout(() => {
      setCurrentPhase(1);
    }, 500);
  };

  // Phase 1 완료 → Phase 2로
  const handlePhase1Complete = () => {
    setTimeout(() => {
      setCurrentPhase(2);
      setShowButton(true);
    }, 500);
  };

  // Enter 버튼 클릭 시에만 이동 (자동 리다이렉트 제거)
  const handleEnterClick = () => {
    setButtonPressed(true);
    window.location.href = '/playground';
  };

  return (
    <div className="relative">
      <AuroraBackground>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            {/* Typewriter 텍스트 */}
            <div className="space-y-6 min-h-[200px] flex flex-col items-center justify-center">
              {currentPhase === 0 && (
                <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-gray-900 tracking-tight">
                  <TypewriterSimple 
                    text="Welcome to HDEC AI Design Lab"
                    speed={80}
                    onComplete={handlePhase0Complete}
                  />
                </h1>
              )}
              
              {currentPhase === 1 && (
                <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-gray-900 tracking-tight">
                  <TypewriterSimple 
                    text="Connect your work to AI"
                    speed={80}
                    onComplete={handlePhase1Complete}
                  />
                </h1>
              )}

              {currentPhase === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h1 className="text-5xl md:text-7xl font-normal tracking-tight text-gray-900 tracking-tight">
                    AI Design Lab
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-700 font-normal tracking-tight">
                    현대건설 워크이노베이션센터
                  </p>
                </div>
              )}
            </div>
            
            {/* 자동 클릭 버튼 */}
            {showButton && (
              <div className="pt-8 animate-fade-in">
                <button
                  type="button"
                  onClick={handleEnterClick}
                  className={`
                    relative overflow-visible inline-flex items-center justify-center px-10 py-4 cursor-pointer
                    text-lg md:text-xl font-normal tracking-tight text-white 
                    bg-gray-900 hover:bg-gray-800
                    rounded-none shadow-2xl
                    transition-all duration-300 transform
                    ${buttonPressed 
                      ? 'scale-95 shadow-lg opacity-80' 
                      : 'scale-100 hover:scale-105 animate-pulse'
                    }
                  `}
                >
                  <GlowingEffect disabled={false} spread={24} movementDuration={1.5} inactiveZone={0.25} borderWidth={3} proximity={20} />
                  <span className="relative z-10 mr-2">Enter</span>
                  <svg 
                    className={`relative z-10 w-6 h-6 transition-transform duration-300 ${buttonPressed ? 'translate-x-2' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* 진행 인디케이터 */}
            <div className="pt-12">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  <div 
                    className="w-2 h-2 rounded-none bg-gray-900"
                    style={{
                      animation: 'bounce 1s infinite',
                      animationDelay: '0ms'
                    }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-none bg-gray-600"
                    style={{
                      animation: 'bounce 1s infinite',
                      animationDelay: '200ms'
                    }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-none bg-gray-400"
                    style={{
                      animation: 'bounce 1s infinite',
                      animationDelay: '400ms'
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 font-normal tracking-tight">
                  {currentPhase === 0 && 'Initializing...'}
                  {currentPhase === 1 && 'Loading...'}
                  {currentPhase === 2 && !buttonPressed && 'Ready'}
                  {buttonPressed && 'Entering...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AuroraBackground>
      
      {/* 안내 메시지 - Enter 버튼이 뜨면 클릭하여 진행 */}
      {showButton && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <p className="text-sm text-gray-500 font-normal tracking-tight bg-white/80 backdrop-blur-sm px-4 py-2 rounded-none shadow-lg">
            Enter 버튼을 클릭하여 시작하세요
          </p>
        </div>
      )}
    </div>
  );
}
