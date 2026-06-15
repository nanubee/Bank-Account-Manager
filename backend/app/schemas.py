from pydantic import BaseModel, EmailStr
from decimal import Decimal
#validates data

#registration
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str


#BankAcc
class AccountCreate(BaseModel):
    user_id: int
    bank_name: str
    country: str
    account_type: str
    account_number_last4: str
    balance: float
    currency: str

class TransactionCreate(BaseModel):
    account_id: int
    amount: float
    description: str

class TransferRequest(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: Decimal
    description: str | None = None