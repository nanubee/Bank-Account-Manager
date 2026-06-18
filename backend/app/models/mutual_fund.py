from sqlalchemy import Column, Integer, String, Numeric, Date,ForeignKey
from app.database import Base  

class MutualFund(Base):
    __tablename__="mutual_funds"

    mf_id = Column(Integer, primary_key=True)

    account_id = Column(Integer, ForeignKey("accounts.account_id"))

    fund_name=Column(String)

    invested_amount= Column(Numeric(12,2))

    current_value = Column(Numeric(12,2))

    purchase_date= Column(Date)

