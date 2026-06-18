from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Date
from app.database import Base

# Stores RD master information
class RecurringDeposit(Base):
    __tablename__ = "recurring_deposits"

    rd_id = Column(Integer, primary_key=True)

    account_id = Column(
        Integer,
        ForeignKey("accounts.account_id")
    )

    monthly_amount = Column(Numeric(12, 2))

    interest_rate = Column(Numeric(5, 2))

    start_date = Column(Date)

    duration_months = Column(Integer)

    status = Column(String, default="active")