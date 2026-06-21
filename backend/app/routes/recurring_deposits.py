from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.account import Account
from app.models.recurring_deposit import RecurringDeposit
from app.models.rd_payment import RDPayment
from app.models.user import User
from app.core.auth import get_current_user

from app.schemas.recurring_deposit import RDCreate
from app.schemas.rd_payment import RDPaymentCreate

#create Rd
router = APIRouter(
    prefix="/rds",
    tags=["Recurring Deposits"]
)


# Creates an RD plan
@router.post("/")
def create_rd(
    rd: RDCreate,
    current_user: User= Depends(get_current_user),
    db: Session = Depends(get_db)
):

    account = (
        db.query(Account)
        .filter(Account.account_id == rd.account_id, 
                Account.user_id == current_user.user_id)
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    new_rd = RecurringDeposit(
        account_id=rd.account_id,
        monthly_amount=rd.monthly_amount,
        interest_rate=rd.interest_rate,
        start_date=rd.start_date,
        duration_months=rd.duration_months,
        status="active"
    )

    db.add(new_rd)
    db.commit()
    db.refresh(new_rd)

    return new_rd

#Get RDs
# Returns RDs
@router.get("/user")
def get_rds_by_user(
    #user_id: int,
    Current_user: User= Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(RecurringDeposit)
        .join(Account)
        .filter(Account.user_id == Current_user.user_id)
        .all()
    )

#Get one RD
# Returns a single RD
@router.get("/{rd_id}")
def get_rd(
    rd_id: int,
    db: Session = Depends(get_db)
):

    rd = (
        db.query(RecurringDeposit)
        .filter(RecurringDeposit.rd_id == rd_id)
        .first()
    )

    if not rd:
        raise HTTPException(
            status_code=404,
            detail="RD not found"
        )

    return rd

#Create RD after checking existense, balance, deduct money
# Makes an RD installment payment
@router.post("/{rd_id}/payments")
def create_rd_payment(
    rd_id: int,
    payment: RDPaymentCreate,
    db: Session = Depends(get_db)
):

    rd = (
        db.query(RecurringDeposit)
        .filter(RecurringDeposit.rd_id == rd_id)
        .first()
    )

    if not rd:
        raise HTTPException(
            status_code=404,
            detail="RD not found"
        )

    account = (
    db.query(Account)
    .filter(Account.account_id == rd.account_id)
    .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    if account.balance < rd.monthly_amount:
        raise HTTPException(
            status_code=400,
            detail="Insufficient balance"
        )

    amount = rd.monthly_amount

    installments_paid = (
    db.query(RDPayment)
    .filter(RDPayment.rd_id == rd_id)
    .count()
)

    if installments_paid >= rd.duration_months:
        raise HTTPException(
            status_code=400,
            detail="All installments already completed"
        )

    account.balance -= amount

    rd_payment = RDPayment(
        rd_id=rd_id,
        account_id=rd.account_id,
        amount=rd.monthly_amount,
        payment_date=payment.payment_date
    )

    db.add(rd_payment)

    installments_paid += 1

    if installments_paid == rd.duration_months:
        rd.status = "closed"

    db.commit()
    db.refresh(rd_payment)

    return rd_payment

#get payment history
# Returns all payments made for an RD
@router.get("/{rd_id}/payments")
def get_rd_payments(
    rd_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(RDPayment)
        .filter(RDPayment.rd_id == rd_id)
        .all()
    )

# Returns RD progress and maturity summary
@router.get("/{rd_id}/summary")
def get_rd_summary(
    rd_id: int,
    db: Session = Depends(get_db)
):

    rd = (
        db.query(RecurringDeposit)
        .filter(RecurringDeposit.rd_id == rd_id)
        .first()
    )

    if not rd:
        raise HTTPException(
            status_code=404,
            detail="RD not found"
        )

    payments = (
        db.query(RDPayment)
        .filter(RDPayment.rd_id == rd_id)
        .all()
    )

    total_paid = sum(
        payment.amount
        for payment in payments
    )

    installments_paid = len(payments)

    installments_remaining = (
        rd.duration_months -
        installments_paid
    )

    expected_total_contribution = (
        rd.monthly_amount *
        rd.duration_months
    )

    expected_interest = (
        expected_total_contribution *
        rd.interest_rate *
        rd.duration_months
        / 1200
    )

    expected_maturity_amount = (
        expected_total_contribution +
        expected_interest
    )

    return {
        "rd_id": rd.rd_id,
        "status": rd.status,
        "monthly_amount": rd.monthly_amount,
        "duration_months": rd.duration_months,
        "interest_rate": rd.interest_rate,
        "total_paid": total_paid,
        "installments_paid": installments_paid,
        "installments_remaining": installments_remaining,
        "expected_total_contribution": expected_total_contribution,
        "expected_maturity_amount": expected_maturity_amount
    }

@router.delete("/{rd_id}")
def delete_rd(
    rd_id: int,
    db: Session = Depends(get_db)
):
    rd = (
        db.query(RecurringDeposit)
        .filter(RecurringDeposit.rd_id == rd_id)
        .first()
    )

    if not rd:
        raise HTTPException(
            status_code=404,
            detail="RD not found"
        )

    if rd.status == "active":
        raise HTTPException(
            status_code=400,
            detail="Complete the RD before deleting"
        )

    db.query(RDPayment).filter(
        RDPayment.rd_id == rd_id
    ).delete()

    db.delete(rd)

    db.commit()

    return {
        "message": "RD deleted successfully"
    }

@router.post("/{rd_id}/close")
def close_rd(
    rd_id: int,
    db: Session = Depends(get_db)
):
    rd = (
        db.query(RecurringDeposit)
        .filter(RecurringDeposit.rd_id == rd_id)
        .first()
    )

    if not rd:
        raise HTTPException(
            status_code=404,
            detail="RD not found"
        )

    if rd.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="RD already closed"
        )

    rd.status = "closed"

    db.commit()

    return {
        "message": "RD closed successfully"
    }