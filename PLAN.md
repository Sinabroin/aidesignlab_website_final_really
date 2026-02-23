# 📋 프로젝트 전체 구조 및 개발 계획서 (Cursor 지시사항)

이 문서를 복사하여 Cursor의 채팅창(또는 `.cursorrules`, `plan.md` 같은 마크다운 파일)에 붙여넣으시면, Cursor가 프로젝트의 전체 방향성과 보안 제약사항을 완벽하게 이해하고 그에 맞춰 코드를 작성하게 됩니다.

---

## 1. 프로젝트 개요 및 보안/배포 전략

- **목적:** 현대건설(`hdec.co.kr`) 내부 사용자를 위한 웹 서비스 프로토타입(PoC) 구축.
- **보안 및 아키텍처 핵심 전략:**
  - **Phase 1 (현재 - PoC 단계):** 빠른 개발과 검증을 위해 외부 클라우드(Vercel, Azure)를 사용하되, 보안을 철저히 통제함.
  - **Phase 2 (미래 - 정식 도입):** 사내망(On-Premise) 서버 및 내부 DB로 완벽히 마이그레이션할 예정.
- **백엔드 제약 사항:** 향후 사내망 이전을 쉽게 하기 위해 별도의 백엔드 서버(Node, Spring 등)를 띄우지 않고, **Next.js의 API Routes(Server Actions)**를 백엔드로 활용함.

## 2. 기술 스택 (Tech Stack)

- **Frontend / Backend:** Next.js (App Router 기반 권장)
- **Authentication:** NextAuth.js (Azure AD 연동 완료, `@hdec.co.kr` 도메인만 허용)
- **Database:** Azure SQL Database (엔터프라이즈 보안 규격 충족을 위해 선택)
- **ORM:** Prisma (DB 마이그레이션 및 쿼리 관리의 편의성)
- **Hosting:** Vercel (Phase 1 전용)

## 3. 현재 진행 상황 (Current Status)

- Azure Entra ID(구 Azure AD) 앱 등록 및 리디렉션 URI(`localhost`, `vercel.app`) 설정 완료.
- `.env.local` 및 Vercel 환경 변수에 `AZURE_AD_TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 설정 완료.
- 로그인/로그아웃 등 NextAuth 기반의 인증 시스템 정상 작동 중.

## 4. Cursor AI를 위한 구체적 지시사항 (Action Items)

이 문서를 읽은 후, Cursor는 다음 단계에 따라 개발을 가이드하고 코드를 작성해야 한다.

### Task 1: Azure SQL Database 세팅 가이드 제공

- 개발자가 Azure Portal에서 가장 비용이 저렴한(Basic 또는 Free Tier) 'Azure SQL Database'를 생성할 수 있도록 단계별 가이드를 제공할 것.
- 외부 Vercel IP 및 로컬 IP에서 접근할 수 있도록 방화벽(Firewall) 설정 방법을 포함할 것.

### Task 2: Prisma ORM 초기 세팅

- 프로젝트에 Prisma를 설치하고 초기화하는 명령어를 제공할 것.
- Azure SQL Database 연결 문자열(Connection String)을 `.env.local`에 어떻게 배치해야 하는지 구조를 잡아줄 것.

### Task 3: 기본 DB 스키마(Schema) 작성

- 향후 확장성을 고려하여 테스트용 기본 테이블(예: User 프로필 확장 또는 간단한 게시글/로그 테이블)의 `schema.prisma` 코드를 제안할 것.

### Task 4: Next.js API Route(백엔드) 연결 테스트 코드 작성

- Prisma Client를 초기화하고, Next.js API에서 DB에 데이터를 읽고 쓰는 간단한 테스트 API 로직 코드를 작성할 것.
- 모든 데이터 접근은 Azure AD로 로그인된 세션(Session)이 유효한지 검증하는 보안 로직을 반드시 포함할 것.

---

**[시스템 프롬프트 적용 완료]**

위 구조와 전략을 완벽히 숙지했습니다. 현재 상황에 맞춰 Task 1(Azure SQL Database 세팅)부터 시작할까요, 아니면 전체 계획에 대해 추가하거나 수정하고 싶은 부분이 있으신가요?
