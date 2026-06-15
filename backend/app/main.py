from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from .database import get_db
from .models import User, Account, Transaction
from .schemas import UserCreate
from .schemas import UserLogin
from .schemas import AccountCreate, TransactionCreate, TransferRequest

from decimal import Decimal

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        role="user"
    )
    existing_user = db.query(User).filter(
    User.email == user.email
    ).first()

    if existing_user:
        return {"error": "Email already registered"}
    else:
        db.add(new_user)
        db.commit()

        return {"message": "User registered"}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {"message": "Invalid email or password"}

    if not pwd_context.verify(
        user.password,
        existing_user.password_hash
    ):
        return {"message": "Invalid email or password"}

    return {"message": "Login successful"}

@app.post("/accounts")
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
    User.user_id == account.user_id
    ).first()

    if not existing_user:
        return {"message": "User does not exist"} 

    else:
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
    
@app.get("/accounts/{user_id}")
def get_accounts(user_id: int, db: Session = Depends(get_db)):

    accounts = db.query(Account).filter(
        Account.user_id == user_id
    ).all()

    return accounts

@app.post("/deposit")
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

@app.post("/withdraw")
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

@app.get("/transactions/{account_id}")
def get_transactions(
    account_id: int,
    db: Session = Depends(get_db)
):

    transactions = db.query(Transaction).filter(
        Transaction.account_id == account_id
    ).all()

    return transactions

@app.post("/transfer")
def transfer_money(
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