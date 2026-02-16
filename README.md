# AI Design Lab Platform

HDEC AI 디자인랩을 위한 통합 플랫폼입니다. PlayDay, Playbook, ACE 커뮤니티 등 다양한 기능을 제공합니다.

## 🚀 주요 기능

### 사용자 기능
- **랜딩 페이지**: Aurora 효과와 타이핑 애니메이션
- **PlayBook**: AI 활용 사례, 트렌드, 프롬프트 갤러리
- **PlayDay**: 회차별 콘텐츠 관리 (최신/이전 내역)
- **ACE 커뮤니티**: 공지사항, 일정, Quick Links
- **도움 요청**: AI 관련 질문 및 답변

### 운영자 기능 (REQ 기반)
- **📊 대시보드** (REQ6.7): 주요 지표 모니터링
- **👥 권한 관리** (REQ6.3): R1/R2/R3 멤버 관리
- **📝 콘텐츠 관리** (REQ6.2): 대표작 편성, 배너 관리
- **🎯 회차 운영** (REQ6.4): PlayDay 회차 생성/종료
- **📋 로그 조회** (REQ6.5): 다운로드/삭제 감사 로그
- **🏷️ 태그 관리** (REQ6.6): 표준 태그 관리
- **📄 요구사항**: REQ v3.5 전체 조회

## 📁 프로젝트 구조

```
ace-website/
├── app/                    # Next.js App Router
│   ├── admin/             # 운영자 콘솔 (REQ6.*)
│   ├── playground/        # 메인 앱 (116줄)
│   └── help-requests/     # 도움 요청
├── components/
│   ├── common/           # 공통 UI (TabButton, FilterButton 등)
│   └── sections/         # 페이지 섹션 (Home, PlayBook, PlayDay 등)
├── data/                 # 목업 데이터
├── types/                # TypeScript 타입
├── lib/                  # 유틸리티 & 상수
└── config/               # 설정 파일
```

자세한 내용은 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 참조

## 🛠️ 기술 스택

- **Framework**: Next.js 14.2.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.0
- **UI**: React 18.3.0

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

개발 서버: http://localhost:3000

## 🚢 실시간 배포 (수정 후 웹사이트에서 바로 확인)

코드 수정 → `git push` 만 하면 배포 사이트에 자동 반영되게 하려면:

1. **Vercel**에 이 프로젝트의 GitHub 저장소를 연결 (최초 1회)
2. 이후 `git push origin main` 할 때마다 자동 빌드·배포됨 (1~2분 내 반영)

자세한 절차는 **[DEPLOY.md](./DEPLOY.md)** 참고.

## 📚 문서

- [프로젝트 구조 가이드](./PROJECT_STRUCTURE.md)
- [개발 가이드](./DEVELOPMENT_GUIDE.md)
- [코딩 규칙](./.cursorrules)

## 🎯 설계 원칙

1. **DRY (Don't Repeat Yourself)**: 중복 코드 최소화
2. **단일 책임**: 각 컴포넌트/함수는 하나의 명확한 목적
3. **관심사 분리**: 데이터/타입/UI 분리
4. **확장 가능성**: 새 기능 추가 용이한 구조
5. **타입 안정성**: TypeScript로 런타임 에러 방지

## 🔧 개발 워크플로우

### 새 섹션 추가
1. `types/index.ts`에 타입 추가
2. `components/sections/NewSection.tsx` 생성
3. `app/playground/page.tsx`에서 import 및 렌더링

### 새 운영자 기능 추가
1. `config/requirements.ts`에 REQ 추가
2. `app/admin/page.tsx`에 탭 및 기능 구현
3. REQ ID 문서화

자세한 내용은 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) 참조

## 📋 Requirements (REQ v3.5)

총 40+ 요구사항이 정의되어 있습니다:
- **Common**: 로그인/권한, 검색/필터, 첨부파일 등
- **PlayDay**: 회차 관리, 쇼츠/게시물, 인터랙션
- **Admin**: 운영진 콘솔, 권한 관리, 로그 조회 등

전체 REQ 리스트는 `config/requirements.ts` 또는 운영자 페이지에서 확인

## 🎨 디자인 시스템

### 색상
- **Primary**: #87CEEB (Sky Blue)
- **Primary Light**: #B0E0E6
- **Accent**: #4A90A4
- **Accent Dark**: #2C5F6F

모든 색상은 `lib/constants.ts`에서 관리

### 컴포넌트
- `TabButton`: 탭 네비게이션
- `FilterButton`: 카테고리 필터
- `GalleryCard`: Siteinspire 스타일 카드
- `SectionHeader`: 섹션 헤더

## 🔐 권한 시스템 (REQ0.1)

- **R1 (전사)**: 기본 콘텐츠 열람
- **R2 (ACE)**: ACE 커뮤니티 접근
- **R3 (운영진)**: 관리자 기능 접근

## 📈 성능 최적화

- 컴포넌트 분리로 자동 코드 스플리팅
- `useMemo`로 필터링 최적화
- 파일 크기 제한 (< 300줄)

## 🤝 기여 가이드

1. `.cursorrules` 코딩 규칙 준수
2. 파일 크기 < 300줄 유지
3. TypeScript 타입 정의 필수
4. 컴포넌트 < 200줄 권장
5. 테스트 작성 (향후)

## 📝 커밋 메시지 형식

```
<타입>: <제목>

feat: 새 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경
docs: 문서 업데이트
```

## 🚧 향후 계획

- [ ] 인증 시스템 구현 (SSO)
- [ ] 백엔드 API 연동
- [ ] 실시간 알림 (REQ0.13)
- [ ] 테스트 커버리지 확보
- [ ] 성능 모니터링 도구

## 📞 문의

프로젝트 관련 문의는 "도와줘요 ACE!" 버튼을 통해 요청해주세요.

## 📄 라이선스

내부 프로젝트

---

**Last Updated**: 2024-02-09  
**Version**: 3.5  
**Status**: 활성 개발 중
