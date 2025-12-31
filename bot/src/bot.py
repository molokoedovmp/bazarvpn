from aiogram import Bot
from aiogram.enums import ParseMode


def create_bot(token: str) -> Bot:
    return Bot(token=token, parse_mode=ParseMode.HTML)
