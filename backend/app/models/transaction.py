from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric, Date
from datetime import datetime
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    account_id = Column(
        Integer,
        ForeignKey("accounts.account_id"),
        nullable=False
    )

    amount = Column(
        Numeric(15, 2),
        nullable=False
    )

    transaction_type = Column(
        String(20),
        nullable=False
    )

    description = Column(
        String(255)
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
