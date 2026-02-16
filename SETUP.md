# Setup Guide

This guide helps you set up the monorepo project for development.

## Prerequisites

- **Node.js** 18+ (for Next.js frontend)
- **Python** 3.12+ (for FastAPI backend)
- **uv** (Python package manager) - [Installation](https://github.com/astral-sh/uv)

## Initial Setup

### 1. Install Root Dependencies

```bash
npm install
```

This installs workspace dependencies and pre-commit hooks.

### 2. Install Frontend Dependencies

```bash
cd apps/web
npm install
```

### 3. Install Backend Dependencies

```bash
cd apps/api
uv sync
```

### 4. Setup Pre-commit Hooks

```bash
# Install pre-commit (if not already installed)
uv tool install pre-commit

# Install Git hooks
pre-commit install
```

## Development

### Frontend (Next.js)

```bash
cd apps/web
npm run dev
```

Or from root:
```bash
npm run dev:web
```

Server runs on: http://localhost:3000

### Backend (FastAPI)

```bash
cd apps/api
uv run uvicorn app.main:app --reload --port 8000
```

Server runs on: http://localhost:8000

## Running Pre-commit Checks

Pre-commit hooks run automatically on `git commit`. To run manually:

```bash
pre-commit run --all-files
```

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js frontend
│   │   ├── app/      # App Router pages
│   │   ├── components/
│   │   └── lib/
│   └── api/          # FastAPI backend
│       └── app/
│           ├── main.py
│           ├── models/
│           ├── schemas/
│           └── routers/
├── .cursor/
│   └── rules/        # Cursor AI rules
├── .pre-commit-config.yaml
└── ENGINEERING_STANDARDS.md
```

## Troubleshooting

### Pre-commit Installation Issues

If `uv tool install pre-commit` fails, try:
```bash
pip install pre-commit
pre-commit install
```

### Workspace Dependencies

If workspace dependencies aren't resolving:
```bash
# Clean install
rm -rf node_modules apps/*/node_modules
npm install
```

### Python Environment

If Python dependencies aren't found:
```bash
cd apps/api
uv sync --refresh
```
