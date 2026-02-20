# Common API schemas
"""Common request/response schemas used across multiple endpoints."""

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standard error response schema."""
    error: str = Field(..., description="Error type/code")
    message: str = Field(..., description="Human-readable error message")


class SuccessResponse(BaseModel):
    """Standard success response schema."""
    ok: bool = Field(True, description="Operation success status")
    message: str | None = Field(None, description="Optional success message")
