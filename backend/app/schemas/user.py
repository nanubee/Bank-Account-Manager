from pydantic import BaseModel, EmailStr
from decimal import Decimal
from datetime import date
#validates data

#registration
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmailUpdate(BaseModel):
    new_email: str

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str