from __future__ import annotations

import asyncio
import uuid
from dataclasses import dataclass

from yookassa import Configuration, Payment


@dataclass
class PaymentGatewayResponse:
    payment_id: str
    confirmation_url: str


class YookassaGateway:
    def __init__(self, shop_id: str, secret_key: str, return_url: str) -> None:
        Configuration.account_id = shop_id
        Configuration.secret_key = secret_key
        self._return_url = return_url

    async def create_payment(self, amount: int, currency: str, description: str, metadata: dict) -> PaymentGatewayResponse:
        payload = {
            "amount": {"value": f"{amount:.2f}", "currency": currency},
            "confirmation": {"type": "redirect", "return_url": self._return_url},
            "capture": True,
            "description": description,
            "metadata": metadata,
        }

        idempotence_key = uuid.uuid4().hex
        payment = await asyncio.to_thread(Payment.create, payload, idempotence_key)

        confirmation = payment.confirmation
        if confirmation is None or confirmation.confirmation_url is None:
            raise RuntimeError("YooKassa payment confirmation URL is missing")

        return PaymentGatewayResponse(
            payment_id=str(payment.id),
            confirmation_url=str(confirmation.confirmation_url),
        )
