# Football Championship Management System ⚽🏆

A comprehensive system for managing football championships. Allows you to keep track of teams, players, stadiums, plan matches, calculate ticket prices and generate tournament tables.

## 🚀 Technology stack

### Backend
- **Framework:** FastAPI (Python 3.11)
- **ORM:** SQLAlchemy (PostgreSQL)
- **Validation:** Pydantic v2
- **Auth:** JWT (Jose), Passlib (bcrypt)
- **Docs:** Swagger UI & ReDoc (automatic generation)

### Frontend
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React / Heroicons

### Infrastructure
- **Containerization:** Docker, Docker Compose
- **Database:** PostgreSQL 15
- **Proxy:** Nginx (for frontend in Docker)

## ✨ Key Features
- **User management:** Registration, login and roles (Admin / Manager).
- **Teams and Players:** Full cycle CRUD for train management.
- **Stadiums:** Accounting for sites and their capacity.
- **Matches:** Schedule games, enter results and automatically update the tournament table.
- **Ticket system:** Ticket cost calculator depending on category and match status.
- **Audit:** Logging important user actions in the system.
- **Reports:** Generating analytical data for the championship.

## 🛠 Installation and launch

### Prerequisites
- Docker And Docker Compose

### Quick start
1. Clone the repository:
```bash
git clone https://github.com/your-username/football_championship_system.git
cd football_championship_system
```
Set up environment variables:

Copy .env.example V backend/.env and fill it out.

Run the project via Docker Compose:

```bash
docker-compose up --build
```

The system will be available at the following addresses::

Frontend: http://localhost:8080

Backend API: http://localhost:8000

Swagger UI: http://localhost:8000/docs

📂 Project structure

backend/app — Source code API (Routers, Services, Repositories, Models).

frontend/src — Client application on React.

database/ — Initialization scripts (init.sql) and initial data (seed.sql).

docker-compose.yml — Configuration of the entire infrastructure.

🔒 Security

To access API used JWT-token. Passwords are hashed using bcrypt. Access rights are differentiated at the level of roles in the application.
