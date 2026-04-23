import json
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool

from app.core.config import settings
from app.models.user import User

# Imports for services to be used by tools
from app.services.team import TeamService
from app.schemas.team import TeamCreate
from app.services.player import PlayerService
from app.schemas.player import PlayerCreate
from app.services.match import MatchService
from app.schemas.match import MatchCreate
from app.utils.tournament_table import TournamentTableCalculator

class ChatService:
    def __init__(self, db: Session, current_user: User | None = None):
        self.db = db
        self.current_user = current_user
        self.calculator = TournamentTableCalculator(db)

    def ask(self, question: str, history: List[Dict[str, str]]) -> str:
        """Answer a natural-language question or take actions via LangGraph."""
        if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key-here":
            return "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment."

        # Bind closure variables for the tools
        db = self.db
        user_id = self.current_user.id if self.current_user else 0
        role = self.current_user.role if self.current_user else "anonymous guest"
        
        @tool
        def create_team(name: str, city: str, coach: str, last_season_place: int) -> str:
            """Create a new football team in the tournament."""
            try:
                service = TeamService(db)
                req = TeamCreate(name=name, city=city, coach=coach, last_season_place=last_season_place)
                team = service.create_team(req, user_id)
                return f"Successfully created team '{team.name}' with ID {team.id}."
            except Exception as e:
                return f"Error creating team: {str(e)}"

        @tool
        def create_player(team_id: int, first_name: str, last_name: str, age: int, jersey_number: int, position: str) -> str:
            """
            Create a new player and assign them to a team. 
            position must be one of: GK, DEF, MID, FWD.
            """
            try:
                service = PlayerService(db)
                req = PlayerCreate(
                    team_id=team_id, first_name=first_name, last_name=last_name,
                    age=age, jersey_number=jersey_number, position=position
                )
                player = service.create_player(req, user_id)
                return f"Successfully created player '{player.first_name} {player.last_name}' with ID {player.id}."
            except Exception as e:
                return f"Error creating player: {str(e)}"

        @tool
        def create_match(home_team_id: int, away_team_id: int, stadium_id: int, date_iso: str) -> str:
            """
            Schedule a new match between two teams at a specific stadium.
            date_iso must be ISO 8601 string (e.g. 2025-06-15T15:00:00).
            """
            try:
                service = MatchService(db)
                req = MatchCreate(
                    home_team_id=home_team_id, away_team_id=away_team_id,
                    stadium_id=stadium_id, date=datetime.fromisoformat(date_iso)
                )
                match = service.create_match(req, user_id)
                return f"Successfully scheduled match ID {match.id} on {match.date}."
            except Exception as e:
                return f"Error creating match: {str(e)}"

        @tool
        def get_standings() -> str:
            """Get the current tournament standings table with points, wins, etc."""
            try:
                standings = self.calculator.calculate_standings()
                rows = []
                for i, s in enumerate(standings, 1):
                    rows.append(
                        f"{i}. {s.team_name} - P:{s.matches_played} W:{s.wins} D:{s.draws} "
                        f"L:{s.losses} GF:{s.goals_scored} GA:{s.goals_conceded} Pts:{s.points}"
                    )
                return "\n".join(rows) if rows else "No standings available."
            except Exception as e:
                return f"Error fetching standings: {str(e)}"

        # Prepare the LLM
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
            api_key=settings.GEMINI_API_KEY
        )
        
        tools_list = [get_standings]
        if self.current_user and self.current_user.role in ["admin", "manager"]:
            tools_list.extend([create_team, create_player, create_match])
        
        system_prompt = (
            "You are a helpful AI assistant for a Football Championship System.\n"
            "You have access to tools to fetch standings. "
            "If the user is authorized, you may also have tools to create teams, schedule matches, and add players.\n"
            f"The user making the request has role: {role}. "
            "If they ask to do something you have a tool for, execute it. If it succeeds, confirm it.\n"
            "If they ask for something you do not have a tool for, apologize and explain you cannot do that.\n"
            "If an action requires an ID (like team_id), use your tools to find it first if needed, "
            "or ask the user for clarification. Be concise and friendly. Respond in the language the user speaks."
        )

        agent = create_react_agent(llm, tools=tools_list)
        
        # Parse history into LangChain message format
        messages = [SystemMessage(content=system_prompt)]
        for msg in history:
            msg_role = msg.role
            content = msg.content
            if msg_role == "user":
                messages.append(HumanMessage(content=content))
            elif msg_role == "assistant":
                messages.append(AIMessage(content=content))
        
        messages.append(HumanMessage(content=question))
        
        # Run agent
        try:
            response = agent.invoke({"messages": messages})
            # The final response is the last message in the list
            final_msg = response["messages"][-1].content
            return final_msg
        except Exception as e:
            return f"Agent error: {str(e)}"

