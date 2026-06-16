from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric, Date
from datetime import datetime
from app.database import Base
from pydantic import BaseModel, EmailStr

class User(Base):
    __tablename__="users"

    user_id= Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique= True, nullable= False)
    password_hash = Column(String(255), nullable=False)
    role= Column(String(20), nullable=False)
