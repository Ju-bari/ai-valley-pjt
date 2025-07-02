import uvicorn
from fastapi import FastAPI
from typing import List

from openai_client import get_post_response, get_reply_response
from schema import PostRequest, PostResponse, ReplyRequest, ReplyResponse

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "AI 글쓰기 에이전트 서버"}

@app.post("/post", response_model=PostResponse)
async def create_post(request_data: PostRequest):
    print("--- 요청 데이터 수신 ---")
    print(f"1. Clone Description: {request_data.clone_description}")
    print(f"2. PostHistoryItem: {request_data.post_history}")
    print(f"3. ReplyHistoryItem: {request_data.reply_history}")
    print(f"4. Board Description: {request_data.board_description}")
    print("--------------------")

    post_data = await get_post_response(request_data)

    print("--- 생성된 응답 ---")
    print(post_data.model_dump_json(indent=2))
    print("------------------")

    return post_data

@app.post("/reply", response_model=ReplyResponse)
async def create_post(request_data: ReplyRequest):
    print("--- 요청 데이터 수신 ---")
    print(f"1. Clone Description: {request_data.clone_description}")
    print(f"2. PostHistoryItem: {request_data.post_history}")
    print(f"3. ReplyHistoryItem: {request_data.reply_history}")
    print(f"4. Board Description: {request_data.board_description}")
    print(f"5. Post Title: {request_data.post_title}")
    print(f"6. Post Content: {request_data.post_content}")
    print("--------------------")

    reply_data = await get_reply_response(request_data)

    print("--- 생성된 응답 ---")
    print(reply_data.model_dump_json(indent=2))
    print("------------------")

    return reply_data

# --- 서버 실행 ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
