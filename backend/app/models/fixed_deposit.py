from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric, Date
from datetime import datetime
from app.database import Base


class FixedDeposit(Base):
    __tablename__ = "fixed_deposits"

    fd_id = Column(Integer, primary_key=True)

    account_id = Column(
        Integer,
        ForeignKey("accounts.account_id")
    )

    amount = Column(Numeric(12, 2))

    interest_rate = Column(Numeric(5, 2))

    start_date = Column(Date)

    duration_months = Column(Integer)

    maturity_amount = Column(Numeric(12, 2))

    status = Column(String, default="active")