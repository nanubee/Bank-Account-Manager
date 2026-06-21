from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.account import Account
from app.models.fixed_deposit import FixedDeposit
from app.models.rd_payment import RDPayment
from app.models.mutual_fund import MutualFund
from app.models.stock import Stock
from app.models.asset import Asset
from app.models.user import User
from app.core.auth import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/net-worth")
def get_net_worth(
    #user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accounts = (
        db.query(Account)
        .filter(Account.user_id == current_user.user_id)
        .all()
    )

    account_ids = [
        account.account_id
        for account in accounts
    ]

    bank_balance = sum(
        account.balance
        for account in accounts
    )

    active_fds = (
        db.query(FixedDeposit)
        .filter(
            FixedDeposit.account_id.in_(account_ids),
            FixedDeposit.status == "active"
        )
        .all()
    )

    fd_value = sum(
        fd.maturity_amount
        for fd in active_fds
    )

    rd_payments = (
        db.query(RDPayment)
        .filter(
            RDPayment.account_id.in_(account_ids)
        )
        .all()
    )

    rd_value = sum(
        payment.amount
        for payment in rd_payments
    )

    mutual_funds = (
        db.query(MutualFund)
        .filter(
            MutualFund.account_id.in_(account_ids)
        )
        .all()
    )

    mf_value = sum(
        mf.current_value
        for mf in mutual_funds
    )

    stocks = (
        db.query(Stock)
        .filter(
            Stock.account_id.in_(account_ids)
        )
        .all()
    )

    stock_value = sum(
        stock.current_value
        for stock in stocks
    )

    assets = (
        db.query(Asset)
        .filter(
            Asset.account_id.in_(account_ids)
        )
        .all()
    )

    asset_value = sum(
        asset.current_value
        for asset in assets
    )

    total_net_worth = (
        bank_balance +
        fd_value +
        rd_value +
        mf_value +
        stock_value +
        asset_value
    )

    return {
        "bank_balance": float(bank_balance or 0),
        "fd_value": float(fd_value or 0),
        "rd_value": float(rd_value or 0),
        "mf_value": float(mf_value or 0),
        "stock_value": float(stock_value or 0),
        "asset_value": float(asset_value or 0),
        "total_net_worth": float(total_net_worth or 0)
    }