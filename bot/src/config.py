from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass
class Settings:
    bot_token: str
    database_url: str
    payment_provider: str
    payment_currency: str
    subscription_price: int
    payment_page_base_url: str
    yookassa_shop_id: str | None
    yookassa_secret_key: str | None
    yookassa_return_url: str | None


def load_config() -> Settings:
    load_dotenv()

    bot_token = os.getenv("BOT_TOKEN")
    database_url = os.getenv("DATABASE_URL")

    if not bot_token or not database_url:
        raise RuntimeError("BOT_TOKEN and DATABASE_URL are required")

    payment_provider = os.getenv("PAYMENT_PROVIDER", "placeholder")
    payment_currency = os.getenv("PAYMENT_CURRENCY", "RUB")
    subscription_price = int(os.getenv("SUBSCRIPTION_PRICE", "499"))
    payment_page_base_url = os.getenv(
        "PAYMENT_PAGE_BASE_URL",
        "https://pay.bazarvpn.ru/pay",
    )
    yookassa_shop_id = os.getenv("YOOKASSA_SHOP_ID")
    yookassa_secret_key = os.getenv("YOOKASSA_SECRET_KEY")
    yookassa_return_url = os.getenv("YOOKASSA_RETURN_URL", "https://bazarvpn.ru/thanks")

    return Settings(
        bot_token=bot_token,
        database_url=database_url,
        payment_provider=payment_provider,
        payment_currency=payment_currency,
        subscription_price=subscription_price,
        payment_page_base_url=payment_page_base_url,
        yookassa_shop_id=yookassa_shop_id,
        yookassa_secret_key=yookassa_secret_key,
        yookassa_return_url=yookassa_return_url,
    )
