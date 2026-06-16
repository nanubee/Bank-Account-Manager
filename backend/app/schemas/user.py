from pydantic import BaseModel, EmailStr
from decimal import Decimal
from datetime import date
#validates data

#registration
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str