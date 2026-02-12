/**
 * 랜딩 페이지 설정
 * 
 * 이 파일에서 랜딩 페이지의 모든 텍스트와 링크를 관리합니다.
 * 필요에 따라 이 파일만 수정하면 랜딩 페이지 내용이 변경됩니다.
 */

export const LANDING_CONFIG = {
  // 메인 타이틀
  title: "AI디자인랩",
  
  // 서브타이틀 (여러 줄)
  subtitle: {
    line1: "현대건설 워크이노베이션센터",
    line2: "AI디자인랩의 내부 플레이그라운드 & 지식 허브",
  },
  
  // 버튼 설정
  button: {
    text: "Enter HDEC AI Design Lab",
    url: "/playground", // PLAYGROUND 페이지로 이동
  },
  
  // 자동 리다이렉트 설정
  autoRedirect: {
    enabled: true,
    delay: 1500, // 1.5초 후 자동 이동 (밀리초)
    targetUrl: "/playground"
  },
  
  // 배경 그라데이션 색상 (Sky Blue & White 계열)
  gradient: {
    topRight: "rgba(170, 202, 230, 0.2)", // Sky Blue (우상단)
    bottomLeft: "rgba(0, 170, 210, 0.1)", // Active Blue (좌하단)
  },
  
  // Grid 설정
  grid: {
    size: 40, // Grid 셀 크기 (px)
    color: "rgba(170, 202, 230, 0.2)", // Grid 선 색상 (Sky Blue)
    highlightColor: "rgba(0, 170, 210, 0.3)", // 마우스 hover시 Grid 색상
    spotlightRadius: 200, // 마우스 주변 하이라이트 반경 (px)
  }
} as const;
