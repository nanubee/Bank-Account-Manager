from pydantic import BaseModel

#validates data

#BankAcc
class AccountCreate(BaseModel):
    bank_name: str
    country: str
    account_type: str
    account_number_last4: str
    balance: float
    currency: str