from aiogram.types import InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder


class MenuActions:
    CONNECT_VPN = "connect_vpn"
    PAY_SUBSCRIPTION = "pay_subscription"
    SUBSCRIPTION_INFO = "subscription_info"
    HELP = "help"


def main_menu_keyboard() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="🔑 Подключить VPN", callback_data=MenuActions.CONNECT_VPN)
    builder.button(text="💳 Оплатить подписку", callback_data=MenuActions.PAY_SUBSCRIPTION)
    builder.button(text="📄 Моя подписка", callback_data=MenuActions.SUBSCRIPTION_INFO)
    builder.button(text="❓ Помощь", callback_data=MenuActions.HELP)
    builder.adjust(1)
    return builder.as_markup()
