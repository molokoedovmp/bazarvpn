from __future__ import annotations

from typing import Any, Mapping

from aiogram.types import User

from bot.src.repositories.user_repo import UserRepository


class UserService:
    def __init__(self, user_repo: UserRepository) -> None:
        self._user_repo = user_repo

    async def ensure_user(self, tg_user: User) -> Mapping[str, Any] | None:
        username = tg_user.username if tg_user.username else None
        first_name = tg_user.first_name if tg_user.first_name else None
        return await self._user_repo.upsert_user(
            telegram_id=tg_user.id,
            username=username,
            first_name=first_name,
        )

    async def get_by_telegram_id(self, telegram_id: int) -> Mapping[str, Any] | None:
        return await self._user_repo.get_by_telegram_id(telegram_id)
