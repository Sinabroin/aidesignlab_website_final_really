// 앱 전체에서 사용되는 상수

export const COLORS = {
  primary: '#87CEEB',
  primaryLight: '#B0E0E6',
  primaryDark: '#77BED5',
  accent: '#4A90A4',
  accentDark: '#2C5F6F',
  background: '#E8F6F8',
  backgroundLight: '#D4EEF7',
  border: '#C1E7ED',
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
