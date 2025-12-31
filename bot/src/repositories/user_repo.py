from __future__ import annotations

from typing import Any, Mapping

from asyncpg import Record

from bot.src.db.database import Database


class UserRepository:
    def __init__(self, db: Database) -> None:
        self._db = db

    async def upsert_user(
        self,
        telegram_id: int,
        username: str | None,
        first_name: str | None,
    ) -> Mapping[str, Any] | Record | None:
        query = """
        INSERT INTO users (telegram_id, username, first_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (telegram_id) DO UPDATE
        SET username = EXCLUDED.username,
            first_name = EXCLUDED.first_name
        RETURNING id, telegram_id, username, first_name, created_at;
        """
        return await self._db.pool.fetchrow(query, telegram_id, username, first_name)

    async def get_by_telegram_id(self, telegram_id: int) -> Mapping[str, Any] | Record | None:
        query = """
        SELECT id, telegram_id, username, first_name, created_at
        FROM users
        WHERE telegram_id = $1
        LIMIT 1;
        """
        return await self._db.pool.fetchrow(query, telegram_id)
