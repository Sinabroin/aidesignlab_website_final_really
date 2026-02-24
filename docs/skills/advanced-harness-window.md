# Advanced Harness Window Reference
# source: https://github.com/chacha95/advanced-harness-window

## 기술 스택
- Backend: Python 3.12, FastAPI, SQLModel, PostgreSQL
- Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, MUI
- AI Agent: Pydantic AI, SSE streaming

## 주요 Skills (15개)
1. brand-guidelines — Anthropic 공식 브랜드 컬러/타이포(Poppins/Lora)
2. fastapi-backend-guidelines — DDD, SQLModel ORM, 레포지토리 패턴
3. frontend-design — 독창적 프로덕션급 프론트엔드 UI 가이드
4. nextjs-frontend-guidelines — Next.js 15, App Router, shadcn/ui, Tailwind CSS 4
5. vercel-react-best-practices — React/Next.js 성능 최적화
6. web-design-guidelines — Web Interface Guidelines 기반 UI 접근성/UX 리뷰
7. error-tracking — Sentry v8 통합 패턴
8. skill-developer — Claude Code 스킬 생성/관리 가이드 (500줄 룰)

## Agents (12개)
- code-architecture-reviewer — 코드 품질, 아키텍처 일관성 리뷰
- code-refactor-master — 파일 재구성, 의존성 추적, 컴포넌트 추출
- plan-reviewer — 구현 전 계획 리스크 평가, 갭 분석
- auto-error-resolver — TypeScript 컴파일 에러 자동 감지/수정

## Commands
- `/dev-docs-update` — 컨텍스트 컴팩션 전 개발 문서 업데이트
- `/dev-docs` — 전략적 개발 계획(plan/context/tasks) 구조화

## 적용 원칙
- 500줄 룰: 스킬 파일 500줄 이내
- DRY 코드, 레포지토리 패턴
- 타입 안전성 + 에러 핸들링 필수
