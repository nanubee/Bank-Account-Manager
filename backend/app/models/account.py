#models.py describes how database tables look.
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric, Date
from datetime import datetime
from app.database import Base


class Account(Base):
    __tablename__ = "accounts"

    account_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    bank_name = Column(String(255), nullable=False)

    country = Column(String(255), nullable=False)

    account_type = Column(String(255), nullable=False)

    account_number_last4 = Column(
        String(4),
        nullable=False
    )

    balance = Column(
        Numeric(15, 2),
        nullable=False,
        default=0
    )

    currency = Column(String(255), nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )