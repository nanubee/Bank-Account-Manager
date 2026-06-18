from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database import get_db

from app.models.account import Account
from app.models.fixed_deposit import FixedDeposit
from app.models.rd_payment import RDPayment

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# Returns overall financial summary
@router.get("/net-worth")
def get_net_worth(
    db: Session = Depends(get_db)
):

    accounts = db.query(Account).all()

    bank_balance = sum(
        account.balance
        for account in accounts
    )

    active_fds = (
        db.query(FixedDeposit)
        .filter(FixedDeposit.status == "active")
        .all()
    )

    fd_value = sum(
        fd.maturity_amount
        for fd in active_fds
    )

    rd_payments = db.query(RDPayment).all()

    rd_value = sum(
        payment.amount
        for payment in rd_payments
    )

    total_net_worth = (
        bank_balance +
        fd_value +
        rd_value
    )

    return {
        "bank_balance": bank_balance,
        "fd_value": fd_value,
        "rd_value": rd_value,
        "total_net_worth": total_net_worth
    }