from pydantic import BaseModel, EmailStr
from decimal import Decimal
from datetime import date
#validates data

class TransactionCreate(BaseModel):
    account_id: int
    amount: float
    description: str

class TransferRequest(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: Decimal
    description: str | None = None