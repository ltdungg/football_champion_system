from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user_optional
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import ChatService

router = APIRouter()


@router.post(
    "/ask",
    response_model=ChatResponse,
    summary="Ask a question about the tournament",
    description=(
        "Send a natural-language question and get an AI-generated answer "
        "based on live tournament data (standings, matches, teams, players)."
    ),
)
async def ask_chatbot(
    body: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Example questions:
    - "Tạo 1 trận đấu giữa Arsenal và MU"
    - "Which team is leading the standings?"
    """
    service = ChatService(db, current_user)
    answer = service.ask(body.question, body.history)
    return ChatResponse(question=body.question, answer=answer)
