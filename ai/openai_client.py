import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage


# load .env
load_dotenv()

# LangSmith
# os.environ["LANGSMITH_TRACING"] = "true"
# if not os.environ.get("LANGSMITH_API_KEY"):
#     raise ValueError("LANGSMITH_API_KEY not found in environment variables. Please add it to your .env file.")

# OpenAI
if not os.environ.get("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY not found in environment variables. Please add it to your .env file.")


# model 초기화
model = init_chat_model("gpt-4o-mini", model_provider="openai")

async def get_chat_response(message: str) -> str:
    try:
        # Create conversation with context
        messages = [
            AIMessage(content="Your name is Bob!"),
            HumanMessage(content=message)
        ]
        
        # Get response from the model
        response = model.invoke(messages)
        
        # Extract content from response
        if hasattr(response, 'content'):
            return response.content
        else:
            return str(response)
            
    except Exception as e:
        return f"Error: {str(e)}"