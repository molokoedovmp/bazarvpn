from __future__ import annotations

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.exceptions import TelegramBadRequest
from aiogram.types import CallbackQuery, Message, User

from bot.src.keyboards.main import MenuActions, main_menu_keyboard
from bot.src.services.payment_service import PaymentService
from bot.src.services.subscription_service import SubscriptionService
from bot.src.services.user_service import UserService

router = Router()


async def _ensure_user_record(user_service: UserService, event_user: User) -> dict | None:
    user = await user_service.get_by_telegram_id(event_user.id)
    if user is None:
        user = await user_service.ensure_user(event_user)
    return user


@router.message(Command("pay"))
@router.callback_query(F.data == MenuActions.PAY_SUBSCRIPTION)
async def create_payment(
    event: Message | CallbackQuery,
    user_service: UserService,
    payment_service: PaymentService,
    subscription_service: SubscriptionService,
) -> None:
    tg_user = event.from_user
    if tg_user is None:
        return

    user = await _ensure_user_record(user_service, tg_user)
    if user is None:
        return

    status_info = await subscription_service.get_status(str(user["id"]))
    if status_info.is_active and not status_info.is_expired:
        expires = (
            status_info.expires_at.strftime("%d.%m.%Y")
            if status_info.expires_at is not None
            else "без даты окончания"
        )
        text = (
            "Подписка уже активна.\n"
            f"Дата окончания: {expires}.\n"
            "Оплата сейчас не требуется."
        )
        if isinstance(event, CallbackQuery):
            try:
                await event.message.edit_text(text, reply_markup=main_menu_keyboard())  # type: ignore[union-attr]
            except TelegramBadRequest:
                pass
            finally:
                await event.answer()
        else:
            await event.answer(text, reply_markup=main_menu_keyboard())
        return

    payment_intent = await payment_service.create_payment_intent(str(user["id"]))

    text = (
        "Ссылка для оплаты подписки:\n"
        f"{payment_intent.url}\n\n"
        "После оплаты возвращайтесь в бот: статус будет подтвержден после обработки платежа оператором."
    )

    if isinstance(event, CallbackQuery):
        try:
            await event.message.edit_text(text, reply_markup=main_menu_keyboard())  # type: ignore[union-attr]
        except TelegramBadRequest:
            pass
        finally:
            await event.answer()
    else:
        await event.answer(text, reply_markup=main_menu_keyboard())
