from pydantic import BaseModel
from datetime import date


class MFCreate(BaseModel):
    account_id: int
    fund_name: str
    invested_amount: float
    current_value: float
    purchase_date: date

class MFResponse(MFCreate):
    mf_id: int
    class Config:
        from_attributes = True

class MFUpdate(BaseModel):
    fund_name: str
    invested_amount: float
    current_value: float