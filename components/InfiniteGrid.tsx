'use client';

import { useEffect, useRef } from 'react';
import { LANDING_CONFIG } from '@/config/landing';

/**
 * Infinite Grid Background Component
 * 
 * 무한히 스크롤되는 격자 배경과 마우스 인터랙션을 제공합니다.
 * - 격자가 천천히 이동하는 애니메이션
 * - 마우스 커서 주변에 spotlight 효과
 * - 좌하단-우상단 그라데이션
 */
export default function InfiniteGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas 크기를 화면에 맞게 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 마우스 이동 추적
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Grid 애니메이션
    let animationId: number;
    const animate = () => {
      if (!ctx || !canvas) return;

      // 캔버스 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid가 천천히 이동 (우하단 방향)
      offsetRef.current.x += 0.2;
      offsetRef.current.y += 0.2;
      if (offsetRef.current.x >= LANDING_CONFIG.grid.size) offsetRef.current.x = 0;
      if (offsetRef.current.y >= LANDING_CONFIG.grid.size) offsetRef.current.y = 0;

      const gridSize = LANDING_CONFIG.grid.size;
      const spotlightRadius = LANDING_CONFIG.grid.spotlightRadius;

      // 세로 선 그리기
      for (let x = -gridSize + offsetRef.current.x; x < canvas.width + gridSize; x += gridSize) {
        for (let y = -gridSize + offsetRef.current.y; y < canvas.height + gridSize; y += gridSize) {
          // 마우스와의 거리 계산
          const distance = Math.sqrt(
            Math.pow(x - mouseRef.current.x, 2) + 
            Math.pow(y - mouseRef.current.y, 2)
          );

          // Spotlight 효과: 마우스 주변은 더 진하게 (Sky Blue)
          let opacity = 0.2;
          if (distance < spotlightRadius) {
            const factor = 1 - (distance / spotlightRadius);
            opacity = 0.2 + (0.25 * factor);
          }

          // Sky Blue Grid 라인
          ctx.strokeStyle = `rgba(170, 202, 230, ${opacity})`;
          ctx.lineWidth = 1;

          // 세로선
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();

          // 가로선
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* 밝은 배경 */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 85% 15%, ${LANDING_CONFIG.gradient.topRight}, transparent 50%),
            radial-gradient(circle at 15% 85%, ${LANDING_CONFIG.gradient.bottomLeft}, transparent 50%),
            #FFFFFF
          `
        }}
      />
      
      {/* Grid Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ mixBlendMode: 'normal' }}
      />
    </>
  );
}
