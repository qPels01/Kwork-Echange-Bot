import asyncio
import logging
import os

from dotenv import load_dotenv
from aiogram import Bot, Dispatcher
from aiogram.client.session.aiohttp import AiohttpSession
from message_handlers.commands_handler import message_router

load_dotenv()


async def main():
    session = AiohttpSession(
        proxy=f"http://{os.getenv("PROXY_USER")}:{os.getenv("PROXY_PASS")}@{os.getenv("PROXY_SERVER")}:{os.getenv("PROXY_PORT")}"
    )

    async with Bot(
        token=os.getenv("BOT_TOKEN"),
        session=session
    ) as bot:
        dp = Dispatcher()
        
        dp.include_routers(message_router)
        
        await bot.delete_webhook(drop_pending_updates=True)

        await dp.start_polling(
            bot,
            allowed_updates=dp.resolve_used_update_types()
        )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Exit")
