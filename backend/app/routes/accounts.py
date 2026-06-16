from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.account import Account
from app.models.user import User
from app.schemas.account import AccountCreate

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"]
)

@router.post("")
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
    User.user_id == account.user_id
    ).first()

    if not existing_user:
        return {"message": "User does not exist"} 

    new_account = Account(
        user_id=account.user_id,
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

@router.get("/{user_id}")
def get_accounts(user_id: int, db: Session = Depends(get_db)):

    accounts = db.query(Account).filter(
        Account.user_id == user_id
    ).all()

    return accounts

