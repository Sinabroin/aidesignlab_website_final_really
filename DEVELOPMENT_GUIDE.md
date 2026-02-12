# 개발 가이드

이 문서는 AI Design Lab 플랫폼을 개발할 때 참고하는 실전 가이드입니다.

## 🎯 개발 원칙

### 1. **DRY (Don't Repeat Yourself)**
중복 코드를 발견하면 즉시 컴포넌트나 함수로 추출합니다.

**나쁜 예:**
```tsx
// PlayBookSection.tsx
<button className="px-4 py-2 rounded-lg bg-[#87CEEB] text-white">...</button>

// PlayDaySection.tsx  
<button className="px-4 py-2 rounded-lg bg-[#87CEEB] text-white">...</button>
```

**좋은 예:**
```tsx
// components/common/TabButton.tsx
export function TabButton({ children }: { children: ReactNode }) {
  return (
    <button className="px-4 py-2 rounded-lg bg-[#87CEEB] text-white">
      {children}
    </button>
  );
}
```

### 2. **단일 책임 원칙**
각 컴포넌트/함수는 하나의 명확한 역할만 수행합니다.

**나쁜 예:**
```tsx
// 데이터 fetch + UI 렌더링 + 비즈니스 로직 모두 포함
function GalleryPage() {
  const [data, setData] = useState([]);
  // 200줄의 복잡한 로직...
}
```

**좋은 예:**
```tsx
// 데이터 관리
const galleryData = useGalleryData();

// UI 렌더링만
function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return <div>...</div>;
}
```

### 3. **파일 크기 제한**
- 컴포넌트: 최대 200줄
- 페이지: 최대 300줄
- 초과 시 분리 필수

## 📂 새 기능 추가 워크플로우

### 1단계: 타입 정의
```typescript
// types/index.ts
export interface NewFeature {
  id: string;
  name: string;
  description: string;
}
```

### 2단계: 데이터 추가 (필요시)
```typescript
// data/mockData.ts
export const newFeatureData: NewFeature[] = [
  { id: '1', name: 'Feature 1', description: 'Description' }
];
```

### 3단계: 컴포넌트 생성
```typescript
// components/sections/NewFeatureSection.tsx
'use client';

import { newFeatureData } from '@/data/mockData';
import SectionHeader from '@/components/common/SectionHeader';

export default function NewFeatureSection() {
  return (
    <div>
      <SectionHeader title="New Feature" />
      {/* 구현 */}
    </div>
  );
}
```

### 4단계: 페이지에 통합
```typescript
// app/playground/page.tsx
import NewFeatureSection from '@/components/sections/NewFeatureSection';

export default function PlaygroundPage() {
  return (
    <>
      {activeTab === 'newfeature' && <NewFeatureSection />}
    </>
  );
}
```

## 🎨 스타일 가이드

### 색상 사용
**절대 하지 말 것:**
```tsx
<div className="bg-[#87CEEB]">  // ❌
```

**올바른 방법:**
```tsx
import { COLORS } from '@/lib/constants';

<div style={{ backgroundColor: COLORS.primary }}>  // ✅
// 또는
<div className="bg-primary">  // Tailwind 커스텀 클래스
```

### Tailwind 패턴
```tsx
// 버튼
className="px-4 py-2 rounded-lg transition-colors hover:bg-opacity-90"

// 카드
className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md"

// 입력 필드
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
```

## 🔧 컴포넌트 작성 패턴

### 기본 구조
```tsx
'use client';  // 클라이언트 컴포넌트만

import { useState } from 'react';
import { SomeType } from '@/types';

interface Props {
  title: string;
  items: SomeType[];
  onItemClick?: (id: string) => void;
}

/**
 * 컴포넌트 설명
 * 
 * 주요 기능과 사용 예시를 간단히 설명합니다.
 */
export default function MyComponent({ title, items, onItemClick }: Props) {
  const [state, setState] = useState<string>('');

  return (
    <div>
      {/* 구현 */}
    </div>
  );
}
```

### 커스텀 훅
```tsx
// hooks/useGalleryFilter.ts
export function useGalleryFilter(items: GalleryItem[]) {
  const [filter, setFilter] = useState('All');
  
  const filtered = useMemo(() => {
    return filter === 'All' 
      ? items 
      : items.filter(item => item.category === filter);
  }, [items, filter]);

  return { filtered, filter, setFilter };
}
```

## 📝 운영자 기능 추가

### REQ 매핑 필수
```tsx
/**
 * REQ6.8: 새로운 관리 기능
 * 
 * 사용자 활동 로그를 조회하고 필터링합니다.
 */
function ActivityLog() {
  // 구현
}
```

### config/requirements.ts 업데이트
```typescript
export const requirements = [
  // ...기존 REQ
  {
    id: 'REQ6.8',
    category: 'Admin',
    title: '활동 로그 조회',
    description: '사용자의 활동 로그를 시간대별로 조회',
    priority: 'medium'
  }
];
```

## 🚀 성능 최적화

### useMemo 사용
```tsx
const filteredItems = useMemo(() => {
  return items.filter(item => item.category === filter);
}, [items, filter]);  // 의존성 배열 명시
```

### useCallback 사용
```tsx
const handleClick = useCallback((id: string) => {
  // 무거운 작업
}, [/* 의존성 */]);
```

### 동적 import
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});
```

## 🐛 디버깅 팁

### 1. TypeScript 에러
```bash
# 타입 체크
npx tsc --noEmit

# 특정 파일만
npx tsc --noEmit app/playground/page.tsx
```

### 2. 빌드 에러
```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### 3. import 에러
- 절대 경로 사용: `@/components/...`
- 상대 경로 지양: `../../components/...`

## 📦 새 패키지 추가

```bash
# 정확한 버전 명시
npm install react-query@^3.39.0

# devDependencies
npm install -D @types/node@^20
```

## 🔄 Git 워크플로우

### 브랜치 전략
```bash
main          # 프로덕션
├── develop   # 개발
└── feature/* # 기능별 브랜치
```

### 커밋 메시지
```
feat: 새 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경 (포맷팅)
docs: 문서 업데이트
chore: 기타 작업 (빌드, 패키지 등)
```

## 🎯 코드 리뷰 체크리스트

리뷰어/작성자 모두 확인:

- [ ] 파일 크기 < 300줄
- [ ] 중복 코드 없음 (DRY)
- [ ] 타입 정의 완료
- [ ] 사용하지 않는 import 제거
- [ ] 일관된 네이밍
- [ ] 색상은 constants에서 가져옴
- [ ] REQ 매핑 문서화 (admin 기능)
- [ ] 주석은 필요한 곳에만
- [ ] console.log 제거

## 🧪 테스트 (향후)

```tsx
// __tests__/GalleryCard.test.tsx
import { render, screen } from '@testing-library/react';
import GalleryCard from '@/components/GalleryCard';

test('renders gallery card', () => {
  render(<GalleryCard title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## 📚 참고 자료

- [Next.js 14 공식 문서](https://nextjs.org/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 💡 자주 하는 실수

### 1. 하드코딩된 색상
```tsx
// ❌ 나쁜 예
<div className="bg-[#87CEEB]">

// ✅ 좋은 예
<div className="bg-primary">
```

### 2. 타입 any 사용
```tsx
// ❌ 나쁜 예
function handle(data: any) { }

// ✅ 좋은 예
function handle(data: GalleryItem) { }
```

### 3. 거대한 컴포넌트
```tsx
// ❌ 나쁜 예: 500줄짜리 컴포넌트

// ✅ 좋은 예: 여러 작은 컴포넌트로 분리
<Parent>
  <Header />
  <Content />
  <Footer />
</Parent>
```

---

## Azure 승인 후 연동 절차

보안팀 승인 후 아래 순서로 Azure 리소스를 연동합니다.

### 1. Entra ID (OIDC) 인증
1. Azure Portal에서 앱 등록 후 Client ID, Tenant ID, Secret 발급
2. `.env.local`에 `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID` 설정
3. `AUTH_PROVIDER=oidc`로 변경
4. OAuth Redirect URI: `https://{도메인}/api/auth/oidc/callback` 등록

### 2. 데이터베이스 (PostgreSQL)
1. Azure Database for PostgreSQL 생성
2. `DATABASE_URL` 환경 변수 설정
3. `lib/data/repository.ts`의 TODO 주석에 따라 Prisma/Drizzle 등 ORM 도입 후 DB 쿼리 구현

### 3. Key Vault (선택)
1. Azure Key Vault 생성
2. `KEY_VAULT_URL` 설정
3. `lib/config/secrets.ts`에서 Key Vault 참조 로직 추가

### 4. API Routes 참고
- 인증: `/api/auth/oidc/login`, `/api/auth/oidc/callback`, `/api/auth/oidc/logout`
- 데이터: `/api/data/notices`, `/api/data/playday`, `/api/data/playbook?category=...`

---

**마지막 업데이트**: 2024-02-09  
**버전**: 3.5
