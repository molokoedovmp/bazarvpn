import asyncio
import logging

from aiogram import Dispatcher

from bot.src.bot import create_bot
from bot.src.config import load_config
from bot.src.db.database import Database
from bot.src.handlers import help as help_handler
from bot.src.handlers import menu, payment, start, subscription
from bot.src.middlewares.service_middleware import ServiceMiddleware
from bot.src.repositories.payment_repo import PaymentRepository
from bot.src.repositories.subscription_repo import SubscriptionRepository
from bot.src.repositories.token_repo import TokenRepository
from bot.src.repositories.user_repo import UserRepository
from bot.src.services.payment_service import PaymentService
from bot.src.services.subscription_service import SubscriptionService
from bot.src.services.user_service import UserService
from bot.src.services.vpn_service import VPNService


async def main() -> None:
    logging.basicConfig(level=logging.INFO)

    config = load_config()

    database = Database(config.database_url)
    await database.connect()

    user_repo = UserRepository(database)
    subscription_repo = SubscriptionRepository(database)
    payment_repo = PaymentRepository(database)
    token_repo = TokenRepository(database)

    subscription_service = SubscriptionService(subscription_repo)
    user_service = UserService(user_repo)
    payment_service = PaymentService(payment_repo, config)
    vpn_service = VPNService(subscription_service, token_repo)

    bot = create_bot(config.bot_token)
    dispatcher = Dispatcher()

    service_middleware = ServiceMiddleware(
        user_service=user_service,
        subscription_service=subscription_service,
        payment_service=payment_service,
        vpn_service=vpn_service,
    )

    dispatcher.message.middleware(service_middleware)
    dispatcher.callback_query.middleware(service_middleware)

    dispatcher.include_router(start.router)
    dispatcher.include_router(menu.router)
    dispatcher.include_router(subscription.router)
    dispatcher.include_router(payment.router)
    dispatcher.include_router(help_handler.router)

    try:
        await dispatcher.start_polling(bot)
    finally:
        await database.close()


if __name__ == "__main__":
    asyncio.run(main())
