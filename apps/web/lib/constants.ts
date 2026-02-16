// 앱 전체에서 사용되는 상수 (에디토리얼/미니멀 톤)

export const COLORS = {
  primary: '#171717',
  primaryLight: '#404040',
  primaryDark: '#0a0a0a',
  accent: '#525252',
  accentDark: '#262626',
  background: '#fafafa',
  backgroundLight: '#f5f5f5',
  border: '#e5e5e5',
} as const;

export const PRIORITY_COLORS = {
  상: 'bg-red-100 text-red-700',
  중: 'bg-yellow-100 text-yellow-700',
  하: 'bg-green-100 text-green-700',
} as const;

export const STATUS_COLORS = {
  필수: 'bg-red-100 text-red-700',
  선택: 'bg-blue-100 text-blue-700',
} as const;

export const DIFFICULTY_COLORS = {
  쉬움: 'bg-green-100 text-green-700',
  보통: 'bg-yellow-100 text-yellow-700',
  어려움: 'bg-red-100 text-red-700',
} as const;

export const USER_ROLES = {
  R1: '전사',
  R2: 'ACE',
  R3: '운영진',
} as const;
