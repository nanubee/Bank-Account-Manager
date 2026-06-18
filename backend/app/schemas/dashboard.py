from pydantic import BaseModel
from decimal import Decimal

# Dashboard net worth response
class NetWorthResponse(BaseModel):
    bank_balance: Decimal
    fd_value: Decimal
    rd_value: Decimal
    total_net_worth: Decimal