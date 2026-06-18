from pydantic import BaseModel
from datetime import date


class StockCreate(BaseModel):
    account_id: int
    stock_name: str
    invested_amount: float
    current_value: float
    purchase_date: date


class StockUpdate(BaseModel):
    stock_name: str
    invested_amount: float
    current_value: float


class StockResponse(StockCreate):
    stock_id: int

    class Config:
        from_attributes = True