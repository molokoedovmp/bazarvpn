from __future__ import annotations

import uuid
from typing import Optional

from bot.src.repositories.token_repo import TokenRepository
from bot.src.services.subscription_service import SubscriptionService


class VPNService:
    def __init__(
        self,
        subscription_service: SubscriptionService,
        token_repo: TokenRepository,
        allow_free_access: bool = False,
    ) -> None:
        self._subscription_service = subscription_service
        self._token_repo = token_repo
        self._allow_free_access = allow_free_access

    async def _ensure_subscription(self, user_id: str):
        subscription = await self._subscription_service.get_active_subscription(user_id)
        if subscription:
            return subscription
        if self._allow_free_access:
            return await self._subscription_service.ensure_active_subscription(
                user_id=user_id,
                allow_create=True,
                plan="test",
            )
        return None

    async def get_connection_link(self, user_id: str) -> Optional[str]:
        subscription = await self._ensure_subscription(user_id)
        if subscription is None:
            return None

        subscription_id = str(subscription["id"])
        active_token = await self._token_repo.get_active_token(subscription_id)

        if active_token is not None:
            token_value = active_token["token"]
        else:
            await self._token_repo.deactivate_tokens(subscription_id)
            token_value = uuid.uuid4().hex
            await self._token_repo.create_token(subscription_id, token_value)

        return f"https://bazarvpn.ru/connect/{token_value}"

    async def regenerate_token(self, user_id: str) -> Optional[str]:
        subscription = await self._ensure_subscription(user_id)
        if subscription is None:
            return None

        subscription_id = str(subscription["id"])
        await self._token_repo.deactivate_tokens(subscription_id)
        token_value = uuid.uuid4().hex
        await self._token_repo.create_token(subscription_id, token_value)
        return f"https://bazarvpn.ru/connect/{token_value}"
