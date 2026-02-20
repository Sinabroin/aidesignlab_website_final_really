# Allowlist service layer
"""Business logic for allowlist management."""

import json
from pathlib import Path
from typing import Literal

FIXED_OPERATOR_EMAIL = "2501034@hdec.co.kr"
# Path from apps/api/app/services/allowlist.py to apps/web/data/allowlists.json
# Note: This should be moved to a shared location in production
ALLOWLISTS_PATH = Path(__file__).parent.parent.parent.parent / "web" / "data" / "allowlists.json"


async def get_allowlists_service() -> dict[str, list[str]]:
    """Get all allowlists from JSON file."""
    try:
        if not ALLOWLISTS_PATH.exists():
            return {"operators": [], "community": []}
        with open(ALLOWLISTS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {
            "operators": data.get("operators", []),
            "community": data.get("community", []),
        }
    except Exception as e:
        raise RuntimeError(f"Failed to load allowlists: {str(e)}")


async def add_member_service(
    email: str, role: Literal["operator", "community"]
) -> None:
    """Add a member to the allowlist."""
    normalized = email.strip().lower()
    if not normalized or "@" not in normalized:
        raise ValueError("Invalid email format")
    data = await get_allowlists_service()
    target_list = data["operators"] if role == "operator" else data["community"]
    if normalized in target_list:
        return
    target_list.append(normalized)
    await _save_allowlists(data)


async def remove_member_service(
    email: str, role: Literal["operator", "community"]
) -> dict[str, bool | str]:
    """Remove a member from the allowlist."""
    normalized = email.strip().lower()
    if role == "operator" and normalized == FIXED_OPERATOR_EMAIL:
        return {"ok": False, "error": "고정 운영자는 제거할 수 없습니다."}
    data = await get_allowlists_service()
    target_list = data["operators"] if role == "operator" else data["community"]
    if normalized not in target_list:
        return {"ok": True}
    target_list.remove(normalized)
    await _save_allowlists(data)
    return {"ok": True}


async def _save_allowlists(data: dict[str, list[str]]) -> None:
    """Save allowlists to JSON file."""
    try:
        ALLOWLISTS_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(ALLOWLISTS_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise RuntimeError(f"Failed to save allowlists: {str(e)}")
