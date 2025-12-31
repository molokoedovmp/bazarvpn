from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Mapping

from bot.src.repositories.subscription_repo import SubscriptionRepository


@dataclass
class SubscriptionStatusInfo:
    status: str
    expires_at: datetime | None
    plan: str | None

    @property
    def is_active(self) -> bool:
        return self.status == "active"

    @property
    def is_expired(self) -> bool:
        return self.status == "expired"


class SubscriptionService:
    def __init__(self, subscription_repo: SubscriptionRepository) -> None:
        self._subscription_repo = subscription_repo

    async def get_active_subscription(self, user_id: str) -> Mapping[str, Any] | None:
        return await self._subscription_repo.get_active_subscription(user_id)

    async def get_status(self, user_id: str) -> SubscriptionStatusInfo:
        subscription = await self._subscription_repo.get_latest_subscription(user_id)
        if subscription is None:
            return SubscriptionStatusInfo(status="inactive", expires_at=None, plan=None)

        expires_at: datetime | None = subscription["expires_at"]
        status: str = subscription["status"]

        if status == "active" and expires_at is not None:
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            if expires_at <= now:
                status = "expired"

        plan = subscription["plan"]

        return SubscriptionStatusInfo(status=status, expires_at=expires_at, plan=plan)
