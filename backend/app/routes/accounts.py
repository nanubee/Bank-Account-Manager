from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.account import Account
from app.models.user import User
from app.models.asset import Asset
from app.schemas.account import AccountCreate
from app.core.auth import get_current_user
from app.models.transaction import Transaction
from app.models.asset import Asset
from app.models.fixed_deposit import FixedDeposit
from app.models.mutual_fund import MutualFund
from app.models.rd_payment import RDPayment
from app.models.recurring_deposit import RecurringDeposit
from app.models.stock import Stock

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"]
)

@router.post("")
def create_account(
    account: AccountCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_account = Account(
        user_id=current_user.user_id,
        bank_name=account.bank_name,
        country=account.country,
        account_type=account.account_type,
        account_number_last4=account.account_number_last4,
        balance=account.balance,
        currency=account.currency
        )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return {
        "message": "Account created successfully",
        "account_id": new_account.account_id
    }

@router.get("")
def get_accounts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Account)
        .filter(
            Account.user_id == current_user.user_id
        )
        .all()
    )

@router.delete("/{account_id}")
def delete_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    account = (
        db.query(Account)
        .filter(
            Account.account_id == account_id,
            Account.user_id == current_user.user_id
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    if account.balance > 0:
        raise HTTPException(
            status_code=400,
            detail="Account balance must be zero before deletion"
        )

    asset_exists = db.query(Asset).filter(
        Asset.account_id == account_id
    ).first()

    if asset_exists:
        raise HTTPException(
            status_code=400,
            detail="Account contains assets"
        )

    active_fd = db.query(FixedDeposit).filter(
        FixedDeposit.account_id == account_id,
        FixedDeposit.status == "Active"
    ).first()

    if active_fd:
        raise HTTPException(
            status_code=400,
            detail="Account contains active fixed deposits"
        )

    active_rd = db.query(RecurringDeposit).filter(
        RecurringDeposit.account_id == account_id,
        RecurringDeposit.status == "Active"
    ).first()

    if active_rd:
        raise HTTPException(
            status_code=400,
            detail="Account contains active recurring deposits"
        )

    mf_exists = db.query(MutualFund).filter(
        MutualFund.account_id == account_id
    ).first()

    if mf_exists:
        raise HTTPException(
            status_code=400,
            detail="Account contains mutual funds"
        )

    stock_exists = db.query(Stock).filter(
        Stock.account_id == account_id
    ).first()

    if stock_exists:
        raise HTTPException(
            status_code=400,
            detail="Account contains stocks"
        )

    db.query(Transaction).filter(
        Transaction.account_id == account_id
    ).delete()

    db.delete(account)
    db.commit()

    return {
        "message": "Account deleted successfully"
    }