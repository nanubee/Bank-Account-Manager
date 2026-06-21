from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.schemas.user import UserLogin
from app.schemas.user import UserCreate, EmailUpdate, PasswordUpdate
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.asset import Asset
from app.models.fixed_deposit import FixedDeposit
from app.models.mutual_fund import MutualFund
from app.models.rd_payment import RDPayment
from app.models.recurring_deposit import RecurringDeposit
from app.models.stock import Stock

from app.core.security import hash_password
from app.core.auth import get_current_user
from app.core.security import verify_password
from app.core.auth import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )
    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hashed_password,
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.user_id
    }


@router.post("/login")
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        user_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {"sub": str(user.user_id)}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "user_id": current_user.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role
    }

@router.put("/change-email")
def change_email(
    email_data: EmailUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == email_data.new_email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )
    current_user.email = email_data.new_email

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Email updated successfully",
    }

@router.put("/change-password")
def change_password(
    password_data: PasswordUpdate,
    current_user: User =  Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(
        password_data.old_password,
        current_user.password_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="Incorrect password"
        )
    
    hashed_password = hash_password(
        password_data.new_password
    )

    current_user.password_hash = hashed_password

    db.commit()
    return {
        "message": "Password updated successfully"
    }

@router.delete("/delete-account")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accounts = db.query(Account).filter(
        Account.user_id == current_user.user_id
    ).all()
    for account in accounts:
        db.query(Transaction).filter(
            Transaction.account_id == account.account_id
        ).delete()

        db.query(Asset).filter(
            Asset.account_id == account.account_id
        ).delete()

        db.query(FixedDeposit).filter(
            FixedDeposit.account_id == account.account_id
        ).delete()

        db.query(MutualFund).filter(
            MutualFund.account_id == account.account_id
        ).delete()

        db.query(RDPayment).filter(
            RDPayment.account_id == account.account_id
        ).delete()

        db.query(RecurringDeposit).filter(
            RecurringDeposit.account_id == account.account_id
        ).delete()

        db.query(Stock).filter(
            Stock.account_id == account.account_id
        ).delete()

        db.delete(account)
    db.delete(current_user)
    db.commit()