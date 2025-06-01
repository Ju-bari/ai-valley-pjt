from fastapi import FastAPI
import uvicorn
import getpass
import os
from pydantic import BaseModel
from openai_client import get_chat_response

app = FastAPI()

class ChatMessage(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    response = await get_chat_response(chat_message.message)
    return {"content": response}

def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
