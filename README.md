# AI Design Lab Platform - Monorepo

HDEC AI 디자인랩을 위한 통합 플랫폼입니다. PlayDay, Playbook, ACE 커뮤니티 등 다양한 기능을 제공합니다.

## 🏗️ Architecture

- **Monorepo Structure**: `apps/web` (Next.js) + `apps/api` (FastAPI)
- **Frontend**: Next.js App Router, TypeScript, TailwindCSS
- **Backend**: FastAPI, Python 3.12+, SQLModel, Pydantic, uv package manager
- **AI Model**: Claude Code (via Cursor)

## 📁 Project Structure

```
.
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities
│   │   └── types/        # TypeScript types
│   └── api/              # FastAPI backend
│       └── app/
│           ├── main.py   # FastAPI entry point
│           ├── models/   # SQLModel database models
│           ├── schemas/  # Pydantic request/response schemas
│           └── routers/  # API route handlers
├── .cursor/
│   └── rules/            # Cursor AI coding rules
├── .pre-commit-config.yaml
└── ENGINEERING_STANDARDS.md
```

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Prerequisites

- Node.js 18+
- Python 3.12+
- uv (Python package manager)

### Setup

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web && npm install && cd ../..

# Install backend dependencies
cd apps/api && uv sync && cd ../..

# Setup pre-commit hooks
uv tool install pre-commit
pre-commit install
```

### Development

**Frontend**:
```bash
npm run dev:web
# or
cd apps/web && npm run dev
```

**Backend**:
```bash
cd apps/api
uv run uvicorn app.main:app --reload --port 8000
```

## 📋 Coding Standards

This project enforces strict coding standards:

- **30-Line Rule**: Functions/components must not exceed 30 lines
- **Strict Typing**: All functions must have type hints (Python) or explicit types (TypeScript)
- **Error Handling**: All external service calls must have error handling
- **File Headers**: Every new file must have a one-line purpose comment

See [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) for complete details.

## 🛠️ Tools & Enforcement

- **Pre-commit Hooks**: Automatically run linting/type checking before commits
- **Cursor Rules**: AI-assisted coding standards enforcement
- **ESLint**: TypeScript linting with `max-lines-per-function: 30`
- **Ruff + MyPy**: Python linting and type checking

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Setup and development guide
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) - Coding standards and best practices
- [MIGRATION.md](./MIGRATION.md) - Migration guide (if needed)

## 🎯 Features

### User Features
- **랜딩 페이지**: Aurora 효과와 타이핑 애니메이션
- **PlayBook**: AI 활용 사례, 트렌드, 프롬프트 갤러리
- **PlayDay**: 회차별 콘텐츠 관리
- **ACE 커뮤니티**: 공지사항, 일정, Quick Links
- **도움 요청**: AI 관련 질문 및 답변

### Admin Features
- **권한 관리**: 운영진·ACE 멤버 관리
- **콘텐츠 관리**: 대표작 편성, 배너 관리
- **회차 운영**: PlayDay 회차 생성/종료
- **로그 조회**: 다운로드/삭제 감사 로그

## 🔐 Authentication

- **Frontend**: NextAuth.js with Azure AD
- **Backend**: FastAPI with JWT (planned)

## 📝 License

Internal project

---

**Last Updated**: 2026-02-16  
**Version**: 1.0.0
