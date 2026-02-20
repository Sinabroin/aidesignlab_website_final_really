# Data service layer
"""Business logic for data retrieval."""

import json
from pathlib import Path
from typing import Literal

from app.schemas.data import GalleryItemSchema, NoticeSchema, AttachmentSchema

# Mock data path (temporary until database is connected)
MOCK_DATA_PATH = Path(__file__).parent.parent.parent.parent / "web" / "data" / "mockData.ts"


def _load_mock_data_from_json() -> dict:
    """Load mock data from JSON file (converted from TypeScript)."""
    # TODO: 실제 데이터베이스 쿼리로 교체
    # 현재는 TypeScript mockData를 JSON으로 변환하여 사용
    json_path = Path(__file__).parent.parent.parent.parent / "data" / "mock_data.json"
    
    if json_path.exists():
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    
    # Fallback: 빈 데이터 반환
    return {
        "playday": [],
        "playbook": {
            "usecase": [],
            "trend": [],
            "prompt": [],
            "hai": [],
            "teams": [],
        },
        "notices": [],
    }


def _convert_gallery_item(item: dict) -> GalleryItemSchema:
    """Convert dict to GalleryItemSchema."""
    attachments = None
    if item.get("attachments"):
        attachments = [
            AttachmentSchema(**att) for att in item["attachments"]
        ]
    
    return GalleryItemSchema(
        title=item["title"],
        description=item["description"],
        author=item["author"],
        date=item["date"],
        category=item["category"],
        fullDescription=item.get("fullDescription"),
        tags=item.get("tags"),
        attachments=attachments,
        session=item.get("session"),
    )


def _convert_notice(item: dict) -> NoticeSchema:
    """Convert dict to NoticeSchema."""
    return NoticeSchema(
        title=item["title"],
        date=item["date"],
        badge=item["badge"],
        badgeColor=item["badgeColor"],
    )


async def get_playday_items() -> list[GalleryItemSchema]:
    """Get PlayDay gallery items."""
    # TODO: Replace with database query
    # Example: SELECT * FROM gallery_items WHERE category = 'playday' ORDER BY date DESC
    data = _load_mock_data_from_json()
    items = data.get("playday", [])
    return [_convert_gallery_item(item) for item in items]


async def get_playbook_items(
    category: Literal["usecase", "trend", "prompt", "hai", "teams"]
) -> list[GalleryItemSchema]:
    """Get PlayBook items by category."""
    # TODO: Replace with database query
    # Example: SELECT * FROM gallery_items WHERE category = ? ORDER BY date DESC
    data = _load_mock_data_from_json()
    category_data = data.get("playbook", {}).get(category, [])
    return [_convert_gallery_item(item) for item in category_data]


async def get_notices() -> list[NoticeSchema]:
    """Get notices list."""
    # TODO: Replace with database query
    # Example: SELECT * FROM notices ORDER BY date DESC LIMIT 10
    data = _load_mock_data_from_json()
    notices = data.get("notices", [])
    return [_convert_notice(item) for item in notices]
