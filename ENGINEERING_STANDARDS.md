# Engineering Standards

This document defines the coding standards and best practices for the AI Design Lab monorepo project.

## Table of Contents

- [Architecture](#architecture)
- [Core Rules](#core-rules)
- [Type Safety](#type-safety)
- [Error Handling](#error-handling)
- [Code Organization](#code-organization)
- [Tooling & Enforcement](#tooling--enforcement)
- [References](#references)

---

## Architecture

- **Monorepo Structure**: `apps/web` (Next.js) + `apps/api` (FastAPI)
- **Frontend**: Next.js App Router, TypeScript, TailwindCSS
- **Backend**: FastAPI, Python 3.12+, SQLModel, Pydantic, uv package manager
- **AI Model**: Claude Code (via Cursor)

---

## Core Rules

### 1. The 30-Line Rule

**STRICTLY enforce**: Functions and component bodies MUST NOT exceed 30 lines of code.

- If a function exceeds 30 lines, immediately refactor into smaller, named helper functions or custom hooks.
- Do not ask for permission - just refactor.
- Count only executable code (exclude blank lines and comments for readability).

**Enforcement**:
- **TypeScript**: ESLint rule `max-lines-per-function: 30` (configured in `.eslintrc.json`)
- **Python**: Enforced via code review and Cursor rules (automatic linting for function LOC is limited in Python)

### 2. One-Line File Header

**EVERY new file** must start with a comment explaining its purpose:

- **Python**: `# This file handles [purpose]...`
- **TypeScript/TSX**: `/** This component displays [purpose]... */`

**Enforcement**:
- **Python**: Ruff pydocstyle rules (D100-D104) - module docstrings
- **TypeScript**: Cursor rules + code review

### 3. Safety & Error Handling

Assume external services (DB, API) will fail. Always wrap logic in error handling:

- **Python**: Use `try/except` blocks, raise `HTTPException` explicitly
- **TypeScript**: Use `try/catch`, show UI fallbacks (Error Boundaries) or toast notifications

---

## Type Safety

### Python (Backend)

- **ALL functions** must have type hints for parameters and return types
- Use **Pydantic models** for ALL data structures (request/response schemas, configuration)
- Use **SQLModel** for database models (combines Pydantic + SQLAlchemy)

**Example**:
```python
from typing import Optional
from pydantic import BaseModel
from sqlmodel import Session, select

class UserResponse(BaseModel):
    """Schema for user response."""
    id: int
    email: str
    name: str

def get_user(session: Session, user_id: int) -> Optional[User]:
    """Retrieve a user by ID."""
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).first()
```

**References**:
- [PEP 484 - Type Hints](https://peps.python.org/pep-0484/)
- [Pydantic Models](https://docs.pydantic.dev/latest/concepts/models/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)

### TypeScript (Frontend)

- **NEVER use `any`**. Define interfaces/types for all props and API responses.
- Use TypeScript's `strict` mode (enabled in `tsconfig.json`).
- Prefer `unknown` over `any` when type is truly unknown, then narrow with type guards.

**Example**:
```typescript
interface User {
  id: number;
  email: string;
  name: string;
}

function getUser(userId: number): Promise<User> {
  return fetch(`/api/users/${userId}`).then(res => res.json());
}
```

---

## Error Handling

### Python (Backend)

```python
from fastapi import HTTPException
from sqlmodel import Session

async def get_user(user_id: int, session: Session) -> User:
    """Get user by ID with error handling."""
    try:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except DatabaseError as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database error")
```

### TypeScript (Frontend)

```typescript
async function fetchUser(userId: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error("Failed to load user");
    throw error;
  }
}
```

---

## Code Organization

### Backend (FastAPI)

```
apps/api/
├── app/
│   ├── main.py          # FastAPI app entry point
│   ├── settings.py      # Pydantic Settings
│   ├── models/          # SQLModel database models
│   ├── schemas/         # Pydantic request/response schemas
│   └── routers/         # API route handlers (APIRouter)
└── tests/               # Test files
```

**Naming Conventions**:
- **snake_case** for functions/variables: `get_user_data()`
- **PascalCase** for Classes/Models: `User`, `UserResponse`
- **UPPER_CASE** for constants: `MAX_RETRIES = 3`

### Frontend (Next.js)

```
apps/web/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utilities and helpers
└── types/               # TypeScript type definitions
```

**Naming Conventions**:
- **camelCase** for functions/variables: `getUserData()`
- **PascalCase** for Components: `UserProfile`, `Dashboard`

---

## Tooling & Enforcement

### Pre-commit Hooks

Pre-commit hooks automatically run before every commit to enforce standards:

**Setup**:
```bash
# Install pre-commit (using uv)
uv tool install pre-commit

# Install hooks
pre-commit install
```

**Hooks configured**:
- **Python**: Ruff (linting + formatting), MyPy (type checking)
- **TypeScript**: ESLint (linting), Prettier (formatting)
- **General**: Trailing whitespace, end-of-file fixer, YAML/JSON/TOML validation

**Configuration**: `.pre-commit-config.yaml`

### Cursor Rules

Cursor AI uses rules in `.cursor/rules/*.mdc` to enforce standards during code generation:

- `core-standards.mdc`: 30-line rule, file headers, error handling (always applies)
- `typescript-frontend.mdc`: TypeScript standards (applies to `apps/web/**/*.{ts,tsx}`)
- `python-backend.mdc`: Python standards (applies to `apps/api/**/*.py`)

### Linting & Type Checking

**Python**:
- **Ruff**: Linting and formatting (configured in `pyproject.toml`)
- **MyPy**: Type checking with strict mode (configured in `pyproject.toml`)

**TypeScript**:
- **ESLint**: Linting with `max-lines-per-function: 30` rule (configured in `.eslintrc.json`)
- **TypeScript Compiler**: Strict mode enabled in `tsconfig.json`

---

## References

### Official Documentation

- **Python Type Hints**: [PEP 484](https://peps.python.org/pep-0484/)
- **Pydantic**: [Pydantic Models](https://docs.pydantic.dev/latest/concepts/models/)
- **SQLModel**: [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- **Pre-commit**: [Pre-commit Framework](https://pre-commit.com/)
- **ESLint**: [max-lines-per-function Rule](https://eslint.org/docs/latest/rules/max-lines-per-function)

### Project-Specific

- **Cursor Rules**: `.cursor/rules/*.mdc`
- **Pre-commit Config**: `.pre-commit-config.yaml`
- **Python Config**: `apps/api/pyproject.toml`
- **TypeScript Config**: `apps/web/tsconfig.json`, `apps/web/.eslintrc.json`

---

## Quick Checklist

Before committing code, ensure:

- [ ] All functions/components are under 30 lines
- [ ] All new files have a one-line header comment
- [ ] All Python functions have type hints (parameters + return types)
- [ ] All TypeScript functions have explicit types (no `any`)
- [ ] Error handling is in place for external service calls
- [ ] Pre-commit hooks pass (`git commit` will run them automatically)
- [ ] Code follows naming conventions (snake_case for Python, camelCase for TypeScript)

---

**Last Updated**: 2026-02-16  
**Version**: 1.0.0
