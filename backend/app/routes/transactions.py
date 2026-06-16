from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from decimal import Decimal

from app.database import get_db
from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import TransactionCreate, TransferRequest

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)

@router.post("/deposit")
def deposit(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):

    account = db.query(Account).filter(
        Account.account_id == transaction.account_id
    ).first()

    if not account:
        return {"message": "Account not found"}

    account.balance += Decimal(str(transaction.amount))

    new_transaction = Transaction(
        account_id=transaction.account_id,
        amount=transaction.amount,
        transaction_type="deposit",
        description=transaction.description
    )

    db.add(new_transaction)

    db.commit()

    return {"message": "Deposit successful"}

@router.post("/withdraw")
def withdraw(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):

    account = db.query(Account).filter(
        Account.account_id == transaction.account_id
    ).first()

    if not account:
        return {"message": "Account not found"}

    if account.balance < transaction.amount:
        return {"message": "Insufficient balance"}

    account.balance -= Decimal(str(transaction.amount))

    new_transaction = Transaction(
        account_id=transaction.account_id,
        amount=transaction.amount,
        transaction_type="withdraw",
        description=transaction.description
    )

    db.add(new_transaction)

    db.commit()

    return {"message": "Withdrawal successful"}

@router.post("/transfer")
def transfer(
    transfer: TransferRequest,
    db: Session = Depends(get_db)
):

    sender = db.query(Account).filter(
        Account.account_id == transfer.from_account_id
    ).first()

    receiver = db.query(Account).filter(
        Account.account_id == transfer.to_account_id
    ).first()

    if not sender:
        raise HTTPException(
            status_code=404,
            detail="Sender account not found"
        )

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="Receiver account not found"
        )

    if transfer.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than 0"
        )

    if transfer.from_account_id == transfer.to_account_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot transfer to the same account"
        )

    if sender.balance < transfer.amount:
        raise HTTPException(
            status_code=400,
            detail="Insufficient funds"
        )

    sender.balance -= transfer.amount
    receiver.balance += transfer.amount

    sender_transaction = Transaction(
        account_id=sender.account_id,
        amount=transfer.amount,
        transaction_type="transfer_out",
        description=transfer.description
    )

    receiver_transaction = Transaction(
        account_id=receiver.account_id,
        amount=transfer.amount,
        transaction_type="transfer_in",
        description=transfer.description
    )

    db.add(sender_transaction)
    db.add(receiver_transaction)

    db.commit()

    return {
        "message": "Transfer successful",
        "from_account_id": sender.account_id,
        "to_account_id": receiver.account_id,
        "amount": transfer.amount
    }

@router.get("/{account_id}")
def get_transactions(
    account_id: int,
    db: Session = Depends(get_db)
):

    transactions = db.query(Transaction).filter(
        Transaction.account_id == account_id
    ).all()

    return transactions
