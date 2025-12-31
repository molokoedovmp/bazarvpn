from __future__ import annotations

from typing import Any, Mapping

from asyncpg import Record

from bot.src.db.database import Database


class TokenRepository:
    def __init__(self, db: Database) -> None:
        self._db = db

    async def get_active_token(
        self,
        subscription_id: str,
    ) -> Mapping[str, Any] | Record | None:
        query = """
        SELECT id, subscription_id, token, is_active, last_used_at, created_at
        FROM access_tokens
        WHERE subscription_id = $1
          AND is_active = TRUE
        ORDER BY created_at DESC
        LIMIT 1;
        """
        return await self._db.pool.fetchrow(query, subscription_id)

    async def deactivate_tokens(self, subscription_id: str) -> None:
        query = """
        UPDATE access_tokens
        SET is_active = FALSE
        WHERE subscription_id = $1
          AND is_active = TRUE;
        """
        await self._db.pool.execute(query, subscription_id)

    async def create_token(self, subscription_id: str, token: str) -> Mapping[str, Any] | Record | None:
        query = """
        INSERT INTO access_tokens (subscription_id, token, is_active)
        VALUES ($1, $2, TRUE)
        RETURNING id, subscription_id, token, is_active, created_at;
        """
        return await self._db.pool.fetchrow(query, subscription_id, token)
