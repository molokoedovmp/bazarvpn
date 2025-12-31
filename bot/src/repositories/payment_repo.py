from __future__ import annotations

from typing import Any, Mapping

from asyncpg import Record

from bot.src.db.database import Database


class PaymentRepository:
    def __init__(self, db: Database) -> None:
        self._db = db

    async def create_payment_intent(
        self,
        user_id: str,
        provider: str,
        amount: int,
        currency: str,
        status: str,
        provider_payment_id: str | None = None,
    ) -> Mapping[str, Any] | Record | None:
        query = """
        INSERT INTO payments (user_id, provider, amount, currency, status, provider_payment_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, status, provider_payment_id, created_at;
        """
        return await self._db.pool.fetchrow(
            query,
            user_id,
            provider,
            amount,
            currency,
            status,
            provider_payment_id,
        )
