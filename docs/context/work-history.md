<!-- This file tracks implementation progress and impacted areas. -->
# Work History

## 2026-02-23 — 운영자 CMS 문서화 초기화

status: in_progress  
tags: history, admin-cms, documentation, tracking

요약: 운영자 CMS 구현 전 단계에서 요구 범위/영향 파일/검증 기준을 추적 가능한 형식으로 정리했다.

요구 범위(확정):
- 운영자 5명만 `/admin`에서 홈 운영 콘텐츠 수정 가능
- 홈 배너 업로드/관리
- 홈 공지 게시/관리
- PlayDay 안내 게시글 업로드/관리

요구 범위(보류):
- 우수활용사례 지정 기능

영향 파일(현재 기준):
- 권한 보호
  - `apps/web/app/admin/layout.tsx`
  - `apps/web/lib/auth/rbac.ts`
- 운영자 관리 화면
  - `apps/web/app/admin/page.tsx`
- 운영자 API
  - `apps/web/app/api/admin/content/route.ts`
- 홈 화면 렌더링
  - `apps/web/components/sections/HomeSection.tsx`
  - `apps/web/components/NoticeBanner.tsx`
- 데이터 계층
  - `apps/web/lib/data/repository.ts`

검증 체크리스트(구현 시 실행):
- 운영자 계정만 홈 CMS 관리 API 접근 가능(401/403 확인)
- 비운영자(ACE/일반직원)는 `/admin` 접근 불가 유지
- 홈 배너/공지/PlayDay 안내 CRUD가 관리자 화면에서 반영
- 홈 노출 순서/활성 상태가 사용자 화면과 일치
- 회귀: Playbook/PlayDay/Community 기존 조회/작성 권한 영향 없음

source:
- decision_doc: `docs/context/decision-log.md`
- index_doc: `docs/context/implementation-index.md`
