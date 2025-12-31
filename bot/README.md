# BazarVPN Telegram Bot

Async Telegram bot for managing BazarVPN subscriptions and VPN access.

## Setup
- Python 3.11+
- `python -m venv .venv && source .venv/bin/activate`
- `pip install -r requirements.txt`
- Copy `.env.example` to `.env` (update values if needed).

## Run
- From repository root: `python3 -m bot.src.main`

## YooKassa test setup
- Set `YOOKASSA_SHOP_ID` and `YOOKASSA_SECRET_KEY` in `.env` (test credentials work).
- Optional: adjust `YOOKASSA_RETURN_URL` for redirect after payment.
- Если YooKassa vars заданы, бот создаёт ссылку на оплату. Подтверждение оплаты в боте не выполняется (нет вебхука) — проверка/активация должна выполняться вручную или отдельным обработчиком платежей.

## Structure
- `bot/src/config.py` – env loading.
- `bot/src/db/database.py` – asyncpg pool.
- `bot/src/repositories/*` – DB access layer.
- `bot/src/services/*` – business workflows.
- `bot/src/handlers/*` – Telegram handlers.
- `bot/src/keyboards/main.py` – main inline keyboard.
