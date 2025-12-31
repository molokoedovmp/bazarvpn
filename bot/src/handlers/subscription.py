from __future__ import annotations

from datetime import datetime

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.exceptions import TelegramBadRequest
from aiogram.types import CallbackQuery, Message, User

from bot.src.keyboards.main import MenuActions, main_menu_keyboard
from bot.src.services.subscription_service import SubscriptionService
from bot.src.services.user_service import UserService
from bot.src.services.vpn_service import VPNService

router = Router()


def _format_expiration(expires_at: datetime | None) -> str:
    if expires_at is None:
        return "не указана"
    return expires_at.strftime("%d.%m.%Y %H:%M")


async def _ensure_user_record(
    telegram_id: int,
    user_service: UserService,
    telegram_user: User,
) -> dict | None:
    user = await user_service.get_by_telegram_id(telegram_id)
    if user is None:
        user = await user_service.ensure_user(telegram_user)
    return user


@router.message(Command("subscription"))
@router.callback_query(F.data == MenuActions.SUBSCRIPTION_INFO)
async def subscription_info(
    event: Message | CallbackQuery,
    user_service: UserService,
    subscription_service: SubscriptionService,
) -> None:
    tg_user = event.from_user
    if tg_user is None:
        return

    user = await _ensure_user_record(tg_user.id, user_service, tg_user)
    if user is None:
        return

    status_info = await subscription_service.get_status(str(user["id"]))
    status_map = {
        "active": "Активна",
        "inactive": "Не активна",
        "expired": "Истекла",
    }
    status_label = status_map.get(status_info.status, status_info.status)
    expires_text = _format_expiration(status_info.expires_at)

    text_lines = [
        f"Статус подписки: <b>{status_label}</b>",
        f"Тариф: {status_info.plan or 'не указан'}",
    ]
    if status_info.status == "active":
        text_lines.append(f"Действует до: {expires_text}")
    elif status_info.expires_at:
        text_lines.append(f"Истекла: {expires_text}")

    message_text = "\n".join(text_lines)

    if isinstance(event, CallbackQuery):
        try:
            await event.message.edit_text(message_text, reply_markup=main_menu_keyboard())  # type: ignore[union-attr]
        except TelegramBadRequest:
            pass
        finally:
            await event.answer()
    else:
        await event.answer(message_text, reply_markup=main_menu_keyboard())


@router.callback_query(F.data == MenuActions.CONNECT_VPN)
async def connect_vpn(
    callback: CallbackQuery,
    user_service: UserService,
    vpn_service: VPNService,
) -> None:
    tg_user = callback.from_user
    if tg_user is None:
        return

    user = await _ensure_user_record(tg_user.id, user_service, tg_user)
    if user is None:
        return

    connection_link = await vpn_service.get_connection_link(str(user["id"]))
    if connection_link is None:
        await callback.answer("Подписка неактивна. Оформите оплату, чтобы получить доступ.", show_alert=True)
        return

    try:
        await callback.message.edit_text(  # type: ignore[union-attr]
            f"Ваш доступ к VPN:\n{connection_link}",
            reply_markup=main_menu_keyboard(),
        )
    except TelegramBadRequest:
        pass
    finally:
        await callback.answer()
