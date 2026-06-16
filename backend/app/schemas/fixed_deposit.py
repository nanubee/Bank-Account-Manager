from pydantic import BaseModel, EmailStr
from decimal import Decimal
from datetime import date
#validates data

class FDCreate(BaseModel):
    account_id: int
    amount: float
    interest_rate: float
    start_date: date
    duration_months: int

class FDResponse(FDCreate):
    fd_id: int
    maturity_amount: float
    status: str

    class Config:
        from_attributes = True