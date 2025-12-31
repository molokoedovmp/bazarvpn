from __future__ import annotations

from dataclasses import dataclass

from bot.src.config import Settings
from bot.src.repositories.payment_repo import PaymentRepository
from bot.src.services.payment_gateway import PaymentGatewayResponse, YookassaGateway


@dataclass
class PaymentIntent:
    id: str
    status: str
    url: str


class PaymentService:
    def __init__(self, payment_repo: PaymentRepository, settings: Settings) -> None:
        self._payment_repo = payment_repo
        self._settings = settings
        self._gateway = self._build_gateway(settings)

    async def create_payment_intent(self, user_id: str) -> PaymentIntent:
        gateway_payment: PaymentGatewayResponse | None = None

        if self._gateway:
            gateway_payment = await self._gateway.create_payment(
                amount=self._settings.subscription_price,
                currency=self._settings.payment_currency,
                description="BazarVPN subscription",
                metadata={"user_id": user_id},
            )

        payment = await self._payment_repo.create_payment_intent(
            user_id=user_id,
            provider=self._settings.payment_provider if not self._gateway else "yookassa",
            amount=self._settings.subscription_price,
            currency=self._settings.payment_currency,
            status="pending",
            provider_payment_id=gateway_payment.payment_id if gateway_payment else None,
        )
        if payment is None:
            raise RuntimeError("Failed to create payment intent")

        payment_id = str(payment["id"])
        payment_url = gateway_payment.confirmation_url if gateway_payment else f"{self._settings.payment_page_base_url}/{payment_id}"

        return PaymentIntent(
            id=payment_id,
            status=payment["status"],
            url=payment_url,
        )

    def _build_gateway(self, settings: Settings) -> YookassaGateway | None:
        if settings.yookassa_shop_id and settings.yookassa_secret_key:
            return YookassaGateway(
                shop_id=settings.yookassa_shop_id,
                secret_key=settings.yookassa_secret_key,
                return_url=settings.yookassa_return_url or "https://bazarvpn.ru/thanks",
            )
        return None
