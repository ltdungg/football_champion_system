import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv("d:/API/football_championship_system/backend/.env")
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your-gemini-api-key-here":
    print("NO API KEY")
    exit(0)

genai.configure(api_key=api_key)

class AgentTools:
    def __init__(self, user_name):
        self.user_name = user_name

    def hello_world(self, msg: str) -> str:
        """Say hello to the current user with a message."""
        return f"Hello {self.user_name}, you said: {msg}. Tool executed successfully!"

tools = AgentTools("TestUser")

model = genai.GenerativeModel(
    model_name='gemini-2.5-flash',
    tools=[tools.hello_world]
)
chat = model.start_chat(enable_automatic_function_calling=True)
res = chat.send_message("Say hello to me with the message 'I love football'")
print("Response:", res.text)
