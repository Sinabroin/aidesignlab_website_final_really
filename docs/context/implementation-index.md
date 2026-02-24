<!-- This file indexes implementation context for quick search. -->
# Implementation Index

## 운영자 CMS 확장

status: decided  
tags: admin-cms, rbac, home-banner, home-notice, playday-guide, scope

요약: 운영자 5명 전용으로 홈 콘텐츠를 관리하는 CMS를 기존 `/admin`에서 확장하고, 데이터 저장은 전용 구조(A안)로 진행한다.

source:
- conversation_ref: 운영자 CMS 요구 확정 세션
- decision_doc: `docs/context/decision-log.md`
- history_doc: `docs/context/work-history.md`
- related_files:
  - `apps/web/app/admin/layout.tsx`
  - `apps/web/app/admin/page.tsx`
  - `apps/web/app/api/admin/content/route.ts`
  - `apps/web/components/sections/HomeSection.tsx`
  - `apps/web/lib/data/repository.ts`

---

## 권한 정책 기준선

status: decided  
tags: rbac, operator, ace30, employee, guest, policy

요약: 운영진/ACE/일반직원/비로그인 권한 정책을 서버 중심으로 확정했고, 작성 권한은 API에서 최종 강제한다.

source:
- conversation_ref: RBAC 정책 확정 세션
- related_files:
  - `apps/web/lib/auth/rbac.ts`
  - `apps/web/app/api/data/posts/route.ts`
  - `apps/web/app/community/page.tsx`
  - `apps/web/app/admin/layout.tsx`

---

## 보류 항목

status: postponed  
tags: featured, home-featured, backlog

요약: 우수활용사례 지정 기능(2번 요구사항)은 현재 보류 상태이며, 후속 요구 접수 시 별도 범위로 분리 구현한다.

source:
- conversation_ref: 운영자 CMS 범위 조정 세션
- pending_scope: 우수활용사례 지정/노출/편성 로직
