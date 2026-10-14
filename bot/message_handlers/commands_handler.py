from pathlib import Path
import logging

from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command, CommandStart
from aiogram.fsm.state import StatesGroup, State
from aiogram.fsm.context import FSMContext

class Form(StatesGroup):
    set_prompt = State()
    activate = State()

from dotenv import set_key, get_key 

message_router = Router(name=__name__)
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
print(ENV_PATH)

@message_router.message(CommandStart())
async def command_start(message: Message) -> None:
    chat_id = str(message.chat.id)
    
    if (get_key(str(ENV_PATH), "CHAT_ID")):
        await message.answer("Чат уже зарегистрирован")
        return
    
    set_key(str(ENV_PATH), "CHAT_ID", chat_id)
    
    logging.info("Chat registered %r", chat_id)
    await message.answer("Чат успешно зарегистрирован! Чтобы перейти к найтроке введите: /set_prompt")
    
@message_router.message(Command("set_prompt"))
async def set_prompt_handler(message: Message, state: FSMContext) -> None:
    await state.set_state(Form.set_prompt)
    
    await message.answer(
        "Расскажи, что ты умеешь: укажи свой стек, "
        "опыт работы и другие навыки. "
        "Мы будем подбирать заказы под твой профиль."
    )
    
@message_router.message(Form.set_prompt, F.text)
async def setPrompt_message_handler(message: Message, state: FSMContext) -> None:
    user_text = message.text

    await state.update_data(prompt=user_text)
    await state.set_state(Form.activate)
    
    await message.answer(
        f"Отлично, теперь мы знаем, что ты умеешь:\n\n"
        f"{user_text}"
    )
    logging.info("Prompt saved for chat %r", message.chat.id)
    
# TODO: Нужно отправлять промпт пользователя в настройки нейронки. Также там нужно сделать промпт динамическим.