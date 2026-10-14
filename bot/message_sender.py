import os
from aiogram import Bot

async def send_message(bot: Bot, text: str) -> None:
    await bot.send_message(
        chat_id=os.getenv("CHAT_ID"),
        text=text
    )