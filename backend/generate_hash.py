# backend/generate_hash.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- ENTER YOUR NEW PASSWORD HERE ---
password_to_hash = "password123" 
# ------------------------------------

hashed_password = pwd_context.hash(password_to_hash)

print(f"Password: {password_to_hash}")
print(f"Hashed Password: {hashed_password}")