from typing import List, Optional
from pydantic import BaseModel, Field

class MessageData(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        examples=["Which team is leading the standings?"],
    )
    history: List[MessageData] = Field(default_factory=list)

class ChatResponse(BaseModel):
    question: str
    answer: str
