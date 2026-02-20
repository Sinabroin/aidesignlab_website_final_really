# Allowlist management API schemas
"""Request and response schemas for allowlist management endpoints."""

from typing import Literal
from pydantic import BaseModel, Field, EmailStr


class AllowlistResponse(BaseModel):
    """Response schema for allowlist retrieval."""
    operators: list[str] = Field(..., description="List of operator email addresses")
    community: list[str] = Field(..., description="List of community member email addresses")


class AddMemberRequest(BaseModel):
    """Request schema for adding a member to allowlist."""
    email: EmailStr = Field(..., description="Email address to add")
    role: Literal["operator", "community"] = Field(..., description="Role type: operator or community")


class RemoveMemberRequest(BaseModel):
    """Request schema for removing a member from allowlist."""
    email: EmailStr = Field(..., description="Email address to remove")
    role: Literal["operator", "community"] = Field(..., description="Role type: operator or community")


class AddMemberResponse(BaseModel):
    """Response schema for successful member addition."""
    ok: bool = Field(True, description="Operation success status")
    email: str = Field(..., description="Added email address")
    role: Literal["operator", "community"] = Field(..., description="Role assigned")


class RemoveMemberResponse(BaseModel):
    """Response schema for successful member removal."""
    ok: bool = Field(True, description="Operation success status")
