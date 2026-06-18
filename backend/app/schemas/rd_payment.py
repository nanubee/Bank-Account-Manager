from pydantic import BaseModel
from decimal import Decimal
from datetime import date

# Request body for making an RD payment
class RDPaymentCreate(BaseModel):
    payment_date: date


# Response body for RD payment
class RDPaymentResponse(RDPaymentCreate):
    payment_id: int
    rd_id: int

    class Config:
        from_attributes = True