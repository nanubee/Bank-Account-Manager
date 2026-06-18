from pydantic import BaseModel
from decimal import Decimal
from datetime import date

# Request body for creating an RD
class RDCreate(BaseModel):
    account_id: int
    monthly_amount: Decimal
    interest_rate: Decimal
    start_date: date
    duration_months: int


# Response body for RD
class RDResponse(RDCreate):
    rd_id: int
    status: str

    class Config:
        from_attributes = True