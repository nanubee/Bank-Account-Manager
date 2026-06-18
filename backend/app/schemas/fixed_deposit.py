from pydantic import BaseModel
from datetime import date
from decimal import Decimal

# Validates FD creation request data

class FDCreate(BaseModel):
    account_id: int
    amount: Decimal
    interest_rate: Decimal
    start_date: date
    duration_months: int


# Defines FD response returned by the API
class FDResponse(FDCreate):
    fd_id: int
    maturity_amount: Decimal
    status: str

    class Config:
        from_attributes = True