from aiogram import F, Router
from aiogram.filters import Command
from aiogram.exceptions import TelegramBadRequest
from aiogram.types import CallbackQuery, Message

from bot.src.keyboards.main import MenuActions, main_menu_keyboard

router = Router()

HELP_TEXT = (
    "Нужна помощь? Напишите нам в поддержку: support@bazarvpn.ru\n"
    "Мы работаем, чтобы вы оставались на связи."
)


@router.message(Command("help"))
async def help_command(message: Message) -> None:
    await message.answer(HELP_TEXT, reply_markup=main_menu_keyboard())


@router.callback_query(F.data == MenuActions.HELP)
async def help_callback(callback: CallbackQuery) -> None:
    try:
        await callback.message.edit_text(HELP_TEXT, reply_markup=main_menu_keyboard())  # type: ignore[union-attr]
    except TelegramBadRequest:
        pass
    finally:
        await callback.answer()
