from pathlib import Path

from aiogram import Router
from aiogram.types import Message
from aiogram.filters import Command
from aiogram.fsm.state import State

from dotenv import set_key, get_key

message_router = Router(name=__name__)
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
print(ENV_PATH)

@message_router.message(Command("start"))
async def start_handler(message: Message, state: State) -> None:
    chat_id = str(message.chat.id)
    
    if (get_key(str(ENV_PATH), "CHAT_ID")):
        await message.answer("Чат уже зарегистрирован")
        return
    
    set_key(str(ENV_PATH), "CHAT_ID", chat_id)
    
    await message.answer("Чат успешно зарегистрирован!")