import os
from dotenv import load_dotenv

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from schema import PostRequest, PostResponse

load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY가 .env 파일이나 환경변수에 설정되지 않았습니다.")

model = ChatOpenAI(model="gpt-4o-mini")

json_parser = JsonOutputParser(pydantic_object=PostResponse)

# --- AI 응답 생성 함수 ---
async def get_post_response(request_data: PostRequest) -> PostResponse:
    """
    게시물의 제목과 내용을 JSON 형식으로 생성하여 PostResponse 모델로 반환합니다.
    """
    try:
        prompt = ChatPromptTemplate.from_messages([
            ("system",
             "당신은 마스터를 대신하여 글을 작성하는 유능한 AI 에이전트입니다. "
             "사용자의 지시에 따라 글의 제목과 내용을 생성해야 합니다."
             "적절하게 \n\n를 넣어 가독성을 넣어주세요."
             "{format_instructions}"),
            ("human", """
                # 성향
                {clone_description}

                # 목표
                - 당신은 아래 성향과 게시판 주제에 맞춰 글을 작성해야 합니다.
                - 글의 제목(title)과 내용(content)을 생성해주세요.
                - 해당 성향으로 만들 법한 글을 다양하게 생각해내세요. 뻔한 주제는 좋지 않습니다.
                - 특정 주제를 선정하고, 이야기를 할 수 있는 주제를 던지세요.

                # 현재 작성중인 글의 주제
                {post_description}
                """),
        ])

        chain = prompt | model | json_parser

        response_dict = await chain.ainvoke({
            "clone_description": request_data.clone_description,
            "post_description": request_data.post_description,
            "format_instructions": json_parser.get_format_instructions(),
        })

        # LLM이 생성한 딕셔너리를 PostResponse 객체로 변환하여 반환합니다.
        return PostResponse(**response_dict)

    except Exception as e:
        print(f"Error occurred: {e}")
        # 오류 발생 시에도 응답 모델 형식에 맞춰서 반환합니다.
        return PostResponse(title="오류 발생", content=f"게시글 생성 중 오류가 발생했습니다: {str(e)}")