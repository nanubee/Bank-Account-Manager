#models.py describes how database tables look.
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__="users"

    user_id= Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique= True, nullable= False)
    password_hash = Column(String(255), nullable=False)
    role= Column(String(20), nullable=False)

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