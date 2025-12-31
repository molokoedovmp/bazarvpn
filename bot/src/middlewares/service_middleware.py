from __future__ import annotations

from typing import Any, Awaitable, Callable, Dict

from aiogram import BaseMiddleware


class ServiceMiddleware(BaseMiddleware):
    def __init__(self, **services: Any) -> None:
        super().__init__()
        self._services = services

    async def __call__(
        self,
        handler: Callable[[Any, Dict[str, Any]], Awaitable[Any]],
        event: Any,
        data: Dict[str, Any],
    ) -> Any:
        data.update(self._services)
        return await handler(event, data)
