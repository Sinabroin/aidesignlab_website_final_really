# Changelog

프로젝트의 주요 변경사항을 기록합니다.

## [3.5.0] - 2024-02-09

### 🎉 Major Changes

#### 프로젝트 구조 대폭 개선
- **리팩토링**: `app/playground/page.tsx` 1315줄 → 116줄 (91% 감소)
- **모듈화**: 섹션별 컴포넌트 분리 (`components/sections/`)
- **공통 컴포넌트**: 재사용 가능한 UI 컴포넌트 추출 (`components/common/`)
- **데이터 중앙화**: 모든 목업 데이터를 `data/mockData.ts`로 통합
- **타입 체계**: 공통 타입을 `types/index.ts`로 통합

#### 운영자 콘솔 완전 개편
- **기존**: Mermaid + REQ 텍스트만 표시
- **신규**: 실제 동작하는 7개 관리 탭 구현
  - 📊 대시보드 (REQ6.7)
  - 👥 권한 관리 (REQ6.3)
  - 📝 콘텐츠 관리 (REQ6.2)
  - 🎯 회차 운영 (REQ6.4)
  - 📋 로그 조회 (REQ6.5)
  - 🏷️ 태그 관리 (REQ6.6)
  - 📄 요구사항 (REQ 전체 조회)

### ✨ Added

#### 새 파일
- `types/index.ts`: 공통 타입 정의 (GalleryItem, UserRole 등)
- `lib/constants.ts`: 앱 전역 상수 (색상, 우선순위 매핑 등)
- `config/requirements.ts`: REQ v3.5 데이터 정의
- `PROJECT_STRUCTURE.md`: 프로젝트 구조 상세 문서
- `DEVELOPMENT_GUIDE.md`: 개발자를 위한 실전 가이드
- `CHANGELOG.md`: 변경사항 기록

#### 새 컴포넌트 (components/common/)
- `TabButton.tsx`: 재사용 가능한 탭 버튼
- `FilterButton.tsx`: 카테고리 필터 버튼
- `WriteButton.tsx`: 글쓰기 버튼
- `SectionHeader.tsx`: 섹션 헤더

#### 새 섹션 컴포넌트 (components/sections/)
- `HomeSection.tsx`: 홈 미리보기 (PlayBook + PlayDay)
- `PlayBookSection.tsx`: PlayBook 탭 전체
- `PlayDaySection.tsx`: PlayDay 탭 전체
- `ACECommunitySection.tsx`: ACE 커뮤니티 탭 전체

### 🔧 Changed

#### 코드 품질 개선
- DRY 원칙 적용으로 중복 코드 대폭 감소
- 단일 책임 원칙: 각 컴포넌트가 하나의 명확한 역할
- 관심사 분리: 데이터/타입/UI 완전 분리

#### `.cursorrules` 업데이트
- 프로젝트 구조 규칙 추가
- 컴포넌트 네이밍 컨벤션 명시
- 색상 사용 규칙 추가
- REQ 구현 가이드라인 추가
- 코드 리뷰 체크리스트 추가

#### 문서화 강화
- `README.md`: 프로젝트 개요 업데이트
- 구조, 개발 가이드 분리로 가독성 향상
- 실전 예제 코드 추가

### 🎨 Design System

#### 색상 시스템 확립
```typescript
COLORS = {
  primary: '#87CEEB',      // Sky Blue
  primaryLight: '#B0E0E6',
  primaryDark: '#77BED5',
  accent: '#4A90A4',
  accentDark: '#2C5F6F',
}
```

#### 일관된 UI 패턴
- 버튼: `px-4 py-2 rounded-lg transition-colors`
- 카드: `bg-white rounded-lg border border-gray-200 p-6`
- 뱃지: `px-3 py-1 rounded-full text-sm font-medium`

### 📊 성능 개선

- 컴포넌트 분리로 자동 코드 스플리팅 최적화
- `useMemo`로 필터링 로직 최적화
- 파일 크기 제한 (< 300줄)으로 빌드 효율성 향상

### 🔐 보안 강화

- 권한 체계 명확화 (R1/R2/R3)
- 다운로드 로그 추적 시스템 (REQ0.15)
- 감사 로그 인터페이스 구현 (REQ6.5)

---

**형식**:
- `[버전]`: Semantic Versioning (MAJOR.MINOR.PATCH)
- **Added**: 새로운 기능
- **Changed**: 기존 기능 변경
- **Deprecated**: 곧 제거될 기능
- **Removed**: 제거된 기능
- **Fixed**: 버그 수정
- **Security**: 보안 관련 변경
