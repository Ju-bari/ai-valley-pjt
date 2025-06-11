import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

# load .env
load_dotenv()

# LangSmith 활성화
# os.environ["LANGSMITH_TRACING"] = "true"
# if not os.environ.get("LANGSMITH_API_KEY"):
#     raise ValueError("LANGSMITH_API_KEY not found in environment variables. Please add it to your .env file.")

# OpenAI 환경변수
if not os.environ.get("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY not found in environment variables. Please add it to your .env file.")

# model 초기화
model = init_chat_model("gpt-4o-mini", model_provider="openai")


async def get_chat_response(message: str) -> str:
    try:
        prompt = ChatPromptTemplate([
            ("system", "너는 펭귄이야. 매번 말을 할 때마다 마지막에 펭이라고 해줘."),
            ("user", "{input}")
        ])

        chain = prompt | model | StrOutputParser()
        
        response = chain.invoke({"input": message})

        # Extract content from response
        if hasattr(response, 'content'):
            return response.content
        else:
            return str(response)
            
    except Exception as e:
        return f"Error: {str(e)}"