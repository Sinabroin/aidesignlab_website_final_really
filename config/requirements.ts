// 요구사항 정의

export interface Requirement {
  area: string;
  reqId: string;
  feature: string;
  description: string;
  type: '필수' | '선택';
  priority: '상' | '중' | '하';
  difficulty: '쉬움' | '보통' | '어려움';
  note?: string;
}

export const requirements: Requirement[] = [
  // Common
  { area: 'Common', reqId: 'REQ0.1', feature: '로그인/권한(Role)', description: '사내 로그인(SSO 우선). 역할 R1(전사)/R2(ACE)/R3(운영진) 부여. 메뉴 접근 + API 권한 강제', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'Common', reqId: 'REQ0.2', feature: '열람 범위 지정(운영진)', description: '운영진이 생성/편성하는 콘텐츠에 열람 범위 지정. 선택지 전사/ACE/운영진, 기본값 전사', type: '필수', priority: '상', difficulty: '보통', note: '적용: 배너(필수), 운영공지(선택)' },
  { area: 'Common', reqId: 'REQ0.3', feature: '보관 정책(5년)', description: '게시물/첨부/로그 5년 보관. 숨김/삭제는 운영 처리 + 감사 로그 유지', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'Common', reqId: 'REQ0.4', feature: '신고/숨김/삭제/제재', description: '신고 접수 → 운영진 처리(숨김/삭제/계정 제한). 숨김/삭제 시 즉시 접근/다운로드 차단', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'Common', reqId: 'REQ0.5', feature: '검색/필터', description: '태그 필터 + 키워드 검색(제목/설명). 권한 범위 내 결과만 노출', type: '필수', priority: '상', difficulty: '보통', note: 'HOME 통합검색은 Phase2' },
  
  // PlayDay
  { area: 'PlayDay', reqId: 'REQ3.1', feature: '회차 생성/종료', description: '운영진이 회차 생성/종료. 회차 목록/상세 제공. 종료 회차는 읽기 전용', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'PlayDay', reqId: 'REQ3.2', feature: '글쓰기 흐름', description: '회차 상세에서 업로드 → 타입 선택(쇼츠/게시물) → 작성폼 → 검증 → 미리보기 → 게시', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'PlayDay', reqId: 'REQ3.3', feature: '쇼츠 피드/스와이프', description: '쇼츠 탭: 피드 제공. 상세에서 좌우 스와이프로 이전/다음 이동', type: '필수', priority: '상', difficulty: '어려움' },
  
  // Admin
  { area: 'Admin', reqId: 'REQ6.1', feature: '운영진 콘솔', description: '권한/콘텐츠 관리, 신고 처리, 보관 정책 운영, 다운로드 로그 조회', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'Admin', reqId: 'REQ6.2', feature: 'HOME 대표작/배너 편성', description: '대표 Play Day/Playbook 선정·정렬·노출 수 설정. 배너 CRUD/기간/범위/핀 관리', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'Admin', reqId: 'REQ6.3', feature: '권한 관리', description: 'ACE/운영진 멤버 관리(추가/삭제/변경). 변경 즉시 권한 반영', type: '필수', priority: '상', difficulty: '보통' },
  { area: 'Admin', reqId: 'REQ6.4', feature: '회차 운영', description: 'Play Day 회차 생성/종료/노출 관리', type: '필수', priority: '중', difficulty: '보통' },
  { area: 'Admin', reqId: 'REQ6.5', feature: '감사/로그 조회', description: '다운로드 로그, 삭제/숨김 처리 로그 조회/필터/내보내기', type: '필수', priority: '중', difficulty: '보통' },
  { area: 'Admin', reqId: 'REQ6.6', feature: '태그 표준 관리', description: '태그 표준 세트 관리(추가/비활성/병합)', type: '선택', priority: '중', difficulty: '보통' },
  { area: 'Admin', reqId: 'REQ6.7', feature: '대시보드', description: 'HOME CTR, PlayDay 소비, Playbook 다운로드, 커뮤니티 활성 지표', type: '선택', priority: '중', difficulty: '보통' },
];
