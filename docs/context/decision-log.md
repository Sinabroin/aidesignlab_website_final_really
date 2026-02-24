<!-- This file records architectural and scope decisions. -->
# Decision Log

## 2026-02-23 — 운영자 CMS 저장 방식 결정

status: decided  
tags: decision, admin-cms, storage, prisma, schema

결정: 홈 운영 콘텐츠(배너/공지/PlayDay 안내)는 전용 저장 구조(A안)로 설계한다.

근거:
- 운영 데이터 성격이 일반 게시글과 달라 별도 생명주기(게시 기간, 노출 순서, 활성/비활성)가 필요함
- 기존 `galleryItem` 재사용 시 섹션 문자열 의존도가 커지고 홈 운영 로직이 비대해질 가능성이 큼
- 향후 통계/배너 정책/노출 실험 기능으로 확장하기 쉬움

영향 범위:
- DB 모델 추가(홈 CMS 전용 엔티티)
- 운영자 API CRUD 추가
- 홈 화면 조회 로직에서 운영 콘텐츠를 우선 사용

source:
- conversation_ref: 운영자 CMS A안 확정
- related_files:
  - `apps/web/lib/data/repository.ts`
  - `apps/web/app/api/admin/content/route.ts`
  - `apps/web/components/sections/HomeSection.tsx`

---

## 2026-02-23 — 우수활용사례 기능 보류

status: postponed  
tags: decision, featured, backlog, scope

결정: 우수활용사례 지정 기능(요구사항 2번)은 보류한다.

근거:
- 현재 우선순위는 운영자 홈 CMS 핵심 운영 기능(배너/공지/PlayDay 안내) 안정화
- 우수사례 지정은 원본 게시글 참조 방식/별도 작성 방식의 정책 선택이 필요함

재개 조건:
- 사용자로부터 우수사례 운영 정책(선정 기준, 노출 수, 만료/교체 규칙) 확정 수신

source:
- conversation_ref: 2번 보류 확정
- index_link: `docs/context/implementation-index.md`
