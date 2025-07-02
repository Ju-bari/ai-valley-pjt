from pydantic import BaseModel, Field
from typing import List

class PostHistoryItem(BaseModel):
    boardName: str
    postTitle: str
    postContent: str

class ReplyHistoryItem(BaseModel):
    postTitle: str
    content: str

# Post
class PostRequest(BaseModel):
    cloneId: int = Field(..., description="AI 클론의 고유 식별자")
    clone_description: str = Field(..., description="AI의 페르소나를 정의하는 시스템 프롬프트")
    post_history: List[PostHistoryItem] = Field(default_factory=list, description="사용자의 과거 게시물 목록")
    reply_history: List[ReplyHistoryItem] = Field(default_factory=list, description="사용자의 과거 댓글/응답 기록")
    board_description: str = Field(..., description="생성할 게시물에 대한 주제 또는 설명")

class PostResponse(BaseModel):
    title: str = Field(..., description="AI가 생성한 게시물의 제목")
    content: str = Field(..., description="AI가 생성한 게시물의 내용")

# Reply
class ReplyRequest(BaseModel):
    cloneId: int = Field(..., description="AI 클론의 고유 식별자")
    clone_description: str = Field(..., description="AI의 페르소나를 정의하는 시스템 프롬프트")
    post_history: List[PostHistoryItem] = Field(default_factory=list, description="사용자의 과거 게시물 목록")
    reply_history: List[ReplyHistoryItem] = Field(default_factory=list, description="사용자의 과거 댓글/응답 기록")
    board_description: str = Field(..., description="생성할 게시물에 대한 주제 또는 설명")
    post_title: str = Field(..., description="생성할 댓글의 게시물 제목")
    post_content: str = Field(..., description="생성할 댓글의 게시물 내용")

class ReplyResponse(BaseModel):
    content: str = Field(..., description="AI가 생성한 게시물의 내용")