from __future__ import annotations

from typing import Any, Mapping

from asyncpg import Record

from bot.src.db.database import Database


class SubscriptionRepository:
    def __init__(self, db: Database) -> None:
        self._db = db

    async def get_active_subscription(
        self,
        user_id: str,
    ) -> Mapping[str, Any] | Record | None:
        query = """
        SELECT id, user_id, status, plan, started_at, expires_at, created_at
        FROM subscriptions
        WHERE user_id = $1
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY expires_at DESC NULLS LAST, created_at DESC
        LIMIT 1;
        """
        return await self._db.pool.fetchrow(query, user_id)

    async def get_latest_subscription(
        self,
        user_id: str,
    ) -> Mapping[str, Any] | Record | None:
        query = """
        SELECT id, user_id, status, plan, started_at, expires_at, created_at
        FROM subscriptions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
        """
        return await self._db.pool.fetchrow(query, user_id)
