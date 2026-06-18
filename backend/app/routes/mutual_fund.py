from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.mutual_fund import MutualFund
from app.models.account import Account
from app.schemas.mutual_fund import MFUpdate

from app.schemas.mutual_fund import MFCreate

router = APIRouter(
    prefix="/mfs",
    tags=["Mutual Fund"]
)

# Create Mutual Fund
@router.post("/")
def create_mf(
    mf: MFCreate,
    db: Session = Depends(get_db)
):
    account = (
        db.query(Account)
        .filter(Account.account_id == mf.account_id)
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )
    
    new_mf = MutualFund(
        account_id=mf.account_id,
        fund_name=mf.fund_name,
        invested_amount=mf.invested_amount,
        current_value=mf.current_value,
        purchase_date=mf.purchase_date)

    db.add(new_mf)
    db.commit()
    db.refresh(new_mf)

    return new_mf


# Get all mf belonging to a user
@router.get("/user/{user_id}")
def get_mf_by_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(MutualFund)
        .join(Account)
        .filter(Account.user_id == user_id)
        .all()
    )


# Get FD by ID
@router.get("/{mf_id}")
def get_mf(
    mf_id: int,
    db: Session = Depends(get_db)
):
    mf = (
        db.query(MutualFund)
        .filter(MutualFund.mf_id == mf_id)
        .first()
    )

    if not mf:
        raise HTTPException(
            status_code=404,
            detail="MF not found"
        )

    return mf


# Close FD
@router.delete("/{mf_id}")
def close_mf(
    mf_id: int,
    db: Session = Depends(get_db)
):
    mf = (
        db.query(MutualFund)
        .filter(MutualFund.mf_id == mf_id)
        .first()
    )

    if not mf:
        raise HTTPException(
            status_code=404,
            detail="MF not found"
        )

    db.delete(mf)
    db.commit()

    return {
        "message": "MF closed successfully"
    }


@router.put("/{mf_id}")
def update_mf(
    mf_id: int,
    mf_update: MFUpdate,
    db: Session = Depends(get_db)
):
    mf = (
        db.query(MutualFund)
        .filter(MutualFund.mf_id == mf_id)
        .first()
    )

    if not mf:
        raise HTTPException(
            status_code=404,
            detail="MF not found"
        )

    mf.fund_name = mf_update.fund_name
    mf.invested_amount = mf_update.invested_amount
    mf.current_value = mf_update.current_value

    db.commit()
    db.refresh(mf)

    return mf