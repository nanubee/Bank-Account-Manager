from pydantic import BaseModel, EmailStr
from decimal import Decimal
from datetime import date
#validates data

#BankAcc
class AccountCreate(BaseModel):
    user_id: int
    bank_name: str
    country: str
    account_type: str
    account_number_last4: str
    balance: float
    currency: str