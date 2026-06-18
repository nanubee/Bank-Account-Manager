from pydantic import BaseModel

# Dashboard net worth response
class NetWorthResponse(BaseModel):
    bank_balance: float
    fd_value: float
    rd_value: float
    total_net_worth: float
    mf_value: float
    stock_value: float
    asset_value: float