from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message

from bot.src.keyboards.main import main_menu_keyboard
from bot.src.services.user_service import UserService

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message, user_service: UserService) -> None:
    user = message.from_user
    if user is None:
        return

    await user_service.ensure_user(user)
    await message.answer(
        "Добро пожаловать в BazarVPN! Здесь вы можете управлять своей подпиской и доступом к VPN.",
        reply_markup=main_menu_keyboard(),
    )
