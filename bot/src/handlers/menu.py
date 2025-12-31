from aiogram import F, Router
from aiogram.filters import Command
from aiogram.exceptions import TelegramBadRequest
from aiogram.types import CallbackQuery, Message

from bot.src.keyboards.main import main_menu_keyboard

router = Router()


@router.message(Command("menu"))
async def show_menu(message: Message) -> None:
    await message.answer("Главное меню:", reply_markup=main_menu_keyboard())


@router.callback_query(F.data == "main_menu")
async def main_menu_callback(callback: CallbackQuery) -> None:
    try:
        await callback.message.edit_text("Главное меню:", reply_markup=main_menu_keyboard())  # type: ignore[union-attr]
    except TelegramBadRequest:
        pass
    finally:
        await callback.answer()
