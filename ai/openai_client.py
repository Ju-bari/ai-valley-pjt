import os
from dotenv import load_dotenv
from fastapi import HTTPException, status

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from schema import PostRequest, PostResponse, ReplyRequest, ReplyResponse

# --- AI 세팅 ---
load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY가 .env 파일이나 환경변수에 설정되지 않았습니다.")

model = ChatOpenAI(model="gpt-4o-mini")

post_json_parser = JsonOutputParser(pydantic_object=PostResponse)
reply_json_parser = JsonOutputParser(pydantic_object=ReplyResponse)

# --- AI 응답 생성 함수 ---
async def get_post_response(request_data: PostRequest) -> PostResponse:
    try:
        prompt = ChatPromptTemplate.from_messages([
            ("system",
             "당신은 마스터를 대신하여 게시글을 작성하는 유능한 AI 에이전트입니다. "
             "사용자의 지침에 따라 글의 제목과 내용을 생성해야 합니다."
             "{format_instructions}"),
            ("human", """
                # 성향
                {clone_description}

                # 목표
                - 당신은 아래 성향과 게시판 주제에 맞춰 글을 작성해야 합니다.
                - 당신이 작성한 과거 게시물과 댓글을 참고하여 다른 글을 작성하세요.
                - 해당 성향을 기반으로 창의적으로 글을 작성하세요. (성향을 바탕으로 자연스럽게 생성)
                - 특정 주제를 선정하고, 사람들과 이야기를 할 수 있는 주제를 던지세요.
                - 실제 사람이라 생각하고 사람이 쓸 법한 글을 만드세요.
                - 마지막에 요약 내용을 추가하는 것을 권장합니다.

                # 본인의 과거 게시물
                {post_history}

                # 본인의 과거 댓글
                {reply_history}

                # 현재 작성중인 게시판의 주제
                {board_description}

                # 주의할 점
                - 글의 제목(title)과 내용(content)을 생성해주세요.
                - 적절하게 '\n'을 넣어 가독성 향상하세요. ('\\n'로 작성하지 않기)
                - 글의 분량은 적당히 넣어주세요.
                """),
        ])

        chain = prompt | model | post_json_parser

        response_dict = await chain.ainvoke({
            "clone_description": request_data.clone_description,
            "post_history": request_data.post_history,
            "reply_history": request_data.reply_history,
            "board_description": request_data.board_description,
            "format_instructions": post_json_parser.get_format_instructions(),
        })

        return PostResponse(**response_dict)

    except Exception as e:
        print(f"Internal server error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI 서버에서 게시글 생성 중 오류가 발생했습니다: {str(e)}"
        )


async def get_reply_response(request_data: ReplyRequest) -> ReplyResponse:
    try:
        prompt = ChatPromptTemplate.from_messages([
            ("system",
             "당신은 마스터를 대신하여 댓글을 작성하는 유능한 AI 에이전트입니다. "
             "사용자의 지침에 따라 글의 내용을 생성해야 합니다."
             "{format_instructions}"),
            ("human", """
                # 성향
                {clone_description}

                # 목표
                - 당신은 아래 성향과 게시판 주제, 게시글 내용에 맞춰 댓글을 작성해야 합니다.
                - 당신이 작성한 과거 게시물과 댓글을 참고하여 다른 글을 작성하세요.
                - 해당 성향을 기반으로 창의적으로 글을 작성하세요. (성향 이야기는 하지 않기)
                - 실제 사람이라 생각하고 사람이 쓸 법한 글을 만드세요. (구체적일수록 좋음)

                # 본인의 과거 게시물
                {post_history}

                # 본인의 과거 댓글
                {reply_history}

                # 현재 작성중인 게시판의 주제
                {board_description}

                # 댓글을 달아야 할 게시글의 제목과 내용
                {post_title}
                {post_content}

                # 주의할 점
                - 글의 내용(content)을 생성해주세요.
                - 적절하게 '\n'을 넣어 가독성 향상하세요. ('\\n'로 작성하지 않기)
                - 댓글 답게 글을 짧게 작성해줘.
                """),
        ])

        chain = prompt | model | reply_json_parser

        response_dict = await chain.ainvoke({
            "clone_description": request_data.clone_description,
            "post_history": request_data.post_history,
            "reply_history": request_data.reply_history,
            "board_description": request_data.board_description,
            "post_title": request_data.post_title,
            "post_content": request_data.post_content,
            "format_instructions": reply_json_parser.get_format_instructions(),
        })

        return ReplyResponse(**response_dict)

    except Exception as e:
        print(f"Internal server error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI 서버에서 댓글 생성 중 오류가 발생했습니다: {str(e)}"
        )