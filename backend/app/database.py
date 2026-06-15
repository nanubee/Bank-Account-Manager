from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:0411@localhost:5432/bank_manager"

engine = create_engine(DATABASE_URL) #connection between python and postgressql
SessionLocal = sessionmaker( #Open conversation with database
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base() #This allows SQLAlchemy models

def get_db(): #create session, Open connection, Use connection, Close connection
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()