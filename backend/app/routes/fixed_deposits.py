from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.fixed_deposit import FixedDeposit
from app.models.account import Account

from app.schemas.fixed_deposit import FDCreate

router = APIRouter(
    prefix="/fds",
    tags=["Fixed Deposits"]
)


# Create Fixed Deposit
@router.post("/")
def create_fd(
    fd: FDCreate,
    db: Session = Depends(get_db)
):
    account = (
        db.query(Account)
        .filter(Account.account_id == fd.account_id)
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    if account.balance < fd.amount:
        raise HTTPException(
            status_code=400,
            detail="Insufficient balance"
        )

    maturity_amount = (
        fd.amount +
        (
            fd.amount
            * fd.interest_rate
            * fd.duration_months
            / (12 * 100)
        )
    )

    account.balance -= fd.amount

    new_fd = FixedDeposit(
        account_id=fd.account_id,
        amount=fd.amount,
        interest_rate=fd.interest_rate,
        start_date=fd.start_date,
        duration_months=fd.duration_months,
        maturity_amount=maturity_amount,
        status="active"
    )

    db.add(new_fd)
    db.commit()
    db.refresh(new_fd)

    return new_fd


# Get all FDs belonging to a user
@router.get("/user/{user_id}")
def get_fds_by_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(FixedDeposit)
        .join(Account)
        .filter(Account.user_id == user_id)
        .all()
    )


# Get FD by ID
@router.get("/{fd_id}")
def get_fd(
    fd_id: int,
    db: Session = Depends(get_db)
):
    fd = (
        db.query(FixedDeposit)
        .filter(FixedDeposit.fd_id == fd_id)
        .first()
    )

    if not fd:
        raise HTTPException(
            status_code=404,
            detail="FD not found"
        )

    return fd


# Close FD
@router.post("/{fd_id}/close")
def close_fd(
    fd_id: int,
    db: Session = Depends(get_db)
):
    fd = (
        db.query(FixedDeposit)
        .filter(FixedDeposit.fd_id == fd_id)
        .first()
    )

    if not fd:
        raise HTTPException(
            status_code=404,
            detail="FD not found"
        )

    if fd.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="FD already closed"
        )

    account = (
        db.query(Account)
        .filter(Account.account_id == fd.account_id)
        .first()
    )

    account.balance += fd.maturity_amount

    fd.status = "closed"

    db.commit()

    return {
        "message": "FD closed successfully",
        "credited_amount": fd.maturity_amount
    }