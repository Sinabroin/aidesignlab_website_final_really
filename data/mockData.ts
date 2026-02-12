export interface GalleryItem {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  fullDescription?: string;
  tags?: string[];
  attachments?: {
    name: string;
    url: string;
    size: string;
    type: string;
  }[];
  session?: number;
}

// PlayDay 데이터
export const playdayData: GalleryItem[] = [
  {
    title: "AI 프로필 만들기 - 3월",
    description: "Midjourney를 활용한 프로필 이미지 생성",
    author: "김지수",
    date: "2024.03.15",
    category: "Workshop",
    session: 3,
    fullDescription: "Midjourney를 활용하여 나만의 AI 프로필 이미지를 생성했습니다. 프롬프트 엔지니어링 기법을 적용하여 원하는 스타일의 이미지를 얻을 수 있었습니다.",
    tags: ["AI", "이미지생성", "프로필"],
    attachments: [
      { name: "프로필_가이드.pdf", url: "#", size: "2.5MB", type: "pdf" }
    ]
  },
  {
    title: "데이터 시각화 with AI",
    description: "Python과 AI를 활용한 자동 차트 생성",
    author: "박민준",
    date: "2024.03.10",
    category: "Data",
    session: 3,
    fullDescription: "Python의 데이터 시각화 라이브러리와 AI를 결합하여 자동으로 인사이트를 도출하고 차트를 생성하는 시스템을 구축했습니다.",
    tags: ["데이터분석", "Python", "시각화"],
    attachments: []
  }
];

// PlayBook 데이터
export const playbookUsecases: GalleryItem[] = [
  {
    title: "계약서 분석 자동화",
    description: "GPT-4를 활용한 계약서 주요 조항 추출",
    author: "ACE팀",
    date: "2024.02.20",
    category: "Usecase",
    fullDescription: "GPT-4 API를 활용하여 PDF 계약서에서 주요 조항을 자동으로 추출하고 요약하는 시스템을 구축했습니다.",
    tags: ["문서분석", "GPT-4", "자동화"],
    attachments: [
      { name: "계약서_분석_가이드.pdf", url: "#", size: "3.2MB", type: "pdf" },
      { name: "샘플_코드.zip", url: "#", size: "1.1MB", type: "zip" }
    ]
  }
];

export const playbookTrends: GalleryItem[] = [
  {
    title: "2024 AI 트렌드",
    description: "올해 주목해야 할 AI 기술 동향",
    author: "ACE팀",
    date: "2024.02.15",
    category: "Trend",
    fullDescription: "2024년 주목해야 할 AI 기술 트렌드를 정리했습니다. Multimodal AI, AI Agent, Edge AI 등이 주요 키워드입니다.",
    tags: ["트렌드", "AI", "기술동향"],
    attachments: []
  }
];

export const playbookPrompts: GalleryItem[] = [
  {
    title: "효과적인 프롬프트 작성법",
    description: "AI로부터 원하는 답변을 얻는 방법",
    author: "ACE팀",
    date: "2024.02.10",
    category: "Prompt",
    fullDescription: "AI로부터 정확하고 유용한 답변을 얻기 위한 프롬프트 작성 기법을 소개합니다.",
    tags: ["프롬프트", "ChatGPT", "기법"],
    attachments: []
  }
];

export const playbookHAI: GalleryItem[] = [
  {
    title: "Human-AI 협업 사례",
    description: "AI와 사람이 함께 일하는 방법",
    author: "ACE팀",
    date: "2024.02.05",
    category: "HAI",
    fullDescription: "Human-AI Interaction의 다양한 사례를 통해 효과적인 협업 방법을 알아봅니다.",
    tags: ["HAI", "협업", "사례연구"],
    attachments: []
  }
];

export const playbookTeams: GalleryItem[] = [
  {
    title: "팀 협업 AI 도구",
    description: "팀 생산성을 높이는 AI 도구 소개",
    author: "ACE팀",
    date: "2024.02.12",
    category: "Teams",
    fullDescription: "팀 협업에 활용할 수 있는 다양한 AI 도구를 소개합니다. Notion AI, Slack AI, 그리고 협업 프롬프트 템플릿 등을 다룹니다.",
    tags: ["Teams", "협업도구", "생산성"],
    attachments: [
      { name: "협업_도구_가이드.pdf", url: "#", size: "2.8MB", type: "pdf" }
    ]
  },
  {
    title: "AI 기반 프로젝트 관리",
    description: "AI로 프로젝트 관리 효율화하기",
    author: "ACE팀",
    date: "2024.02.08",
    category: "Teams",
    fullDescription: "AI를 활용하여 프로젝트 일정, 리소스, 리스크를 자동으로 관리하는 방법을 소개합니다.",
    tags: ["프로젝트관리", "Teams", "효율화"],
    attachments: []
  }
];

// ACE 커뮤니티 데이터
export const activityData: GalleryItem[] = [
  {
    title: "안전 점검 자동화 시스템",
    description: "AI 비전을 활용한 작업장 안전 모니터링",
    author: "이서연",
    date: "2024.02.18",
    category: "Safety",
    fullDescription: "컴퓨터 비전 AI를 활용하여 작업장의 안전 상태를 실시간으로 모니터링하는 시스템을 개발했습니다.",
    tags: ["안전", "컴퓨터비전", "모니터링"],
    attachments: []
  },
  {
    title: "프로젝트 일정 최적화",
    description: "AI 기반 프로젝트 완료 시점 예측",
    author: "최준호",
    date: "2024.02.15",
    category: "Planning",
    fullDescription: "과거 프로젝트 데이터를 학습한 AI 모델로 신규 프로젝트의 완료 시점을 예측합니다.",
    tags: ["일정관리", "예측", "최적화"],
    attachments: []
  }
];

export const notices = [
  {
    title: "[중요] AI 디자인랩 이용 안내",
    date: "2024.02.09",
    badge: "필독",
    badgeColor: "bg-[#87CEEB]"
  },
  {
    title: "PlayDay 3월 일정 공지",
    date: "2024.02.08",
    badge: "공지",
    badgeColor: "bg-[#B0E0E6]"
  },
  {
    title: "ACE 2기 모집 안내",
    date: "2024.02.07",
    badge: "모집",
    badgeColor: "bg-[#C1E7ED]"
  },
  {
    title: "AI 윤리 가이드라인 업데이트",
    date: "2024.02.05",
    badge: "공지",
    badgeColor: "bg-[#B0E0E6]"
  },
  {
    title: "새로운 AI 도구 추가 안내",
    date: "2024.02.03",
    badge: "공지",
    badgeColor: "bg-[#B0E0E6]"
  },
  {
    title: "2월 정기 점검 일정 안내",
    date: "2024.02.01",
    badge: "공지",
    badgeColor: "bg-[#B0E0E6]"
  },
  {
    title: "AI 프롬프트 경진대회 개최",
    date: "2024.01.28",
    badge: "이벤트",
    badgeColor: "bg-[#C1E7ED]"
  },
  {
    title: "1월 우수 활용 사례 선정 결과",
    date: "2024.01.25",
    badge: "공지",
    badgeColor: "bg-[#B0E0E6]"
  }
];

export const schedules = [
  { date: "2/10 (월)", event: "PlayDay 준비 회의" },
  { date: "2/12 (수)", event: "AI 트렌드 세미나" },
  { date: "2/14 (금)", event: "ACE 정기 모임" }
];

export const quickLinks = [
  { text: "AI 도구 가이드", href: "#" },
  { text: "프롬프트 작성 팁", href: "#" },
  { text: "FAQ (자주 묻는 질문)", href: "#" },
  { text: "문의하기", href: "#" }
];
