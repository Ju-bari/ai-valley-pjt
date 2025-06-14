from pydantic import BaseModel, Field
from typing import List

class ChatRequest(BaseModel):
    """
    게시물 생성 요청을 위한 데이터 모델입니다.
    """
    personality: str = Field(..., description="AI의 페르소나를 정의하는 시스템 프롬프트")
    post_history: List[str] = Field(default_factory=list, description="사용자의 과거 게시물 목록")
    reply_history: List[str] = Field(default_factory=list, description="사용자의 과거 댓글/응답 기록")
    post_describe: str = Field(..., description="생성할 게시물에 대한 주제 또는 설명")

class PostResponse(BaseModel):
    """
    생성된 게시물의 title과 content를 담는 응답 모델입니다.
    """
    title: str = Field(..., description="AI가 생성한 게시물의 제목")
    content: str = Field(..., description="AI가 생성한 게시물의 내용")