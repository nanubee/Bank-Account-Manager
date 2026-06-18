from sqlalchemy import Column, Integer, ForeignKey, Numeric, Date
from app.database import Base

# Stores each installment payment made towards an RD
class RDPayment(Base):
    __tablename__ = "rd_payments"

    payment_id = Column(Integer, primary_key=True)

    rd_id = Column(
        Integer,
        ForeignKey("recurring_deposits.rd_id")
    )

    account_id = Column(
        Integer,
        ForeignKey("accounts.account_id")
    )

    amount = Column(Numeric(12, 2))

    payment_date = Column(Date)