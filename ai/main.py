import uvicorn
from fastapi import FastAPI
from typing import List  # List를 사용하기 위해 임포트합니다.

# openai_client.py에서 AI 함수를 가져옵니다.
from openai_client import get_post_response
# schema.py에서 데이터 모델을 가져옵니다.
from schema import PostRequest, PostResponse

# --- FastAPI 앱 초기화 ---
app = FastAPI()

# --- API 엔드포인트 정의 ---

@app.get("/")
async def root():
    return {"message": "AI 글쓰기 에이전트 서버"}

# `@app.post` 데코레이터에 `response_model`을 지정하여 출력 형식을 명시합니다.
@app.post("/post", response_model=PostResponse)
async def create_post(request_data: PostRequest):
    """
    게시물 생성을 요청받아 제목과 내용이 포함된 JSON 객체를 반환합니다.
    """
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

# --- 서버 실행 ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
