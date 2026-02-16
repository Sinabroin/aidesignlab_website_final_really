# AI Design Lab API

FastAPI backend for AI Design Lab platform.

## Setup

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync

# Run development server
uv run uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
apps/api/
├── app/
│   ├── main.py          # FastAPI app entry point
│   ├── settings.py      # Pydantic Settings
│   ├── models/          # SQLModel database models
│   ├── schemas/         # Pydantic request/response schemas
│   └── routers/         # API route handlers
└── tests/               # Test files
```
